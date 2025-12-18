package com.example.PBL3.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    @EntityGraph(attributePaths = {"images", "category"})
    @Override
    List<Product> findAll();
    
    @EntityGraph(attributePaths = {"images", "category"})
    @Override
    Optional<Product> findById(UUID id);
    Optional<Product> findBySellerId(UUID sellerId);
    
}
