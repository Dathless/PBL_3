package com.example.PBL3.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PBL3.dto.OrderDTO;
import com.example.PBL3.dto.OrderForSeller;
import com.example.PBL3.service.OrderService;
import com.example.PBL3.model.status.OrderStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;

//@RestController
//@RequestMapping("/api/orders")
//@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;

	private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OrderController.class);

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public ResponseEntity<List<OrderDTO>> getAllOrders() {
		List<OrderDTO> orders = orderService.getAllOrders();
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderDTO> getById(@PathVariable UUID id) {
		OrderDTO order = orderService.getById(id);
		return ResponseEntity.ok(order);
	}

	@PostMapping
	public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto) {
		try {
			log.info("Received order creation request: customerId={}, items={}", dto.getCustomerId(),
					dto.getItems() != null ? dto.getItems().size() : 0);
			OrderDTO created = orderService.create(dto);
			return ResponseEntity.status(HttpStatus.CREATED).body(created);
		} catch (Exception e) {
			log.error("Error in createOrder controller: ", e);
			throw e;
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<OrderDTO> updateOrder(@PathVariable UUID id,
			@RequestBody OrderDTO dto) {
		OrderDTO updated = orderService.update(id, dto);
		return ResponseEntity.ok(updated);
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<OrderDTO> updateStatus(@PathVariable UUID id,
			@RequestBody java.util.Map<String, String> body) {
		OrderStatus status = OrderStatus.valueOf(body.get("status"));
		OrderDTO updated = orderService.updateStatus(id, status);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
		orderService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/cancel")
	public ResponseEntity<OrderDTO> cancelOrder(@PathVariable UUID id) {
		OrderDTO canceled = orderService.cancelOrder(id);
		return ResponseEntity.ok(canceled);
	}

	@GetMapping("/seller/{sellerId}")
	public ResponseEntity<List<OrderForSeller>> getOrdersForSeller(@PathVariable UUID sellerId) {
		List<OrderForSeller> orders = orderService.getOrdersForSeller(sellerId);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/customer/{customerId}")
	public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(@PathVariable UUID customerId) {
		List<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId);
		return ResponseEntity.ok(orders);
	}

}
