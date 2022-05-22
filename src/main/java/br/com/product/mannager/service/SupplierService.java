package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.*;
import br.com.product.mannager.models.enums.Messages;
import br.com.product.mannager.models.enums.SupplierFilter;
import br.com.product.mannager.utils.DateService;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierService implements CrudInterface<Supplier, SupplierFilter>{

    private final MongoTemplate template;

    public SupplierService(MongoTemplate template){
        this.template = template;
    }

    @Override
    public Response<Supplier> create(User user, Supplier obj) throws CrudErrorException {
        try{
            obj.setHistory(
                    List.of(new History(
                                    DateService.getDate(),
                                    Messages.HISTORY_CREATED_SUCCESSFULLY.getMsg().replace("@USER", user.getCode())
                    )
            ));

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
    public Response<String> update(User user, Supplier obj) throws CrudErrorException {
        try{
            Query query = new Query(Criteria.where("code").is(obj.getCode()));
            Update update = new Update()
                    .push("history",
                            new History(DateService.getDate(),
                            Messages.HISTORY_UPDATED_SUCCESSFULLY.getMsg().replace("@USER",user.getCode())))
                    .set("name", obj.getName())
                    .set("email", obj.getEmail())
                    .set("phone", obj.getPhone())
                    .set("observation", obj.getObservation()
            );
            return new Response<>(
                    this.getQuantity(),
                    String.valueOf(template.updateFirst(query, update, Supplier.class).getModifiedCount()),
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro crítico ao alterar o fornecedor.");
        }
    }

    @Override
    public Response<Long> delete(User user, String code) throws CrudErrorException {
        try{
            Query query = new Query(Criteria.where("code").is(code));
            Update update = new Update()
                    .push("history",
                            new History(DateService.getDate(),
                            Messages.HISTORY_DELETED_SUCCESSFULLY.getMsg().replace("@USER",user.getCode())))
                    .set("deleted", true);

            long deleteCount = template.updateFirst(query, update, Supplier.class).getModifiedCount();
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
    public Response<List<Supplier>> read(int skip, int limit, boolean deleted) throws CrudErrorException {
        try{
            if(limit > 100){
                limit = 100;
            }

            Query query = new Query(Criteria.where("deleted").is(deleted));
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
    public Response<List<Supplier>> read(int skip, int limit, SupplierFilter filter, String search, boolean deleted) throws CrudErrorException {
        try{
            if(limit > 100){
                limit = 100;
            }

            Query query = new Query(Criteria.where(filter.getFilter()).regex(search, "i"));
            query.addCriteria(Criteria.where("deleted").is(deleted));
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
