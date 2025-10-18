package com.example.PBL3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PBL3.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
//	boolean existByName(String name);
}