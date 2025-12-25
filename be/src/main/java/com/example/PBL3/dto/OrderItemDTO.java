package com.example.PBL3.dto;

import java.math.BigDecimal;
//import lombok.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
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

    @JsonProperty("productImageUrl")
    private String productImageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSelectedColor() {
        return selectedColor;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    public String getSelectedSize() {
        return selectedSize;
    }

    public void setSelectedSize(String selectedSize) {
        this.selectedSize = selectedSize;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }
}
