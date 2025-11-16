package com.example.PBL3.service.Impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.example.PBL3.exception.ResourceNotFoundException;

import com.example.PBL3.dto.CartDTO;
import com.example.PBL3.dto.CartItemDTO;
import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.model.Cart;
import com.example.PBL3.model.CartItem;
import com.example.PBL3.model.Category;
import com.example.PBL3.repository.CartItemRepository;
import com.example.PBL3.repository.CartRepository;
import com.example.PBL3.repository.CategoryRepository;
import com.example.PBL3.service.CartService;
import com.example.PBL3.service.ProductService;
import com.example.PBL3.service.UserService;
import com.example.PBL3.util.MapperUtil;


import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;
    private final CategoryRepository categoryRepo;
    private final MapperUtil mapperUtil;


    @Override
    public CartDTO createCart(UUID userId) {
        UserDTO userDTO = userService.getUserById(userId);
        Cart cart = new Cart();
        cart.setUser(mapperUtil.toUser(userDTO));
        cart.setItems(new ArrayList<>());

        Cart saved = cartRepository.save(cart);
        return mapperUtil.toCartDTO(saved);
    }

    @Override
    public CartDTO getCartById(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return mapperUtil.toCartDTO(cart);
    }

    @Override
    public CartDTO getCartByUserId(UUID userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));
        return mapperUtil.toCartDTO(cart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        return cartRepository.findAll().stream()
                .map(mapperUtil::toCartDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CartDTO addCartItem(UUID cartId, CartItemDTO itemDTO) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        ProductDTO productDTO = productService.getById(itemDTO.getProductId());
        Category category = categoryRepo.findById(productDTO.getCategoryId())
        		.orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        // Check if item with same product, color, and size already exists
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(itemDTO.getProductId()))
                .filter(item -> {
                    String itemColor = item.getSelectedColor();
                    String dtoColor = itemDTO.getSelectedColor();
                    if (itemColor == null && dtoColor == null) return true;
                    if (itemColor == null || dtoColor == null) return false;
                    return itemColor.equals(dtoColor);
                })
                .filter(item -> {
                    String itemSize = item.getSelectedSize();
                    String dtoSize = itemDTO.getSelectedSize();
                    if (itemSize == null && dtoSize == null) return true;
                    if (itemSize == null || dtoSize == null) return false;
                    return itemSize.equals(dtoSize);
                })
                .findFirst()
                .orElse(null);
        
        if (existingItem != null) {
            // Update existing item quantity
            existingItem.setQuantity(existingItem.getQuantity() + itemDTO.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            CartItem item = mapperUtil.toCartItem(itemDTO, mapperUtil.toProduct(productDTO, category));
            item.setCart(cart);
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }
        
        Cart updated = cartRepository.save(cart);
        return mapperUtil.toCartDTO(updated);
    }

    @Override
    public CartDTO updateCartItem(UUID cartId, UUID itemId, CartItemDTO itemDTO) {
        CartItem existingItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        existingItem.setQuantity(itemDTO.getQuantity());
        if (itemDTO.getSelectedColor() != null) {
            existingItem.setSelectedColor(itemDTO.getSelectedColor());
        }
        if (itemDTO.getSelectedSize() != null) {
            existingItem.setSelectedSize(itemDTO.getSelectedSize());
        }
        cartItemRepository.save(existingItem);

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return mapperUtil.toCartDTO(cart);
    }

    @Override
    public void removeCartItem(UUID cartId, UUID itemId) {
        CartItem existingItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cartItemRepository.delete(existingItem);
    }

    @Override
    public void clearCart(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public void deleteCart(UUID cartId) {
        if (!cartRepository.existsById(cartId))
            throw new ResourceNotFoundException("Cart not found");
        cartRepository.deleteById(cartId);
    }
}