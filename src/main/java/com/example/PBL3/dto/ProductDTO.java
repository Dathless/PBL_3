package com.example.PBL3.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.PBL3.model.status.ProductStatus;

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

    // Constructors
    public ProductDTO() {}
    public ProductDTO(UUID id, String name, String description, BigDecimal price, int stock, String size, String color, ProductStatus status, Long categoryId, List<ProductImageDTO> images) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.stock = stock;
		this.size = size;
		this.color = color;
		this.status = status;
		this.categoryId = categoryId;
		this.images = images;
	}

    // Getters and Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public List<ProductImageDTO> getImages() { return images; }
    public void setImages(List<ProductImageDTO> images) { this.images = images; }

}
