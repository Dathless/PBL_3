package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.Product;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {}
