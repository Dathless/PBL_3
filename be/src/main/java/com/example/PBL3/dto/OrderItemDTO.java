package com.example.PBL3.dto;

import java.math.BigDecimal;
import lombok.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

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
    
    private BigDecimal price;
    
    @JsonProperty("selectedColor")
    private String selectedColor;
    
    @JsonProperty("selectedSize")
    private String selectedSize;
    
    // Custom setter to handle both Number and BigDecimal
    @JsonSetter("price")
    public void setPrice(Object priceValue) {
        if (priceValue == null) {
            this.price = null;
        } else if (priceValue instanceof BigDecimal) {
            this.price = (BigDecimal) priceValue;
        } else if (priceValue instanceof Number) {
            this.price = BigDecimal.valueOf(((Number) priceValue).doubleValue());
        } else if (priceValue instanceof String) {
            this.price = new BigDecimal((String) priceValue);
        } else {
            throw new IllegalArgumentException("Cannot convert " + priceValue.getClass() + " to BigDecimal");
        }
    }

}
