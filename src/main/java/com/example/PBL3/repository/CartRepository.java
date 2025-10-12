package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.Cart;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
	Optional<Cart> findById(UUID cartId);
    Optional<Cart> findByUserId(UUID userId);
}