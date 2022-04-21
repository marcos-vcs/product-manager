package br.com.product.mannager.controller;

import br.com.product.mannager.exceptions.PaginationException;
import br.com.product.mannager.models.Product;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.service.ProductManagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/product-manager")
public class ProductManagerController {

    private final ProductManagerService service;

    public ProductManagerController(ProductManagerService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Response<Product>> create(@Valid @RequestBody Product product, BindingResult validationResult){
        Response<Product> response = new Response<>();
        try{
            if(validationResult.hasErrors()){
                response.setMessage(Objects.requireNonNull(validationResult.getFieldError()).toString());
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.create(product), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping
    public ResponseEntity<Response<Product>> update(@Valid @RequestBody Product product, BindingResult validationResult){
        Response<Product> response = new Response<>();
        try{

            if(validationResult.hasErrors()){
                response.setMessage(Objects.requireNonNull(Objects.requireNonNull(validationResult.getFieldError())).toString());
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }else if(product.getCode().length() == 0 || product.getCode() == null){
                response.setMessage("code is not valid!");
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.update(product), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping
    public ResponseEntity<Response<Product>> delete(@RequestParam String code){
        Response<Product> response = new Response<>();
        try{

            return new ResponseEntity<>(this.service.delete(code), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<Product>>> read(@RequestParam int skip, @RequestParam int limit){
        Response<List<Product>> response = new Response<>();
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }

            return new ResponseEntity<>(this.service.read(skip, limit), HttpStatus.OK);

        }catch (Exception e){
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

}
