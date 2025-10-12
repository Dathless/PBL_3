package com.example.PBL3.service.Impl;

import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
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
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;
    private final CategoryRepository categoryRepo;
    private final MapperUtil mapperUtil;

    // Constructor
    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
						   UserService userService, ProductService productService, CategoryRepository categoryRepo,
						   MapperUtil mapperUtil, ProductServiceImpl productServiceImpl) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.userService = userService;
		this.productService = productService;
		this.categoryRepo = categoryRepo;
		this.mapperUtil = mapperUtil;
	}

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
        CartItem item = mapperUtil.toCartItem(itemDTO, mapperUtil.toProduct(productDTO, category));
        item.setCart(cart);
        
        cartItemRepository.save(item);

        cart.getItems().add(item);
        Cart updated = cartRepository.save(cart);

        return mapperUtil.toCartDTO(updated);
    }

    @Override
    public CartDTO updateCartItem(UUID cartId, UUID itemId, CartItemDTO itemDTO) {
        CartItem existingItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        existingItem.setQuantity(itemDTO.getQuantity());
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