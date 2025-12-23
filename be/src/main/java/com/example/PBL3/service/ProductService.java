package com.example.PBL3.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.PBL3.dto.ProductDTO;

public interface ProductService {
    List<ProductDTO> getAll();

    ProductDTO getById(UUID id);

    ProductDTO create(ProductDTO dto);

    ProductDTO update(UUID id, ProductDTO dto);

    void delete(UUID id);

    List<ProductDTO> search(String name, BigDecimal minPrice, BigDecimal maxPrice, List<UUID> ids);

    void SetSellerId(UUID productId, UUID sellerId);

    List<ProductDTO> getByCategoryName(String categoryName);

    List<ProductDTO> getBySellerId(UUID sellerId);

    List<ProductDTO> getByBrand(String brand);

    List<ProductDTO> getPendingProducts();

    void approveProduct(UUID id, UUID adminId);

    void rejectProduct(UUID id, UUID adminId, String reason);

    String getRejectionReason(UUID id);

    List<ProductDTO> getApprovedProducts();
}
