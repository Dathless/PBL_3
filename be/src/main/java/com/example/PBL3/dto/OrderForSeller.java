package com.example.PBL3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.PBL3.model.status.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderForSeller {
    private UUID orderId;
    private UUID productId;
    private String productName;
    private UUID customerId;
    private String customerName;
    private UUID sellerId;
    private int quantity;
    private BigDecimal price;
    private String selectedColor;
    private String selectedSize;
    private OrderStatus status;
    private LocalDateTime orderDate;

}
