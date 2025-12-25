package com.example.PBL3.service.Impl;

import com.example.PBL3.dto.PromotionDTO;
import com.example.PBL3.model.Promotion;
import com.example.PBL3.repository.PromotionRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.NotificationService;
import com.example.PBL3.service.PromotionService;
import com.example.PBL3.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepo;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final MapperUtil mapperUtil;

    public PromotionServiceImpl(PromotionRepository promotionRepo, UserRepository userRepository,
            NotificationService notificationService, MapperUtil mapperUtil) {
        this.promotionRepo = promotionRepo;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.mapperUtil = mapperUtil;
    }

    @Override
    public List<PromotionDTO> getAll() {
        return promotionRepo.findAll().stream()
                .map(mapperUtil::toPromotionDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionDTO getById(UUID id) {
        Promotion promotion = promotionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return mapperUtil.toPromotionDTO(promotion);
    }

    @Override
    public PromotionDTO create(PromotionDTO dto) {
        Promotion promotion = mapperUtil.toPromotion(dto);
        promotion = promotionRepo.save(promotion);

        // Notify all customers about the new promotion
        List<com.example.PBL3.model.User> customers = userRepository
                .findByRole(com.example.PBL3.model.status.UserRole.CUSTOMER);
        for (com.example.PBL3.model.User customer : customers) {
            notificationService.createNotification(
                    customer.getId(),
                    "New Promotion: " + promotion.getName(),
                    "Great news! A new discount of " + promotion.getDiscountPercent() + "% is now available.",
                    com.example.PBL3.model.status.NotificationType.PROMOTION);
        }

        return mapperUtil.toPromotionDTO(promotion);
    }

    @Override
    public PromotionDTO update(UUID id, PromotionDTO dto) {
        Promotion promotion = promotionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        if (dto.getName() != null)
            promotion.setName(dto.getName());
        if (dto.getDescription() != null)
            promotion.setDescription(dto.getDescription());
        if (dto.getDiscountPercent() != 0)
            promotion.setDiscountPercent(dto.getDiscountPercent());
        if (dto.getStartDate() != null)
            promotion.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null)
            promotion.setEndDate(dto.getEndDate());
        promotion.setActive(dto.isActive());

        promotion = promotionRepo.save(promotion);
        return mapperUtil.toPromotionDTO(promotion);
    }

    @Override
    public void delete(UUID id) {
        promotionRepo.deleteById(id);
    }
}
