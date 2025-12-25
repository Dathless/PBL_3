package com.example.PBL3.service;

import com.example.PBL3.dto.ReviewDTO;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDTO create(ReviewDTO reviewDTO);

    List<ReviewDTO> getAll();

    List<ReviewDTO> getByProductId(UUID productId);

    List<ReviewDTO> getApprovedByProductId(UUID productId);

    ReviewDTO getById(UUID id);

    void approve(UUID id);

    void delete(UUID id);
}
