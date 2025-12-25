package com.example.PBL3.service;

import com.example.PBL3.dto.PromotionDTO;
import java.util.List;
import java.util.UUID;

public interface PromotionService {
    List<PromotionDTO> getAll();

    PromotionDTO getById(UUID id);

    PromotionDTO create(PromotionDTO dto);

    PromotionDTO update(UUID id, PromotionDTO dto);

    void delete(UUID id);
}
