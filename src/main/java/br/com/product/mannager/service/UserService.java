package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.UserException;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.User;
import br.com.product.mannager.provider.Firebase;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    Firebase firebase;
    private final MongoTemplate template;

    public UserService(MongoTemplate template){
        this.template = template;
    }

    public Response<User> create(User user) throws UserException {
        try{

            Query query = new Query(Criteria.where("email").is(user.getEmail()));
            User verify = this.template.findOne(query, User.class);
            if(verify != null){
                throw new UserException("Usuario ja existe!");
            }else{
                Response<User> response = new Response<>();
                response.setMessage("OK");
                response.setResponse(this.template.save(user));
                return response;
            }

        }catch (Exception e){
            throw new UserException("Erro ao criar usuario, verifique a consistencia dos dados.");
        }
    }

    public Response<User> verifyUser(String token) throws UserException {
        try{

            Response<User> response = new Response<>();
            response.setMessage("OK");
            response.setResponse(firebase.getUserByToken(token));
            return response;

        }catch (Exception e){
            throw new UserException("Erro ao buscar esse usuario, verifique a estrutura da requisicao!");
        }
    }

    public Response<String> getUidByToken(String token) throws UserException {
        try{

            Response<String> response = new Response<>();
            response.setMessage("OK");
            response.setResponse(firebase.getUidByIdToken(token));
            return response;

        }catch (Exception e){
            throw new UserException("Erro ao converter token em uid!");
        }
    }

}
