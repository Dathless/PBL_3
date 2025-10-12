package com.example.PBL3.dto;

import java.util.*;

public class CartItemDTO {
	private UUID id;
    private UUID productId;
    private int quantity;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}