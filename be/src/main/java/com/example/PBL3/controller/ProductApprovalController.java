package com.example.PBL3.controller;

import com.example.PBL3.dto.request.ProductApprovalRequest;
import com.example.PBL3.model.status.ProductStatus;
import com.example.PBL3.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
public class ProductApprovalController {

    private final ProductService productService;

    public ProductApprovalController(ProductService productService) {
        this.productService = productService;
    }

    @PutMapping("/{productId}/approval")
    public ResponseEntity<?> approveOrRejectProduct(
            @PathVariable UUID productId,
            @RequestBody ProductApprovalRequest request,
            @RequestHeader("X-User-Id") UUID adminId) {

        if (request.getStatus() == ProductStatus.APPROVED) {
            productService.approveProduct(productId, adminId);
        } else if (request.getStatus() == ProductStatus.REJECTED) {
            productService.rejectProduct(productId, adminId, request.getRejectionReason());
        } else {
            return ResponseEntity.badRequest().body("Invalid status");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}/rejection-reason")
    public ResponseEntity<?> getRejectionReason(@PathVariable UUID productId) {
        String reason = productService.getRejectionReason(productId);
        if (reason != null) {
            return ResponseEntity.ok(java.util.Collections.singletonMap("reason", reason));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
