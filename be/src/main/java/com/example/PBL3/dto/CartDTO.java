package com.example.PBL3.dto;

import java.util.*;
//import lombok.*;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
public class CartDTO {

	private UUID id;
    private UUID userId;
    private List<CartItemDTO> items;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }
}
