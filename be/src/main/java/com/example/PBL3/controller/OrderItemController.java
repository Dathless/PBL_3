package com.example.PBL3.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PBL3.dto.OrderForSeller;
import com.example.PBL3.dto.OrderItemDTO;
import com.example.PBL3.service.OrderItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


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

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderForSeller>> getOrderForSeller(@PathVariable UUID sellerId) {
        List<OrderForSeller> orders = orderItemService.getOrderForSeller(sellerId);
        return ResponseEntity.ok(orders);
    }
}