package com.example.PBL3.model;

import com.example.PBL3.model.status.PaymentMethod;
import com.example.PBL3.model.status.PaymentStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, columnDefinition = "BINARY(16)")
    private Order order;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING'")
    private PaymentStatus status =  PaymentStatus.PENDING ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('COD','EWALLET')")
    private PaymentMethod method;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
