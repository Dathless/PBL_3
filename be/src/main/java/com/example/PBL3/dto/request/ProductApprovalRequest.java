package com.example.PBL3.dto.request;

import com.example.PBL3.model.status.ProductStatus;
//import lombok.Data;

//@Data
public class ProductApprovalRequest {
    private ProductStatus status;
    private String rejectionReason; // Chỉ cần khi từ chối

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
