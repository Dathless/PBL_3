package com.example.PBL3.dto;

import java.math.BigDecimal;
import lombok.*;
import java.util.List;
import java.util.UUID;

import com.example.PBL3.model.status.ProductStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String size;
    private String color;
    private ProductStatus status;
    private Long categoryId;
    private List<ProductImageDTO> images;
}
