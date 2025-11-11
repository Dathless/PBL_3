package com.example.PBL3.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

import org.hibernate.annotations.UuidGenerator;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carts")
public class Cart {

	@Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    //Utility
    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }


}
