package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.UserException;
import br.com.product.mannager.models.User;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.StorageClient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    private final MongoTemplate template;

    public FirebaseService(MongoTemplate template){
        this.template = template;
    }

    public User getUserByToken(String token) throws UserException {
        try{
            String uid = FirebaseAuth.getInstance().verifyIdToken(token).getUid();
            return template.findOne(new Query(Criteria.where("uid").is(uid)), User.class);
        }catch (Exception e){
            e.printStackTrace();
            throw new UserException("Erro ao encontrar usuario no firebase");
        }
    }

    public String getUidByIdToken(String token){
        try{
            return FirebaseAuth.getInstance().verifyIdToken(token).getUid();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

}
