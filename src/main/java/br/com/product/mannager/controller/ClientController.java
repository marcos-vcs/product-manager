package br.com.product.mannager.controller;

import br.com.product.mannager.exceptions.PaginationException;
import br.com.product.mannager.models.Client;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.User;
import br.com.product.mannager.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/client-manager")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Response<Client>> create(@RequestAttribute("user") User user, @Valid @RequestBody Client client, BindingResult validationResult){
        Response<Client> response = new Response<>();
        try{
            if(validationResult.hasErrors()){
                response.setMessage(Objects.requireNonNull(validationResult.getFieldError()).toString());
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.create(user, client), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping
    public ResponseEntity<Response<Long>> update(@RequestAttribute("user") User user, @Valid @RequestBody Client client, BindingResult validationResult){
        Response<Long> response = new Response<>();
        try{

            if(validationResult.hasErrors()){
                response.setMessage(Objects.requireNonNull(Objects.requireNonNull(validationResult.getFieldError())).toString());
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }else if(client.getCode().length() == 0 || client.getCode() == null){
                response.setMessage("code is not valid!");
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.update(user, client), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping
    public ResponseEntity<Response<Long>> delete(@RequestAttribute("user") User user, @RequestParam String code){
        try{
            return new ResponseEntity<>(this.service.delete(user, code), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<Client>>> read(@RequestParam int skip, @RequestParam int limit){
        Response<List<Client>> response = new Response<>();
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }

            return new ResponseEntity<>(this.service.read(skip, limit, false), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/trash")
    public ResponseEntity<Response<List<Client>>> readTrash(@RequestParam int skip, @RequestParam int limit){
        Response<List<Client>> response = new Response<>();
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }

            return new ResponseEntity<>(this.service.read(skip, limit, true), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Response<List<Client>>> read(@RequestParam int skip, @RequestParam int limit, @RequestParam String search){
        Response<List<Client>> response = new Response<>();
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }

            return new ResponseEntity<>(this.service.read(skip, limit, null, search, false), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/trash/search")
    public ResponseEntity<Response<List<Client>>> readTrash(@RequestParam int skip, @RequestParam int limit, @RequestParam String search){
        Response<List<Client>> response = new Response<>();
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }

            return new ResponseEntity<>(this.service.read(skip, limit, null, search, true), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/trash")
    public ResponseEntity<Response<Long>> deleteTrash(@RequestParam String code){
        try{
            return new ResponseEntity<>(service.cleanTrash(code), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
