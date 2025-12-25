package com.example.PBL3.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.example.PBL3.model.status.PayoutStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "payouts")
public class Payout {
    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PayoutStatus status;

    @Column(name = "method", nullable = false)
    private String method;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Payout() {
    }

    public Payout(UUID id, User seller, BigDecimal amount, PayoutStatus status, String method, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.seller = seller;
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

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
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

    public static PayoutBuilder builder() {
        return new PayoutBuilder();
    }

    public static class PayoutBuilder {
        private UUID id;
        private User seller;
        private BigDecimal amount;
        private PayoutStatus status;
        private String method;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PayoutBuilder() {
        }

        public PayoutBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public PayoutBuilder seller(User seller) {
            this.seller = seller;
            return this;
        }

        public PayoutBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public PayoutBuilder status(PayoutStatus status) {
            this.status = status;
            return this;
        }

        public PayoutBuilder method(String method) {
            this.method = method;
            return this;
        }

        public PayoutBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PayoutBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Payout build() {
            return new Payout(id, seller, amount, status, method, createdAt, updatedAt);
        }
    }
}
