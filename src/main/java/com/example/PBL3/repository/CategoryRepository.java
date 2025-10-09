package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.PBL3.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {}