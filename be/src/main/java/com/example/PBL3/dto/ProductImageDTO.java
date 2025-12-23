package com.example.PBL3.dto;

//import lombok.*;

//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
public class ProductImageDTO {
    private Long id;
    private String imageUrl;
    private String altText;

    public ProductImageDTO() {
    }

    public ProductImageDTO(Long id, String imageUrl, String altText) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.altText = altText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }
}
