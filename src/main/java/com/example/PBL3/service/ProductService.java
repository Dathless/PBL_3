package com.example.PBL3.service;

import java.util.*;

import com.example.PBL3.dto.ProductDTO;

public interface ProductService {
    List<ProductDTO> getAll();
    ProductDTO getById(UUID id);
    ProductDTO create(ProductDTO dto);
    ProductDTO update(UUID id, ProductDTO dto);
    void delete(UUID id);
}
