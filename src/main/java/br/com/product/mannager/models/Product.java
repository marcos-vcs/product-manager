package br.com.product.mannager.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Document("products")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    private String code;
    private String url;
    @NotBlank
    @NotNull
    private String name;
    @NotBlank
    @NotNull
    private String brand;
    private String description;
    @Min(0)
    private double price;
    @Min(0)
    private int quantity;

}
