package com.example.PBL3.service.Impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.OrderForSeller;
import com.example.PBL3.dto.OrderItemDTO;
import com.example.PBL3.model.Order;
import com.example.PBL3.model.OrderItem;
import com.example.PBL3.model.Product;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.OrderItemRepository;
import com.example.PBL3.repository.OrderRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.OrderItemService;
import com.example.PBL3.util.MapperUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {
	private final OrderItemRepository orderItemRepository;
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final MapperUtil mapperUtil;


	@Override
	public OrderItemDTO getOrderItemById(Long id) {
		OrderItem item = orderItemRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order Item not found with id: "+ id));
		return mapperUtil.toOrderItemDTO(item);
	}

	@Override
	public List<OrderItemDTO> getItemsByOrderId(UUID orderId){
		List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
		return items.stream().map(mapperUtil::toOrderItemDTO).collect(Collectors.toList());
	}

	@Override
	public OrderItemDTO addItemToOrder(UUID orderId, OrderItemDTO orderItemDTO) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
		Product product = productRepository.findById(orderItemDTO.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found with id: "+ orderItemDTO.getProductId()));

		OrderItem item = mapperUtil.toOrderItem(orderItemDTO, order, product);
		orderItemRepository.save(item);
		return mapperUtil.toOrderItemDTO(item);
	}

	@Override
	public void deleteOrderItem(Long id) {
		if (!orderItemRepository.existsById(id)) {
			throw new RuntimeException("Order item not found with id: "+ id);
		}
		orderItemRepository.deleteById(id);
	}

	@Override
	public List<OrderForSeller> getOrderForSeller(UUID sellerId) {
		List<OrderItem> items = orderItemRepository.findAll();
		List<OrderForSeller> ordersForSeller = new ArrayList<>();
		for (OrderItem orderItem : items) {
			if (!orderItem.getProduct().getSeller().getId().equals(sellerId)) {
            continue;
        	}
			OrderForSeller orderForSeller = new OrderForSeller();
			orderForSeller.setSellerId(sellerId);
			orderForSeller.setOrderId(orderItem.getOrder().getId());
			
			Product product = productRepository.findById(orderItem.getProduct().getId())
					.orElseThrow(() -> new RuntimeException("Product not found with id: "+ orderItem.getProduct().getId()));
			orderForSeller.setProductId(product.getId());
			orderForSeller.setProductName(product.getName());

			User customer = userRepository.findById(orderItem.getOrder().getCustomer().getId())
					.orElseThrow(() -> new RuntimeException("User not found with id: "+ orderItem.getOrder().getCustomer().getId()));
			orderForSeller.setCustomerId(customer.getId());
			orderForSeller.setCustomerName(customer.getFullname());

			orderForSeller.setProductName(orderItem.getProduct().getName());
			orderForSeller.setQuantity(orderItem.getQuantity());
			orderForSeller.setPrice(orderItem.getPrice());
			orderForSeller.setOrderDate(orderItem.getOrder().getOrderDate());
			orderForSeller.setStatus(orderItem.getOrder().getStatus());
			orderForSeller.setSelectedColor(orderItem.getSelectedColor());
			orderForSeller.setSelectedSize(orderItem.getSelectedSize());
			ordersForSeller.add(orderForSeller);
		}

		return ordersForSeller;
	}
}
