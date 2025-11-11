package com.example.PBL3.dto;

import com.example.PBL3.model.Product;
import com.example.PBL3.model.User;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
public class CustomerProductDTO {
    private UUID id;
    private String productName;
    private String userName;
    private BigDecimal price;

    public CustomerProductDTO(User user, Product product) {
        this.id = user.getId();
        this.productName = product.getName();
        this.userName = user.getUsername();
        this.price = product.getPrice();
    }
}
