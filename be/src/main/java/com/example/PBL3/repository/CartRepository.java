package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.Cart;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    @EntityGraph(attributePaths = {"items", "items.product", "items.product.images"})
    Optional<Cart> findByUserId(UUID userId);
    
    @EntityGraph(attributePaths = {"items", "items.product", "items.product.images"})
    @Override
    Optional<Cart> findById(UUID id);
}