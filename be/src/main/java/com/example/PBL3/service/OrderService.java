package com.example.PBL3.service;

import java.util.List;
import java.util.UUID;

import com.example.PBL3.dto.OrderDTO;
import com.example.PBL3.dto.OrderForSeller;

public interface OrderService {
	
	List<OrderDTO> getAllOrders();
	OrderDTO getById(UUID id);
	OrderDTO create(OrderDTO dto);
	OrderDTO update(UUID id, OrderDTO dto);
	void delete(UUID id);
	

//	List<OrderDTO> getOrdersByStatus(String status);
//	List<OrderDTO> searchOrders(UUID customerId, String status);

}