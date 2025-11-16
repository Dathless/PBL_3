package com.example.PBL3.service.Impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.*;
import com.example.PBL3.model.*;
import com.example.PBL3.repository.*;
import com.example.PBL3.service.OrderService;
import com.example.PBL3.util.MapperUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final MapperUtil mapperUtil;


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
		    
		    if (products.size() != productIds.size()) {
		        log.error("Some products not found. Expected: {}, Found: {}", productIds.size(), products.size());
		        throw new RuntimeException("Some products not found");
		    }

		    // mapping entity <-> dto and add to order
		    Order order = mapperUtil.toOrder(dto, customer, products);

		    orderRepository.save(order);
		    
		    log.info("Order created successfully with ID: {}", order.getId());

		    return mapperUtil.toOrderDTO(order);
		} catch (Exception e) {
			log.error("Error creating order: ", e);
			throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
		}
	}

	@Override
	public OrderDTO update(UUID id, OrderDTO dto){
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

}
