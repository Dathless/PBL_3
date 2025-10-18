package com.example.PBL3.util;

import com.example.PBL3.dto.*;
import com.example.PBL3.model.*;
import com.example.PBL3.model.status.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.boot.model.internal.Nullability;
import org.springframework.stereotype.Component;

@Component
public class MapperUtil {

	// ------------  USER -------------------//
    public User toUser(UserDTO userDTO) {
        if (userDTO == null) return null;
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
    		if (user == null) return null;
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
    		if (dto == null || category == null) return null;
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
 // ------------ CATEGORY ---------------//
    public Category toCategory(CategoryDTO dto) {
    		if (dto == null) return null;
    		Category category = new Category();

    		category.setId(dto.getId());
    		category.setName(dto.getName());

    		return category;
    }

    public CategoryDTO toCategoryDTO(Category entity) {
    		if (entity == null) return null;

    		CategoryDTO dto = new CategoryDTO();
    		Long parentId = entity.getParent() != null ? entity.getParent().getId() : null;
    		dto.setId(entity.getId());
    		dto.setName(entity.getName());
    		dto.setParentId(parentId);

    		return dto;
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
    // ------------ ORDER -------------------//
    public OrderDTO toOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(this::toOrderItemDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Order toOrder(OrderDTO dto, User customer, List<Product> products) {
        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(dto.getShippingAddress());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setOrderDate(dto.getOrderDate() != null ? dto.getOrderDate() : LocalDateTime.now());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : OrderStatus.PENDING);

        if (dto.getItems() != null) {
            List<OrderItem> items = dto.getItems().stream()
                    .map(itemDto -> {
                        OrderItem item = new OrderItem();
                        // tìm product theo id từ danh sách đã load
                        Product product = products.stream()
                                .filter(p -> p.getId().equals(itemDto.getProductId()))
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));
                        item.setProduct(product);
                        item.setQuantity(itemDto.getQuantity());
                        item.setPrice(itemDto.getPrice());
                        item.setOrder(order);
                        return item;
                    })
                    .collect(Collectors.toList());

            order.setItems(items);
            BigDecimal total = items.stream()
                    .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotalAmount(total);
        } else {
            order.setTotalAmount(BigDecimal.ZERO);
        }

        return order;
    }


    // ------------ ORDER ITEM -------------------//

    public OrderItemDTO toOrderItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }

    public OrderItem toOrderItem(OrderItemDTO dto, Order order, Product product) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        return item;
    }

}