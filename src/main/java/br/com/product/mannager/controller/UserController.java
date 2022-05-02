package br.com.product.mannager.controller;

import br.com.product.mannager.models.Product;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.User;
import br.com.product.mannager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Objects;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService service;

    public UserController(UserService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Response<User>> verifyUser(@RequestHeader("Authorization") String token){
        Response<User> response = new Response<>();
        try{
            return new ResponseEntity<>(this.service.verifyUser(token), HttpStatus.OK);
        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/token-to-uid")
    public ResponseEntity<Response<String>> tokenToUid(@RequestHeader("Authorization") String token){
        Response<String> response = new Response<>();
        try{
            return new ResponseEntity<>(this.service.getUidByToken(token), HttpStatus.OK);
        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping
    public ResponseEntity<Response<User>> create(@Valid User user, BindingResult validationResult){
        Response<User> response = new Response<>();
        try{
            if(validationResult.hasErrors()){
                response.setMessage(Objects.requireNonNull(validationResult.getFieldError()).toString());
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.create(user), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

}
