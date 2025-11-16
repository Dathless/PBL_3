package com.example.PBL3.dto;

import java.math.BigDecimal;
import lombok.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    
    @JsonProperty("productId")
    private UUID productId;
    
    private String productName;
    private int quantity;
    
    @JsonProperty("price")
    private BigDecimal price;
    
    @JsonProperty("selectedColor")
    private String selectedColor;
    
    @JsonProperty("selectedSize")
    private String selectedSize;

}
