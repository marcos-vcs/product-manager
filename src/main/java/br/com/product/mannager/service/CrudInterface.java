package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

public interface CrudInterface<T> {

    Response create(T obj) throws CrudErrorException;
    Response update(T obj) throws CrudErrorException;
    Response delete(String code) throws CrudErrorException;
    Response read(int skip, int limit) throws CrudErrorException;
    Response read(int skip, int limit, Filter filter, String search) throws CrudErrorException;


}
