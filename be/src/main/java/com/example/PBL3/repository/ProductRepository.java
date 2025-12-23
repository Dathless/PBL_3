package com.example.PBL3.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.PBL3.model.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @EntityGraph(attributePaths = { "images", "category" })
    @Query("SELECT DISTINCT p FROM Product p")
    @Override
    List<Product> findAll();

    @EntityGraph(attributePaths = { "images", "category" })
    @Override
    Optional<Product> findById(UUID id);

    Optional<Product> findBySellerId(UUID sellerId);

    @EntityGraph(attributePaths = { "images", "category" })
    @Query("SELECT DISTINCT p FROM Product p WHERE p.status = :status")
    List<Product> findByStatus(com.example.PBL3.model.status.ProductStatus status);

}
