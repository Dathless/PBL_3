package com.example.PBL3.dto;

import com.example.PBL3.model.status.PayoutStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PayoutDTO {
    private UUID id;
    private UUID sellerId;
    private String sellerName;
    private BigDecimal amount;
    private PayoutStatus status;
    private String method;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PayoutDTO() {
    }

    public PayoutDTO(UUID id, UUID sellerId, String sellerName, BigDecimal amount, PayoutStatus status, String method,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.amount = amount;
        this.status = status;
        this.method = method;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSellerId() {
        return sellerId;
    }

    public void setSellerId(UUID sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PayoutStatus getStatus() {
        return status;
    }

    public void setStatus(PayoutStatus status) {
        this.status = status;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static PayoutDTOBuilder builder() {
        return new PayoutDTOBuilder();
    }

    public static class PayoutDTOBuilder {
        private UUID id;
        private UUID sellerId;
        private String sellerName;
        private BigDecimal amount;
        private PayoutStatus status;
        private String method;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PayoutDTOBuilder() {
        }

        public PayoutDTOBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public PayoutDTOBuilder sellerId(UUID sellerId) {
            this.sellerId = sellerId;
            return this;
        }

        public PayoutDTOBuilder sellerName(String sellerName) {
            this.sellerName = sellerName;
            return this;
        }

        public PayoutDTOBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PayoutDTOBuilder status(PayoutStatus status) {
            this.status = status;
            return this;
        }

        public PayoutDTOBuilder method(String method) {
            this.method = method;
            return this;
        }

        public PayoutDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PayoutDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public PayoutDTO build() {
            return new PayoutDTO(id, sellerId, sellerName, amount, status, method, createdAt, updatedAt);
        }
    }
}
