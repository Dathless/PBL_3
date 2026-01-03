package com.example.PBL3.service.Impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.OrderDTO;
import com.example.PBL3.dto.OrderForSeller;
import com.example.PBL3.dto.OrderItemDTO;
import com.example.PBL3.model.Order;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.OrderItemRepository;
import com.example.PBL3.repository.OrderRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.OrderService;
import com.example.PBL3.util.MapperUtil;
import com.example.PBL3.model.status.OrderStatus;
import com.example.PBL3.model.status.NotificationType;
import com.example.PBL3.service.NotificationService;
import com.example.PBL3.repository.ProductVariantRepository;
import com.example.PBL3.model.ProductVariant;
import com.example.PBL3.model.status.ProductStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;

//@Service
//@Transactional
//@RequiredArgsConstructor
//@Slf4j
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

	private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OrderServiceImpl.class);

	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final OrderItemRepository orderItemRepository;
	private final ProductVariantRepository productVariantRepository;
	private final MapperUtil mapperUtil;
	private final NotificationService notificationService;

	public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository,
			ProductRepository productRepository, OrderItemRepository orderItemRepository,
			ProductVariantRepository productVariantRepository, MapperUtil mapperUtil,
			NotificationService notificationService) {
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.orderItemRepository = orderItemRepository;
		this.productVariantRepository = productVariantRepository;
		this.mapperUtil = mapperUtil;
		this.notificationService = notificationService;
	}

	@Override
	public List<OrderDTO> getAllOrders() {
		return orderRepository.findAll().stream()
				.map(mapperUtil::toOrderDTO)
				.collect(Collectors.toList());
	}

	@Override
	public OrderDTO getById(UUID id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found"));
		return mapperUtil.toOrderDTO(order);
	}

	@Override
	public OrderDTO create(OrderDTO dto) {
		try {
			log.info("Creating order for customer: {}", dto.getCustomerId());

			User customer = userRepository.findById(dto.getCustomerId())
					.orElseThrow(() -> new RuntimeException("Customer not found"));

			// Get all item in order
			List<UUID> productIds = dto.getItems().stream()
					.map(OrderItemDTO::getProductId)
					.toList();

			log.info("Product IDs: {}", productIds);

			List<Product> products = productRepository.findAllById(productIds);

			log.info("Found {} products out of {} requested", products.size(), productIds.size());

			if (products.size() != productIds.size()) {
				log.error("Some products not found. Expected: {}, Found: {}", productIds.size(), products.size());
				throw new RuntimeException("Some products not found");
			}

			// mapping entity <-> dto and add to order
			Order order = mapperUtil.toOrder(dto, customer, products);

			// Stock Management
			for (com.example.PBL3.model.OrderItem item : order.getItems()) {
				Product product = item.getProduct();
				int quantityToSubtract = item.getQuantity();

				// Update ProductVariant stock if size/color selected
				String selectedSize = item.getSelectedSize();
				String selectedColor = item.getSelectedColor();

				// Normalize synthetic defaults from frontend
				String finalColor = (selectedColor == null || selectedColor.isEmpty()
						|| "default".equalsIgnoreCase(selectedColor)) ? null : selectedColor;
				String finalSize = (selectedSize == null || selectedSize.isEmpty()
						|| "One Size".equalsIgnoreCase(selectedSize) || "Onesize".equalsIgnoreCase(selectedSize)) ? null
								: selectedSize;

				if (finalSize != null || finalColor != null) {
					java.util.Optional<ProductVariant> variantOpt = java.util.Optional.empty();

					if (finalColor != null && finalSize != null) {
						variantOpt = productVariantRepository.findByProductAndColorAndSize(product, finalColor,
								finalSize);
						// Fallback if exact match fails
						if (variantOpt.isEmpty()) {
							variantOpt = productVariantRepository.findByProductAndSize(product, finalSize);
						}
					} else if (finalSize != null) {
						variantOpt = productVariantRepository.findByProductAndSize(product, finalSize);
					}

					if (variantOpt.isPresent()) {
						ProductVariant variant = variantOpt.get();
						log.info("Updating stock for variant: {} {} (Stock: {} -> {})",
								variant.getColor(), variant.getSize(), variant.getStock(),
								variant.getStock() - quantityToSubtract);
						if (variant.getStock() < quantityToSubtract) {
							throw new RuntimeException("Insufficient stock for variant selection");
						}
						variant.setStock(variant.getStock() - quantityToSubtract);
						productVariantRepository.save(variant);
					} else {
						log.warn("No variant found for Color: {} and Size: {}. Skipping variant stock update.",
								finalColor, finalSize);
					}
				}

				// Update main Product stock
				if (product.getStock() < quantityToSubtract) {
					throw new RuntimeException("Insufficient stock for product " + product.getName());
				}
				product.setStock(product.getStock() - quantityToSubtract);

				// Update status if sold out
				if (product.getStock() <= 0) {
					product.setStatus(ProductStatus.OUT_OF_STOCK);
				}

				productRepository.save(product);
			}

			orderRepository.save(order);

			log.info("Order created successfully with ID: {}", order.getId());

			// Create notification for customer
			notificationService.createNotification(
					customer.getId(),
					"Order Placed",
					"Your order " + order.getId() + " has been placed successfully.",
					NotificationType.ORDER);

			return mapperUtil.toOrderDTO(order);
		} catch (RuntimeException e) {
			log.error("Error creating order: ", e);
			throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
		}
	}

	@Override
	public OrderDTO update(UUID id, OrderDTO dto) {
		Order existingOrder = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		existingOrder.setStatus(dto.getStatus());
		existingOrder.setShippingAddress(dto.getShippingAddress());
		existingOrder.setPaymentMethod(dto.getPaymentMethod());
		existingOrder.setTotalAmount(dto.getTotalAmount());

		orderRepository.save(existingOrder);
		return mapperUtil.toOrderDTO(existingOrder);
	}

	@Override
	public void delete(UUID id) {
		if (!orderRepository.existsById(id)) {
			throw new RuntimeException("Product not found with id: " + id);
		}

		orderRepository.deleteById(id);
	}

	@Override
	public List<OrderForSeller> getOrdersForSeller(UUID sellerId) {
		return orderItemRepository.findBySellerId(sellerId).stream()
				.map(mapperUtil::toOrderForSeller)
				.collect(Collectors.toList());
	}

	@Override
	public OrderDTO updateStatus(UUID id, OrderStatus status) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		// If order is completed (DELIVERED), credit the seller's balance
		if (status == OrderStatus.DELIVERED && order.getStatus() != OrderStatus.DELIVERED) {
			for (com.example.PBL3.model.OrderItem item : order.getItems()) {
				User seller = item.getProduct().getSeller();
				if (seller != null) {
					// Credit logic: item price * quantity
					// item.getPrice() is BigDecimal
					BigDecimal amount = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

					// Add to seller balance
					if (seller.getBalance() == null)
						seller.setBalance(BigDecimal.ZERO);
					seller.setBalance(seller.getBalance().add(amount));
					userRepository.save(seller);
				}
			}
		}

		// If order is canceled, return stock
		if (status == OrderStatus.CANCELED && order.getStatus() != OrderStatus.CANCELED) {
			returnStock(order);
		}

		order.setStatus(status);
		orderRepository.save(order);

		// Create notification for customer about status update
		notificationService.createNotification(
				order.getCustomer().getId(),
				"Order Status Updated",
				"Your order " + order.getId() + " is now " + status.toString(),
				NotificationType.ORDER);

		return mapperUtil.toOrderDTO(order);
	}

	@Override
	public List<OrderDTO> getOrdersByCustomerId(UUID customerId) {
		return orderRepository.findByCustomerId(customerId).stream()
				.map(mapperUtil::toOrderDTO)
				.collect(Collectors.toList());
	}

	@Override
	public OrderDTO cancelOrder(UUID id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		if (order.getStatus() == OrderStatus.PENDING_CONFIRMATION) {
			order.setStatus(OrderStatus.CANCELED);
			returnStock(order);
		} else if (order.getStatus() == OrderStatus.WAITING_FOR_PICKUP) {
			order.setStatus(OrderStatus.CANCEL_REQUESTED);
		} else {
			throw new RuntimeException("Order cannot be canceled in its current status: " + order.getStatus());
		}

		orderRepository.save(order);
		return mapperUtil.toOrderDTO(order);
	}

	private void returnStock(Order order) {
		log.info("Returning stock for canceled order: {}", order.getId());
		for (com.example.PBL3.model.OrderItem item : order.getItems()) {
			Product product = item.getProduct();
			int quantityToAdd = item.getQuantity();

			// Return ProductVariant stock if size/color selected
			String selectedSize = item.getSelectedSize();
			String selectedColor = item.getSelectedColor();

			// Normalize synthetic defaults from frontend
			String finalColor = (selectedColor == null || selectedColor.isEmpty()
					|| "default".equalsIgnoreCase(selectedColor)) ? null
							: selectedColor;
			String finalSize = (selectedSize == null || selectedSize.isEmpty()
					|| "One Size".equalsIgnoreCase(selectedSize) || "Onesize".equalsIgnoreCase(selectedSize)) ? null
							: selectedSize;

			if (finalSize != null || finalColor != null) {
				java.util.Optional<ProductVariant> variantOpt = java.util.Optional.empty();
				if (finalColor != null && finalSize != null) {
					variantOpt = productVariantRepository.findByProductAndColorAndSize(product, finalColor, finalSize);
					if (variantOpt.isEmpty()) {
						variantOpt = productVariantRepository.findByProductAndSize(product, finalSize);
					}
				} else if (finalSize != null) {
					variantOpt = productVariantRepository.findByProductAndSize(product, finalSize);
				}

				if (variantOpt.isPresent()) {
					ProductVariant variant = variantOpt.get();
					variant.setStock(variant.getStock() + quantityToAdd);
					productVariantRepository.save(variant);
					log.info("Returned stock for variant: {} {} (+{})", variant.getColor(), variant.getSize(),
							quantityToAdd);
				}
			}

			// Return main Product stock
			product.setStock(product.getStock() + quantityToAdd);
			// Also restore status if it was OUT_OF_STOCK
			if (product.getStatus() == ProductStatus.OUT_OF_STOCK && product.getStock() > 0) {
				product.setStatus(ProductStatus.AVAILABLE);
			}
			productRepository.save(product);
			log.info("Returned stock for product: {} (+{})", product.getName(), quantityToAdd);
		}
	}

}
