package br.com.product.mannager.controller;

import br.com.product.mannager.exceptions.PaginationException;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.Supplier;
import br.com.product.mannager.models.User;
import br.com.product.mannager.models.enums.SupplierFilter;
import br.com.product.mannager.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/supplier-manager")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Response<Supplier>> create(@RequestAttribute("user") User user, @Valid @RequestBody Supplier supplier, BindingResult validationResult){
        try{
            if(validationResult.hasErrors()){
                Response<Supplier> response = new Response<>();
                response.setMessage(Objects.requireNonNull(validationResult.getFieldError()).toString());
                return new ResponseEntity<>(response,HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.create(user, supplier), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping
    public ResponseEntity<Response<String>> update(@RequestAttribute("user") User user, @Valid @RequestBody Supplier supplier, BindingResult validationResult){
        try{
            if(validationResult.hasErrors()){
                Response<String> response = new Response<>();
                response.setMessage(Objects.requireNonNull(validationResult.getFieldError()).toString());
                return new ResponseEntity<>(response,HttpStatus.NOT_ACCEPTABLE);
            }

            return new ResponseEntity<>(this.service.update(user, supplier), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping
    public ResponseEntity<Response<Long>> delete(@RequestAttribute("user") User user, @RequestParam String code){
        try{
            return new ResponseEntity<>(service.delete(user, code), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<Supplier>>> read(@RequestParam int skip, @RequestParam int limit){
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }
            return new ResponseEntity<>(service.read(skip, limit, false), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Response<List<Supplier>>> read(@RequestParam int skip, @RequestParam int limit, @RequestParam SupplierFilter filter, @RequestParam String search){
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }
            return new ResponseEntity<>(service.read(skip, limit, filter, search, false), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/trash")
    public ResponseEntity<Response<List<Supplier>>> readTrash(@RequestParam int skip, @RequestParam int limit){
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }
            return new ResponseEntity<>(service.read(skip, limit, false), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/trash/search")
    public ResponseEntity<Response<List<Supplier>>> readTrash(@RequestParam int skip, @RequestParam int limit, @RequestParam SupplierFilter filter, @RequestParam String search){
        try{
            if(skip < 0 || limit < 0){
                throw new PaginationException("Erro, parametro skip ou limit e menor que 0, verifique!");
            }
            return new ResponseEntity<>(service.read(skip, limit, filter, search, false), HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
