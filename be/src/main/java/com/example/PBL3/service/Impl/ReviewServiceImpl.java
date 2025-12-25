package com.example.PBL3.service.Impl;

import com.example.PBL3.dto.ReviewDTO;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.Review;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.repository.ReviewRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.ReviewService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final com.example.PBL3.service.NotificationService notificationService;

    public ReviewServiceImpl(ReviewRepository reviewRepo, ProductRepository productRepo, UserRepository userRepo,
            com.example.PBL3.service.NotificationService notificationService) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.notificationService = notificationService;
    }

    @Override
    public ReviewDTO create(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setProductId(reviewDTO.getProductId());
        review.setUserId(reviewDTO.getUserId());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setApproved(false); // Requires admin approval by default

        Review saved = reviewRepo.save(review);

        // Notify seller about new review
        productRepo.findById(review.getProductId()).ifPresent(product -> {
            if (product.getSeller() != null) {
                notificationService.createNotification(
                        product.getSeller().getId(),
                        "New Product Review",
                        "Your product '" + product.getName() + "' received a new " + review.getRating()
                                + "-star review.",
                        com.example.PBL3.model.status.NotificationType.REVIEW);
            }
        });

        return toDTO(saved);
    }

    @Override
    public List<ReviewDTO> getAll() {
        return reviewRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getByProductId(UUID productId) {
        return reviewRepo.findByProductId(productId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getApprovedByProductId(UUID productId) {
        return reviewRepo.findByProductIdAndApprovedTrue(productId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO getById(UUID id) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        return toDTO(review);
    }

    @Override
    public void approve(UUID id) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        review.setApproved(true);
        reviewRepo.save(review);

        // Notify buyer that their review was approved
        productRepo.findById(review.getProductId()).ifPresent(product -> {
            notificationService.createNotification(
                    review.getUserId(),
                    "Review Approved",
                    "Your review for '" + product.getName() + "' has been approved and is now visible to others.",
                    com.example.PBL3.model.status.NotificationType.REVIEW);
        });
    }

    @Override
    public void delete(UUID id) {
        reviewRepo.deleteById(id);
    }

    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProductId());
        dto.setUserId(review.getUserId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setApproved(review.isApproved());

        // Fetch product name
        productRepo.findById(review.getProductId()).ifPresent(product -> {
            dto.setProductName(product.getName());
        });

        // Fetch user name
        userRepo.findById(review.getUserId()).ifPresent(user -> {
            dto.setUserName(user.getFullname());
        });

        // Fetch seller name from product
        productRepo.findById(review.getProductId()).ifPresent(product -> {
            if (product.getSeller() != null) {
                dto.setSellerName(product.getSeller().getFullname());
            }
        });

        return dto;
    }
}
