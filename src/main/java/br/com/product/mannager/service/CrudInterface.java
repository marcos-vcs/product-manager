package br.com.product.mannager.service;

import br.com.product.mannager.exceptions.CrudErrorException;
import br.com.product.mannager.models.*;

public interface CrudInterface<T, FILTER> {

    Response create(User user, T obj) throws CrudErrorException;
    Response update(User user, T obj) throws CrudErrorException;
    Response delete(User user, String code) throws CrudErrorException;
    Response read(int skip, int limit, boolean deleted) throws CrudErrorException;
    Response read(int skip, int limit, FILTER filter, String search, boolean deleted) throws CrudErrorException;


}
