package com.example.PBL3.util;

import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.dto.ProductImageDTO;
import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.model.Category;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.User;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class MapperUtil {

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
}