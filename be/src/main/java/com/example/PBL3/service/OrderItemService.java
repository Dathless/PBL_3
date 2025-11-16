package com.example.PBL3.service;

import java.util.*;

import com.example.PBL3.dto.OrderItemDTO;

public interface OrderItemService {
	OrderItemDTO getOrderItemById(Long id);
    List<OrderItemDTO> getItemsByOrderId(UUID orderId);
    OrderItemDTO addItemToOrder(UUID orderId, OrderItemDTO orderItemDTO);
    void deleteOrderItem(Long id);
}
