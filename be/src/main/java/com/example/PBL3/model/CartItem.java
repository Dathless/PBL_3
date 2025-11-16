package com.example.PBL3.model;
import jakarta.persistence.*;
import java.util.*;

import org.hibernate.annotations.UuidGenerator;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart_items")
public class CartItem {
	@Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    @Column(name = "selected_color", length = 50)
    private String selectedColor;

    @Column(name = "selected_size", length = 50)
    private String selectedSize;

}