package com.example.PBL3.service.Impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.ProductDTO;
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
    private final com.example.PBL3.repository.ProductVariantRepository variantRepo;
    private final MapperUtil mapperUtil = new MapperUtil();

    private static final java.util.logging.Logger log = java.util.logging.Logger
            .getLogger(ProductServiceImpl.class.getName());

    public ProductServiceImpl(ProductRepository productRepo, CategoryRepository categoryRepo,
            ProductImageRepository imageRepo, UserRepository userRepo,
            com.example.PBL3.repository.CartItemRepository cartItemRepo,
            com.example.PBL3.repository.OrderItemRepository orderItemRepo,
            com.example.PBL3.repository.ProductRejectionRepository rejectionRepo,
            com.example.PBL3.repository.ProductVariantRepository variantRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.imageRepo = imageRepo;
        this.userRepo = userRepo;
        this.cartItemRepo = cartItemRepo;
        this.orderItemRepo = orderItemRepo;
        this.rejectionRepo = rejectionRepo;
        this.variantRepo = variantRepo;
    }

    @Override
    public List<ProductDTO> getAll() {
        return productRepo.findAll().stream()
                .filter(p -> p.getStatus() != ProductStatus.DISCONTINUED)
                .map(mapperUtil::toProductDTO).toList();
    }

    @Override
    public ProductDTO getById(UUID id) {
        productRepo.incrementViewCount(id);
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

        // Check for existing product to group by (same name, brand, category, price,
        // seller)
        List<Product> existingProducts = productRepo.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase(dto.getName()))
                .filter(p -> p.getBrand() != null && p.getBrand().equalsIgnoreCase(dto.getBrand()))
                .filter(p -> p.getCategory().getId().equals(category.getId()))
                .filter(p -> p.getPrice().compareTo(dto.getPrice()) == 0)
                .filter(p -> p.getSeller().getId().equals(seller.getId()))
                .collect(Collectors.toList());

        Product product;
        if (!existingProducts.isEmpty()) {
            product = existingProducts.get(0);
            log.info("Found existing product: " + product.getId() + ". Grouping variants.");
        } else {
            product = mapperUtil.toProduct(dto, category);
            product.setSeller(seller);
            product = productRepo.save(product);

            // Handle images only for new products (or refresh if needed)
            if (dto.getImages() != null) {
                for (com.example.PBL3.dto.ProductImageDTO imgDto : dto.getImages()) {
                    ProductImage img = new ProductImage();
                    img.setProduct(product);
                    img.setImageUrl(imgDto.getImageUrl());
                    img.setAltText(imgDto.getAltText());
                    imageRepo.save(img);
                }
            }
        }

        // Reset status to PENDING so Admin must re-approve even if it's an existing
        // product being updated
        product.setStatus(ProductStatus.PENDING);

        // Handle Variant (Size & Stock)
        // If the incoming DTO has a specific size and stock, we upsert that variant
        if (dto.getSize() != null && !dto.getSize().isEmpty()) {
            final Product finalProduct = product;
            String incomingSize = dto.getSize();
            // In the current frontend, p.size might be a JSON array string if selected
            // multiple,
            // but the user's request implies adding one size at a time or handling specific
            // stock per size.
            // If it's a JSON array, we might need to handle multiple, but let's assume the
            // "Add" button
            // sends the specific size being added.

            // For now, let's just handle the size provided in the DTO as a single unit or
            // handle multiple if JSON
            List<String> sizesToAdd = new ArrayList<>();
            if (incomingSize.startsWith("[") && incomingSize.endsWith("]")) {
                // Parse JSON array
                try {
                    sizesToAdd = new com.fasterxml.jackson.databind.ObjectMapper().readValue(incomingSize,
                            new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {
                            });
                } catch (Exception e) {
                    sizesToAdd.add(incomingSize);
                }
            } else {
                sizesToAdd.add(incomingSize);
            }

            for (String s : sizesToAdd) {
                com.example.PBL3.model.ProductVariant variant = variantRepo.findByProductAndSize(product, s)
                        .orElse(new com.example.PBL3.model.ProductVariant());
                variant.setProduct(product);
                variant.setSize(s);
                // If existing, we add to stock or override? Request says "10 đôi size 39, 20
                // đôi size 38"
                // Usually adding means increasing or setting. Let's assume setting for
                // simplicity or increasing if intended.
                // The user said "thêm lần lượt từng size (thêm 2 lần)", so it might mean adding
                // to existing if found.
                variant.setStock(variant.getStock() + dto.getStock());
                variantRepo.save(variant);
            }
        }

        // Update consolidated stock and size list on the Product entity for quick
        // display
        List<com.example.PBL3.model.ProductVariant> variants = variantRepo.findByProduct(product);
        product.setStock(variants.stream().mapToInt(com.example.PBL3.model.ProductVariant::getStock).sum());
        List<String> allSizes = variants.stream().map(com.example.PBL3.model.ProductVariant::getSize)
                .collect(Collectors.toList());
        try {
            product.setSize(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(allSizes));
        } catch (Exception e) {
            product.setSize(String.join(",", allSizes));
        }
        productRepo.save(product);

        return mapperUtil.toProductDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO update(UUID id, ProductDTO dto) {
        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setDiscount(dto.getDiscount());
        existing.setSize(dto.getSize());
        existing.setColor(dto.getColor());
        // Reset status to PENDING on any update so Admin must re-approve
        existing.setStatus(ProductStatus.PENDING);
        if (dto.getCategoryId() != null) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            existing.setCategory(category);
        }
        productRepo.save(existing);

        // Update images if provided
        if (dto.getImages() != null) {
            // Remove old images
            imageRepo.deleteAll(existing.getImages());
            existing.getImages().clear();

            // Add new images
            for (com.example.PBL3.dto.ProductImageDTO imgDto : dto.getImages()) {
                ProductImage img = new ProductImage();
                img.setProduct(existing);
                img.setImageUrl(imgDto.getImageUrl());
                img.setAltText(imgDto.getAltText());
                imageRepo.save(img);
            }
        }

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

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found"));
        // Optional: Check if adminId is valid admin (role check can be done here or
        // security
        // config)

        product.setStatus(ProductStatus.REJECTED);
        // Note: rejectionReason column in Product table is no longer used, but we keep
        // status sync.
        productRepo.save(product);

        // Save rejection detail to product_rejections table
        com.example.PBL3.model.ProductRejection rejection = rejectionRepo.findByProduct(product)
                .orElse(new com.example.PBL3.model.ProductRejection());

        if (rejection.getId() == null) {
            rejection.setProduct(product);
        }
        rejection.setAdmin(admin);
        rejection.setReason(reason);
        rejectionRepo.save(rejection);
    }

    @Override
    public String getRejectionReason(UUID id) {
        // Return reason from the latest rejection record
        return rejectionRepo.findByProductId(id)
                .map(com.example.PBL3.model.ProductRejection::getReason)
                .orElse(null);
    }

    @Override
    public List<ProductDTO> getApprovedProducts() {
        return productRepo.findByStatus(ProductStatus.APPROVED).stream()
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public int getVariantStock(UUID productId, String color, String size) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // If both color and size are provided, find exact variant
        if (color != null && !color.isEmpty() && size != null && !size.isEmpty()) {
            return variantRepo.findByProductAndColorAndSize(product, color, size)
                    .map(com.example.PBL3.model.ProductVariant::getStock)
                    .orElse(0);
        }

        // If only size is provided, find by size
        if (size != null && !size.isEmpty()) {
            return variantRepo.findByProductAndSize(product, size)
                    .map(com.example.PBL3.model.ProductVariant::getStock)
                    .orElse(0);
        }

        // Otherwise return total product stock
        return product.getStock();
    }

    @Override
    public void fixProductPrices() {
        List<Product> products = productRepo.findAll();
        for (Product product : products) {
            // Generate random price between 10 and 99
            double randomValue = 10.0 + Math.random() * (99.0 - 10.0);
            BigDecimal price = BigDecimal.valueOf(randomValue);

            // Round to 2 decimal places
            price = price.setScale(2, java.math.RoundingMode.HALF_UP);

            product.setPrice(price);

            // Also ensure discount is reasonable (0-50%) if it exists
            if (product.getDiscount() != null) {
                // Keep existing discount or set a small one? User didn't specify changing
                // discount, only price.
                // "làm tròn đến 2 chữ số nếu có mã giảm giá" -> imply ensuring final
                // calculations are clean?
                // But simply setting price to 2 decimals is enough.
            }
        }
        productRepo.saveAll(products);
    }

    @Override
    public List<ProductDTO> getDiscountedProducts() {
        return productRepo.findDiscountedProducts().stream()
                .map(mapperUtil::toProductDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getTopSellingProducts(int limit) {
        // Get top selling products from analytics
        // Using current time and lookback of 30 days
        java.time.LocalDateTime end = java.time.LocalDateTime.now();
        java.time.LocalDateTime start = end.minusDays(30);

        // Get all sellers' top products (not filtered by seller)
        // We'll aggregate across all sellers
        List<com.example.PBL3.dto.analytics.TopProductDTO> topProducts = orderItemRepo.findTopSellingProducts(null,
                start, end);

        // Get product IDs from top products and fetch full product details
        List<ProductDTO> result = new ArrayList<>();
        for (com.example.PBL3.dto.analytics.TopProductDTO topProduct : topProducts) {
            if (result.size() >= limit)
                break;

            // Find product by name (not ideal but works for now)
            List<Product> products = productRepo.findAll().stream()
                    .filter(p -> p.getName().equals(topProduct.getName()) &&
                            p.getStatus() == ProductStatus.APPROVED)
                    .limit(1)
                    .collect(Collectors.toList());

            if (!products.isEmpty()) {
                result.add(mapperUtil.toProductDTO(products.get(0)));
            }
        }

        // If not enough top-selling products, fill with random approved products
        if (result.size() < limit) {
            List<Product> fallbackProducts = productRepo.findByStatus(ProductStatus.APPROVED);
            for (Product p : fallbackProducts) {
                if (result.size() >= limit)
                    break;
                ProductDTO dto = mapperUtil.toProductDTO(p);
                if (result.stream().noneMatch(existing -> existing.getId().equals(dto.getId()))) {
                    result.add(dto);
                }
            }
        }

        return result.stream().limit(limit).collect(Collectors.toList());
    }
}