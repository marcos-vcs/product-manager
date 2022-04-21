package br.com.product.mannager.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Response<T> {

    private Long quantity;
    private T response;
    private String message;

}
