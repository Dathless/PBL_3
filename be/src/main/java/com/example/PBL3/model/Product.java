package com.example.PBL3.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

import org.hibernate.annotations.UuidGenerator;

import com.example.PBL3.model.status.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String brand;
    private BigDecimal discount;
    private BigDecimal rating;
    private int reviews;

    private BigDecimal price;
    private int stock;
    private String size;
    private String color;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;

}
