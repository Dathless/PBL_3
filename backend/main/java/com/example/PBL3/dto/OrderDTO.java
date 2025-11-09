package com.example.PBL3.dto;

import java.math.BigDecimal;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;
import com.example.PBL3.model.status.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    private List<OrderItemDTO> items;


}
