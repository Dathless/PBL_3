package com.example.PBL3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.PBL3.model.status.PaymentMethod;
import com.example.PBL3.model.status.PaymentStatus;
import lombok.Data;

@Data
public class PaymentResponseDTO {
    private UUID id;
    private UUID orderId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private LocalDateTime paymentDate;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
}
