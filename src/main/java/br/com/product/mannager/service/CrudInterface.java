package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.Product;
import br.com.product.mannager.models.Response;
import br.com.product.mannager.models.User;

public interface CrudInterface<T> {

    Response create(T obj) throws CrudErrorException;
    Response update(T obj) throws CrudErrorException;
    Response delete(String code) throws CrudErrorException;
    Response read(int skip, int limit) throws CrudErrorException;


}
