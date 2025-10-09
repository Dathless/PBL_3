package com.example.PBL3.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private String altText;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    //Constructor
    public ProductImage() {}
    public ProductImage(Long id, String imageUrl, String altText, Product product) {
    		super();
    		this.id = id;
    		this.imageUrl = imageUrl;
    		this.altText = altText;
    		this.product = product;
    }

    //Getters and Setters

    public Long getId() { return id;}
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
