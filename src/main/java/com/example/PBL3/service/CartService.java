package com.example.PBL3.service;

import java.util.*;

import com.example.PBL3.dto.CartDTO;
import com.example.PBL3.dto.CartItemDTO;

public interface CartService {

    CartDTO createCart(UUID userId);
    CartDTO getCartById(UUID cartId);
    CartDTO getCartByUserId(UUID userId);
    List<CartDTO> getAllCarts();
    CartDTO addCartItem(UUID cartId, CartItemDTO itemDTO);
    CartDTO updateCartItem(UUID cartId, UUID itemId, CartItemDTO itemDTO);
    void removeCartItem(UUID cartId, UUID itemId);
    void clearCart(UUID cartId);
    void deleteCart(UUID cartId);;
}