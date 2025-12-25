package com.example.PBL3.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private UUID userId;
    private String userName;
    private String sellerName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean approved;

    public ReviewDTO() {
    }

    public ReviewDTO(UUID id, UUID productId, String productName, UUID userId, String userName, String sellerName,
            int rating,
            String comment, LocalDateTime createdAt, boolean approved) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.userId = userId;
        this.userName = userName;
        this.sellerName = sellerName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.approved = approved;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }
}
