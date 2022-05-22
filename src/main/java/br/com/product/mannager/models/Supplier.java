package br.com.product.mannager.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Document("supplier")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Supplier {

    @Id
    private String code;
    @NotBlank
    @NotNull
    private String name;
    @NotBlank
    @NotNull
    private String phone;
    private String email;
    private String observation;
    private List<History> history;
    private boolean deleted;
}
