package com.example.PBL3.controller;

import java.util.List;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PBL3.dto.OrderDTO;
import com.example.PBL3.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

	private final OrderService orderService;


	@GetMapping
	public ResponseEntity<List<OrderDTO>> getAllOrders(){
		List<OrderDTO> orders = orderService.getAllOrders();
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderDTO> getById(@PathVariable UUID orderId){
		OrderDTO order = orderService.getById(orderId);
		return ResponseEntity.ok(order);
	}

	@PostMapping
	public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto){
		OrderDTO created = orderService.create(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
	@PutMapping("/{id}")
	public ResponseEntity<OrderDTO> updateOrder(@PathVariable UUID orderId,
												@RequestBody OrderDTO dto) {
		OrderDTO updated = orderService.update(orderId, dto);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOrder(@PathVariable UUID orderId){
		orderService.delete(orderId);
		return ResponseEntity.noContent().build();
	}


}
