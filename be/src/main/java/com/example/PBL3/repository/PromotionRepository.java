package com.example.PBL3.repository;

import com.example.PBL3.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PromotionRepository extends JpaRepository<Promotion, UUID> {
}
