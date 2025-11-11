package com.example.PBL3.service.Impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.OrderItemDTO;
import com.example.PBL3.model.Order;
import com.example.PBL3.model.OrderItem;
import com.example.PBL3.model.Product;
import com.example.PBL3.repository.*;
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
}
