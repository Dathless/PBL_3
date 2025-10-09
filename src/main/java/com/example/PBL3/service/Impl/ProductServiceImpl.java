package com.example.PBL3.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.model.*;
import com.example.PBL3.repository.CategoryRepository;
import com.example.PBL3.repository.ProductImageRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.service.ProductService;
import com.example.PBL3.util.MapperUtil;

import java.util.*;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final ProductImageRepository imageRepo;
    private final MapperUtil mapperUtil = new MapperUtil();

    public ProductServiceImpl(ProductRepository productRepo, CategoryRepository categoryRepo, ProductImageRepository imageRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.imageRepo = imageRepo;
    }

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

        // Add default image
        ProductImage img = new ProductImage();
        img.setProduct(product);
        img.setImageUrl("/static/images/T_Shirt.png");
        img.setAltText("T Shirt");
        imageRepo.save(img);

        product.setImages(List.of(img));

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
}