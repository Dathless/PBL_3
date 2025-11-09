package com.example.PBL3.controller;

import java.util.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PBL3.dto.OrderItemDTO;
import com.example.PBL3.service.OrderItemService;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
@Slf4j
public class OrderItemController {

    private final OrderItemService orderItemService;


    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItemById(@PathVariable Long id) {
        OrderItemDTO item = orderItemService.getOrderItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemDTO>> getItemsByOrderId(@PathVariable UUID orderId) {
        List<OrderItemDTO> items = orderItemService.getItemsByOrderId(orderId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<OrderItemDTO> addItemToOrder(
            @PathVariable UUID orderId,
            @RequestBody OrderItemDTO itemDTO) {

        OrderItemDTO createdItem = orderItemService.addItemToOrder(orderId, itemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}