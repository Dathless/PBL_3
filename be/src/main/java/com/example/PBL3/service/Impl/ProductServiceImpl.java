package com.example.PBL3.service.Impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.ProductDTO;
import com.example.PBL3.dto.ProductImageDTO;
import com.example.PBL3.model.status.ProductStatus;
import com.example.PBL3.model.Category;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.ProductImage;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.CategoryRepository;
import com.example.PBL3.repository.ProductImageRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.ProductService;
import com.example.PBL3.util.MapperUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final ProductImageRepository imageRepo;
    private final UserRepository userRepo;
    private final com.example.PBL3.repository.CartItemRepository cartItemRepo;
    private final com.example.PBL3.repository.OrderItemRepository orderItemRepo;
    private final com.example.PBL3.repository.ProductRejectionRepository rejectionRepo;
    private final MapperUtil mapperUtil = new MapperUtil();

    private static final java.util.logging.Logger log = java.util.logging.Logger
            .getLogger(ProductServiceImpl.class.getName());

    public ProductServiceImpl(ProductRepository productRepo, CategoryRepository categoryRepo,
            ProductImageRepository imageRepo, UserRepository userRepo,
            com.example.PBL3.repository.CartItemRepository cartItemRepo,
            com.example.PBL3.repository.OrderItemRepository orderItemRepo,
            com.example.PBL3.repository.ProductRejectionRepository rejectionRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.imageRepo = imageRepo;
        this.userRepo = userRepo;
        this.cartItemRepo = cartItemRepo;
        this.orderItemRepo = orderItemRepo;
        this.rejectionRepo = rejectionRepo;
    }

    @Override
    public List<ProductDTO> getAll() {
        return productRepo.findAll().stream()
                .filter(p -> p.getStatus() != ProductStatus.DISCONTINUED)
                .map(mapperUtil::toProductDTO).toList();
    }

    @Override
    public ProductDTO getById(UUID id) {
        return productRepo.findById(id)
                .map(mapperUtil::toProductDTO)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        User seller = userRepo.findById(dto.getSellerId())
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Product product = mapperUtil.toProduct(dto, category);
        product.setSeller(seller);
        product.setStatus(ProductStatus.PENDING); // Set default status to PENDING
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
        if (!productRepo.existsById(id))
            throw new EntityNotFoundException("Product not found");

        // If product is in any order, soft delete it
        if (orderItemRepo.existsByProductId(id)) {
            Product product = productRepo.findById(id).get();
            product.setStatus(ProductStatus.DISCONTINUED);
            productRepo.save(product);
            return;
        }

        // If product is in cart, remove it from cart first
        cartItemRepo.deleteByProductId(id);

        // If product has rejection record, delete it
        rejectionRepo.findByProductId(id).ifPresent(rejectionRepo::delete);

        // Hard delete
        productRepo.deleteById(id);
    }

    @Override
    public List<ProductDTO> search(String name, BigDecimal minPrice, BigDecimal maxPrice, List<UUID> ids) {
        List<Product> products = productRepo.findAll();

        return products.stream()
                .filter(product -> product.getStatus() != ProductStatus.DISCONTINUED)
                .filter(product -> name == null || product.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(product -> minPrice == null || product.getPrice().compareTo(minPrice) >= 0)
                .filter(product -> maxPrice == null || product.getPrice().compareTo(maxPrice) <= 0)
                .filter(product -> ids == null || ids.isEmpty() || ids.contains(product.getId()))
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void SetSellerId(UUID id, UUID sellerId) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        if (product.getSeller() != null)
            throw new IllegalArgumentException("Product already has a seller");
        User seller = userRepo.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));
        product.setSeller(seller);
        productRepo.save(product);
    }

    @Override
    public List<ProductDTO> getByCategoryName(String categoryName) {
        return productRepo.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DISCONTINUED)
                .filter(product -> product.getCategory() != null &&
                        product.getCategory().getName().equalsIgnoreCase(categoryName))
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getBySellerId(UUID sellerId) {
        return productRepo.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DISCONTINUED)
                .filter(product -> product.getSeller() != null &&
                        product.getSeller().getId().equals(sellerId))
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getByBrand(String brand) {
        return productRepo.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DISCONTINUED)
                .filter(product -> product.getBrand() != null &&
                        product.getBrand().equalsIgnoreCase(brand))
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getPendingProducts() {
        return productRepo.findByStatus(ProductStatus.PENDING).stream()
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void approveProduct(UUID id, UUID adminId) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        // Optional: Check if adminId is valid admin
        product.setStatus(ProductStatus.APPROVED);
        productRepo.save(product);
    }

    @Override
    public void rejectProduct(UUID id, UUID adminId, String reason) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        // Optional: Check if adminId is valid admin
        product.setStatus(ProductStatus.REJECTED);
        product.setRejectionReason(reason);
        productRepo.save(product);
    }

    @Override
    public String getRejectionReason(UUID id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        return product.getRejectionReason();
    }

    @Override
    public List<ProductDTO> getApprovedProducts() {
        return productRepo.findByStatus(ProductStatus.APPROVED).stream()
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }
}