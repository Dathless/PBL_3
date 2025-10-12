package com.example.PBL3.util;

import com.example.PBL3.dto.*;
import com.example.PBL3.model.*;
import com.example.PBL3.service.ProductService;
import com.example.PBL3.service.UserService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class MapperUtil {

	// ------------  USER -------------------//
    public User toUser(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setEnabled(userDTO.isEnabled());
        user.setRole(userDTO.getRole());
        user.setCreatedAt(userDTO.getCreatedAt());
        user.setUpdatedAt(userDTO.getUpdatedAt());
        return user;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());
        userDTO.setAddress(user.getAddress());
        userDTO.setPhone(user.getPhone());
        userDTO.setEnabled(user.isEnabled());
        userDTO.setRole(user.getRole());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        return userDTO;
    }

    // -------------------- PRODUCT -------------------//

    public ProductDTO toProductDTO(Product entity) {
    		if (entity == null) return null;
        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStock(entity.getStock());
        dto.setSize(entity.getSize());
        dto.setColor(entity.getColor());
        dto.setStatus(entity.getStatus());
        dto.setCategoryId(entity.getCategory() != null ? entity.getCategory().getId() : null);

        if (entity.getImages() != null) {
            dto.setImages(entity.getImages().stream().map(img ->
                new ProductImageDTO(img.getId(), img.getImageUrl(), img.getAltText())
            ).collect(Collectors.toList()));
        }
        return dto;
    }

    public Product toProduct(ProductDTO dto, Category category) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setSize(dto.getSize());
        product.setColor(dto.getColor());
        product.setStatus(dto.getStatus());
        product.setCategory(category);
        return product;
    }
 // ------------ CART -------------------//
    public CartDTO toCartDTO(Cart entity) {
        if (entity == null) return null;
        CartDTO dto = new CartDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        dto.setItems(entity.getItems().stream()
                .map(this::toCartItemDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    public Cart toCart(CartDTO dto, User user, List<CartItem> items) {
        if (dto == null) return null;
        Cart cart = new Cart();
        cart.setId(dto.getId());
        cart.setUser(user);
        cart.setItems(items);
        if (items != null) items.forEach(i -> i.setCart(cart));
        return cart;
    }

    // ------------ CART ITEM -------------------//
    public CartItemDTO toCartItemDTO(CartItem entity) {
        if (entity == null) return null;
        CartItemDTO dto = new CartItemDTO();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProduct() != null ? entity.getProduct().getId() : null);
        dto.setQuantity(entity.getQuantity());
        return dto;
    }

    public CartItem toCartItem(CartItemDTO dto, Product product) {
        if (dto == null) return null;
        CartItem item = new CartItem();
        item.setId(dto.getId());
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        return item;
    }
}