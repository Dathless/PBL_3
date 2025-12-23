package com.example.PBL3.repository;

import com.example.PBL3.model.Product;
import com.example.PBL3.model.ProductRejection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRejectionRepository extends JpaRepository<ProductRejection, UUID> {
    Optional<ProductRejection> findByProduct(Product product);
    Optional<ProductRejection> findByProductId(UUID productId);
}
