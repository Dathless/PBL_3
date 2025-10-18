package com.example.PBL3.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PBL3.dto.CartDTO;
import com.example.PBL3.dto.CartItemDTO;
import com.example.PBL3.service.CartService;

import java.util.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    //Constructor
	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

    @PostMapping("/{userId}")
    public ResponseEntity<CartDTO> createCart(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartService.createCart(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDTO> getCartById(@PathVariable UUID id) {
        return ResponseEntity.ok(cartService.getCartById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDTO> getCartByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<CartDTO>> getAllCarts() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartDTO> addCartItem(
            @PathVariable UUID cartId,
            @RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.addCartItem(cartId, itemDTO));
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable UUID cartId,
            @PathVariable UUID itemId,
            @RequestBody CartItemDTO itemDTO) {
        return ResponseEntity.ok(cartService.updateCartItem(cartId, itemId, itemDTO));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable UUID cartId,
            @PathVariable UUID itemId) {
        cartService.removeCartItem(cartId, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable UUID cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable UUID cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
