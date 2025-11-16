package com.example.PBL3.dto;

import java.util.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
	private UUID id;
    private UUID productId;
    private int quantity;
    private String selectedColor;
    private String selectedSize;
}