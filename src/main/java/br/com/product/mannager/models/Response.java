package br.com.product.mannager.models;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Response<T> {

    private Long quantity;
    private T response;
    private String message;

}
