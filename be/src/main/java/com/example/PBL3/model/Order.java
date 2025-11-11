package com.example.PBL3.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import org.hibernate.annotations.UuidGenerator;
import com.example.PBL3.model.status.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, columnDefinition = "BINARY(16)")
    private User customer;

    @Column(name = "order_date", insertable = false, updatable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        columnDefinition = "ENUM('PENDING','PAID','SHIPPED','DELIVERED','CANCELED') DEFAULT 'PENDING'"
    )
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "payment_method",
        nullable = false,
        columnDefinition = "ENUM('COD','EWALLET')"
    )
    private PaymentMethod paymentMethod;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    // Utility
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
