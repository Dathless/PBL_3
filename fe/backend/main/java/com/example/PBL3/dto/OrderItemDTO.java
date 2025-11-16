package com.example.PBL3.dto;

import java.math.BigDecimal;
import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long id;
    private UUID productId;
    private String productName;
    private int quantity;
    private BigDecimal price;

}
