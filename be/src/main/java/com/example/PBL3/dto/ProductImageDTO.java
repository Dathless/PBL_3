package com.example.PBL3.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageDTO {
    private Long id;
    private String imageUrl;
    private String altText;


}
