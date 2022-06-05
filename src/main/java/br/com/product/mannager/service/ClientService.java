package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.*;
import br.com.product.mannager.models.enums.Messages;
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
public class ClientService implements CrudInterface<Client, String>{

    private final MongoTemplate template;

    public ClientService(MongoTemplate template){
        this.template = template;
    }

    @Override
    public Response<Client> create(User user, Client obj) throws CrudErrorException {
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
            throw new CrudErrorException("Nao foi possivel criar esse cliente!");
        }
    }

    @Override
    public Response<Long> update(User user, Client obj) throws CrudErrorException {
        try{

            Query query = new Query(Criteria.where("code").is(obj.getCode()));
            Update update = new Update()
                    .push("history",
                    new History(DateService.getDate(),
                            Messages.HISTORY_UPDATED_SUCCESSFULLY.getMsg().replace("@USER",user.getCode()))
                    )
                    .set("name", obj.getName());

            return new Response<>(
                    getQuantity(),
                    this.template.updateFirst(query, update, Client.class).getModifiedCount(),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro ao alterar o cliente!");
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
                    .set("deleted", !Objects.requireNonNull(template.findOne(query, Client.class)).isDeleted());

            long deleteCount = template.updateFirst(query, update, Client.class).getModifiedCount();
            return new Response<>(
                    this.getQuantity(),
                    deleteCount,
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro ao mover cliente para a lixeira!");
        }
    }

    @Override
    public Response<Long> cleanTrash(String code) throws CrudErrorException {
        try{

            Query query = new Query(Criteria.where("deleted").is(true));
            if(code != null){
                query.addCriteria(Criteria.where("code").is(code));
            }

            return new Response<>(
                    getQuantityTrash(),
                    template.remove(query, Client.class).getDeletedCount(),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro ao limpar a lixeira!");
        }

    }

    @Override
    public Response<List<Client>> read(int skip, int limit, boolean deleted) throws CrudErrorException {
        try{

            if(limit > 100){
                limit = 100;
            }
            Query query = new Query(Criteria.where("deleted").is(deleted));
            query.with(Sort.by(Sort.Direction.DESC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    deleted ? getQuantityTrash() : getQuantity(),
                    this.template.find(query, Client.class),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Erro ao buscar registros!");
        }
    }

    @Override
    public Response<List<Client>> read(int skip, int limit, String s, String search, boolean deleted) throws CrudErrorException {
        try{

            if(limit > 100){
                limit = 100;
            }

            Query query = new Query(Criteria.where("name").regex(search, "i"));
            query.addCriteria(Criteria.where("deleted").is(deleted));
            query.with(Sort.by(Sort.Direction.ASC, "name"));
            query.skip(skip).limit(limit);
            return new Response<>(
                    deleted ? getQuantityTrashByName(search) : getQuantityByName(search),
                    this.template.find(query, Client.class),
                    "OK"
            );

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            throw new CrudErrorException("Nao foi possivel pesquisar cliente!");

        }
    }

    private long getQuantity(){
        return this.template.count(new Query(Criteria.where("deleted").is(false)), Client.class);
    }

    private long getQuantityByName(String name){
        return this.template.count(new Query(Criteria.where("name").is(name).and("deleted").is(false)), Client.class);
    }

    private long getQuantityTrash(){
        return this.template.count(new Query(Criteria.where("deleted").is(true)), Client.class);
    }

    private long getQuantityTrashByName(String name){
        return this.template.count(new Query(Criteria.where("name").is(name).and("deleted").is(true)), Client.class);
    }

}
