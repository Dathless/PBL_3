package com.example.PBL3.dto;

import java.util.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {

	private UUID id;
    private UUID userId;
    private List<CartItemDTO> items;

}
