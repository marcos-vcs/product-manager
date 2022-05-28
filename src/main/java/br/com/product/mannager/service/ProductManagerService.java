package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.*;
import br.com.product.mannager.models.enums.Messages;
import br.com.product.mannager.models.enums.ProductFilter;
import br.com.product.mannager.utils.DateService;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
public class ProductManagerService implements CrudInterface<Product, ProductFilter> {

    private final MongoTemplate template;

    public ProductManagerService(MongoTemplate template) {
        this.template = template;
    }

    @Override
    public Response<Product> create(User user, Product obj) throws CrudErrorException {
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
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro critico na criação do objeto");
        }
    }

    @Override
    public Response<Product> update(User user, Product obj) throws CrudErrorException {
        Response<Product> response = new Response<>();
        try{
            Query query = new Query(Criteria.where("code").is(obj.getCode()));
            Update update = new Update()
                    .push("history",
                            new History(DateService.getDate(),
                            Messages.HISTORY_UPDATED_SUCCESSFULLY.getMsg().replace("@USER",user.getCode())))
                    .set("name", obj.getName())
                    .set("url", obj.getUrl())
                    .set("brand", obj.getBrand())
                    .set("price", obj.getPrice());
            long modifications = this.template.updateFirst(query, update, Product.class).getModifiedCount();

            response.setResponse(this.template.findOne(query, Product.class));
            response.setQuantity(getQuantity());
            response.setMessage("OK: MODIFICAÇÕES - " + modifications);
            return response;

        }catch (Exception e){
            throw new CrudErrorException("Erro critico na edição do objeto");
        }
    }

    @Override
    public Response<Long> delete(User user, String code) throws CrudErrorException{
        try{
            Query query = new Query(Criteria.where("code").is(code));
            Update update = new Update()
                    .push("history",
                            new History(DateService.getDate(),
                                    Messages.HISTORY_DELETED_SUCCESSFULLY.getMsg().replace("@USER",user.getCode())))
                    .set("deleted", !Objects.requireNonNull(template.findOne(query, Product.class)).isDeleted());

            long deleteCount = template.updateFirst(query, update, Product.class).getModifiedCount();
            return new Response<>(
                    this.getQuantity(),
                    deleteCount,
                    "OK"
            );
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro critico na exclusão do objeto.");
        }
    }

    @Override
    public Response<Long> cleanTrash(String code) throws CrudErrorException {
        try{

            Query query = new Query(Criteria.where("deleted").is(true));
            query.addCriteria(code != null ? Criteria.where("code").is(code) : Criteria.where(""));

            return new Response<>(
                    getQuantityTrash(),
                    template.remove(query, Product.class).getDeletedCount(),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro critico ao limpar lixeira.");
        }
    }

    @Override
    public Response<List<Product>> read(int skip, int limit, boolean deleted) throws CrudErrorException {
        try{
            if(limit > 100){
                limit = 100;
            }
            Query query = new Query(Criteria.where("deleted").is(deleted));
            query.with(Sort.by(Sort.Direction.DESC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    deleted ? getQuantityTrash() : getQuantity(),
                    this.template.find(query, Product.class),
                    "OK"
            );

        }catch (Exception e){
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro critico ao obter registros");
        }
    }

    @Override
    public Response<List<Product>> read(int skip, int limit, ProductFilter filter, String search, boolean deleted) throws CrudErrorException {
        try{
            if(limit > 100){
                limit = 100;
            }

            Query query = new Query(Criteria.where(filter.getFilter()).regex(search, "i"));
            query.addCriteria(Criteria.where("deleted").is(deleted));
            query.with(Sort.by(Sort.Direction.ASC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    deleted ? getQuantityTrash(filter, search) : getQuantity(filter, search),
                    this.template.find(query, Product.class),
                    "OK"
            );

        }catch (Exception e){
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro critico ao obter registros");
        }
    }

    private long getQuantity(){
        return this.template.count(new Query(Criteria.where("deleted").is(false)), Product.class);
    }

    private long getQuantity(ProductFilter filter, String search){
        return this.template.count(new Query(Criteria.where("deleted").is(false).and(filter.getFilter()).is(search)), Supplier.class);
    }

    private long getQuantityTrash(){
        return this.template.count(new Query(Criteria.where("deleted").is(true)), Product.class);
    }

    private long getQuantityTrash(ProductFilter filter, String search){
        return this.template.count(new Query(Criteria.where("deleted").is(true).and(filter.getFilter()).is(search)), Supplier.class);
    }

}
