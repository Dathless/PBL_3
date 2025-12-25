package com.example.PBL3.repository;

import com.example.PBL3.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductId(UUID productId);

    List<Review> findByUserId(UUID userId);

    List<Review> findByProductIdAndApprovedTrue(UUID productId);
}
