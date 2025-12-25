package com.example.PBL3.repository;

import com.example.PBL3.model.Product;
import com.example.PBL3.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    List<ProductVariant> findByProduct(Product product);

    Optional<ProductVariant> findByProductAndSize(Product product, String size);

    Optional<ProductVariant> findByProductAndColorAndSize(Product product, String color, String size);
}
