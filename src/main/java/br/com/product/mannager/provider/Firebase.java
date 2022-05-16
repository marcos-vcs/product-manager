package br.com.product.mannager.provider;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.io.FileInputStream;

@Service
public class Firebase {

    @PostConstruct
    public void initialization(){

        FileInputStream serviceAccount;

        try {

            serviceAccount = new FileInputStream("firebase-key.json");

            @SuppressWarnings("deprecation")
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);

        }catch (Exception e) {
            e.printStackTrace();
        }
    }

}
