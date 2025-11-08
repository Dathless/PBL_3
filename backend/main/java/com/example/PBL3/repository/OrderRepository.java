package com.example.PBL3.repository;

import com.example.PBL3.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;


public interface OrderRepository extends JpaRepository<Order, UUID> {
	boolean existsById(UUID id);

}
