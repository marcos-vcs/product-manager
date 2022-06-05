package br.com.product.mannager.models;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    private String zipcode;
    private String uf;
    private String city;
    private String district;
    private String street;
    private String complement;

}
