package com.example.PBL3.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> create(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable UUID id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @PutMapping("/{productId}/seller/{sellerId}")
    public ResponseEntity<Void> setSellerId(@PathVariable UUID productId, @PathVariable UUID sellerId) {
        productService.SetSellerId(productId, sellerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<UUID> ids) {
        return ResponseEntity.ok(productService.search(name, minPrice, maxPrice, ids));
    }
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<ProductDTO>> getByCategoryName(@PathVariable String categoryName) {
        return ResponseEntity.ok(productService.getByCategoryName(categoryName));
    }
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ProductDTO>> getBySellerId(@PathVariable UUID sellerId) {
        return ResponseEntity.ok(productService.getBySellerId(sellerId));
    }
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<ProductDTO>> getByBrand(@PathVariable String brand) {
        return ResponseEntity.ok(productService.getByBrand(brand));
    }
}