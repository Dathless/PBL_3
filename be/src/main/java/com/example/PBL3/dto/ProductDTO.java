package com.example.PBL3.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.PBL3.model.status.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private String brand;
    private BigDecimal discount;
    private BigDecimal rating;
    private int reviews;
    private int stock;
    private String size;
    private String color;
    private ProductStatus status;
    private Long categoryId;
    private String categoryName;
    private UUID sellerId;
    private List<ProductImageDTO> images;
}
