package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.UserException;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final FirebaseService firebaseService;
    private final MongoTemplate template;

    public UserService(MongoTemplate template, FirebaseService firebaseService){
        this.firebaseService = firebaseService;
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

            if(token.contains("Bearer")){
                token = token.split(" ")[1];
            }

            Response<User> response = new Response<>();
            response.setMessage("OK");
            User user = firebaseService.getUserByToken(token);
            response.setResponse(user);
            return response;

        }catch (Exception e){
            throw new UserException("Erro ao buscar esse usuario, verifique a estrutura da requisicao!");
        }
    }

    public Response<String> getUidByToken(String token) throws UserException {
        try{

            Response<String> response = new Response<>();
            response.setMessage("OK");
            response.setResponse(firebaseService.getUidByIdToken(token));
            return response;

        }catch (Exception e){
            throw new UserException("Erro ao converter token em uid!");
        }
    }

    public User getUserByUid(String uid){
        return template.findOne(new Query(Criteria.where("uid").is(uid)), User.class);
    }

}
