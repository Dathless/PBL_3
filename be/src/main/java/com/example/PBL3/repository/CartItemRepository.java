package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.CartItem;

import java.util.UUID;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCart_Id(UUID cartId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM CartItem c WHERE c.product.id = :productId")
    void deleteByProductId(@org.springframework.data.repository.query.Param("productId") UUID productId);
}