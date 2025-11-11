package com.example.PBL3.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.dto.ProductImageDTO;
import com.example.PBL3.model.*;
import com.example.PBL3.repository.CategoryRepository;
import com.example.PBL3.repository.ProductImageRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.service.ProductService;
import com.example.PBL3.util.MapperUtil;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final ProductImageRepository imageRepo;
    private final MapperUtil mapperUtil = new MapperUtil();


    @Override
    public List<ProductDTO> getAll() {
        return productRepo.findAll().stream().map(mapperUtil::toProductDTO).toList();
    }

    @Override
    public ProductDTO getById(UUID id) {
        return productRepo.findById(id)
                .map(mapperUtil::toProductDTO)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Product product = mapperUtil.toProduct(dto, category);
        product = productRepo.save(product);

        List<ProductImage> imgs = new ArrayList<>();
        if (dto.getImages() != null) {
            for (ProductImageDTO imgDto : dto.getImages()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(imgDto.getImageUrl());
                img.setAltText(imgDto.getAltText());
                img = imageRepo.save(img);
                imgs.add(img);
            }
        }

        product.setImages(imgs);

        return mapperUtil.toProductDTO(product);
    }

    @Override
    public ProductDTO update(UUID id, ProductDTO dto) {
        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setSize(dto.getSize());
        existing.setColor(dto.getColor());
        existing.setStatus(dto.getStatus());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            existing.setCategory(category);
        }
        productRepo.save(existing);
        return mapperUtil.toProductDTO(existing);
    }

    @Override
    public void delete(UUID id) {
        if (!productRepo.existsById(id)) throw new EntityNotFoundException("Product not found");
        productRepo.deleteById(id);
    }
    @Override
    public List<ProductDTO> search(String name, BigDecimal minPrice, BigDecimal maxPrice, List<UUID> ids) {
        List<Product> products = productRepo.findAll();

        return products.stream()
                .filter(product -> name == null || product.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(product -> minPrice == null || product.getPrice().compareTo(minPrice) >= 0)
                .filter(product -> maxPrice == null || product.getPrice().compareTo(maxPrice) <= 0)
                .filter(product -> ids == null || ids.isEmpty() || ids.contains(product.getId()))
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }
}