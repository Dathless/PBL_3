package com.example.PBL3.repository;

import com.example.PBL3.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	List<OrderItem> findByOrderId(UUID orderId);

	boolean existsByProductId(UUID productId);
}
