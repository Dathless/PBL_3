package com.example.PBL3.service;

import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.dto.request.ProductApprovalRequest;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.ProductRejection;
import com.example.PBL3.model.User;
import com.example.PBL3.model.status.ProductStatus;
import com.example.PBL3.repository.ProductRejectionRepository;
import com.example.PBL3.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProductApprovalService {
    private final ProductRepository productRepository;
    private final ProductRejectionRepository rejectionRepository;
    private final UserService userService;

    public ProductApprovalService(ProductRepository productRepository,
                                ProductRejectionRepository rejectionRepository,
                                UserService userService) {
        this.productRepository = productRepository;
        this.rejectionRepository = rejectionRepository;
        this.userService = userService;
    }

    @Transactional
    public void approveOrRejectProduct(UUID productId, ProductApprovalRequest request, UUID adminId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        
        // Get admin DTO and convert to User entity
        UserDTO adminDTO = userService.getUserById(adminId);
        if (adminDTO == null) {
            throw new EntityNotFoundException("Admin not found");
        }
        
        User admin = new User();
        admin.setId(adminDTO.getId());
        // Set other necessary admin fields if needed
        
        if (request.getStatus() == ProductStatus.APPROVED) {
            // If product is approved, update status and delete any existing rejection
            product.setStatus(ProductStatus.APPROVED);
            rejectionRepository.findByProduct(product).ifPresent(rejectionRepository::delete);
        } else if (request.getStatus() == ProductStatus.REJECTED) {
            // If product is rejected, save the rejection reason
            product.setStatus(ProductStatus.REJECTED);
            
            // Create or update rejection reason
            ProductRejection rejection = rejectionRepository.findByProduct(product)
                    .orElse(new ProductRejection());
            
            rejection.setProduct(product);
            rejection.setReason(request.getRejectionReason());
            rejection.setAdmin(admin);
            
            rejectionRepository.save(rejection);
        } else {
            throw new IllegalArgumentException("Invalid status for approval process");
        }
        
        productRepository.save(product);
    }
    
    public String getRejectionReason(UUID productId) {
        return rejectionRepository.findByProductId(productId)
                .map(ProductRejection::getReason)
                .orElse(null);
    }
}
