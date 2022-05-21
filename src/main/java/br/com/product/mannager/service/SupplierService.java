package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.Filter;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.Supplier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierService implements CrudInterface<Supplier>{

    MongoTemplate template;

    public SupplierService(MongoTemplate template){
        this.template = template;
    }

    @Override
    public Response<Supplier> create(Supplier obj) throws CrudErrorException {
        try{
            if(obj.getCode() != null){
                throw new CrudErrorException("não informe code na criação de um novo fornecedor!");
            }

            return new Response<>(
                    this.getQuantity(),
                    template.save(obj),
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao criar o fornecedor.");
        }
    }

    @Override
    public Response<Long> update(Supplier obj) throws CrudErrorException {
        try{
            if(obj.getCode() == null || obj.getCode().equals("")){
                throw new CrudErrorException("code informado é inválido!");
            }

            Query query = new Query(Criteria.where("code").is(obj.getCode()));
            Update update = new Update()
                    .set("name", obj.getName())
                    .set("email", obj.getEmail())
                    .set("phone", obj.getPhone())
                    .set("observation", obj.getObservation()
            );
            return new Response<>(
                    this.getQuantity(),
                    template.updateFirst(query, update, Supplier.class).getModifiedCount(),
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao alterar o fornecedor.");
        }
    }

    @Override
    public Response<Long> delete(String code) throws CrudErrorException {
        try{
            Query query = new Query(Criteria.where("code").is(code));
            long deleteCount = template.remove(query, Supplier.class).getDeletedCount();
            return new Response<>(
                    this.getQuantity(),
                    deleteCount,
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao excluir o fornecedor.");
        }
    }

    @Override
    public Response<List<Supplier>> read(int skip, int limit) throws CrudErrorException {
        try{

            if(limit > 100){
                limit = 100;
            }

            Query query = new Query();
            query.with(Sort.by(Sort.Direction.DESC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    this.getQuantity(),
                    this.template.find(query, Supplier.class),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao buscar o fornecedor.");
        }
    }

    @Override
    public Response<List<Supplier>> read(int skip, int limit, Filter filter, String search) throws CrudErrorException {
        try{

            if(limit > 100){
                limit = 100;
            }

            Query query = new Query(Criteria.where(filter.getFilter()).regex(search, "i"));
            query.with(Sort.by(Sort.Direction.DESC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    this.getQuantity(),
                    template.find(query, Supplier.class),
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao buscar o fornecedor.");
        }
    }

    private long getQuantity(){
        return this.template.count(new Query(), Supplier.class);
    }

}
