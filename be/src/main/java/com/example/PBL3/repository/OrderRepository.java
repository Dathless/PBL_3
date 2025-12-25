package com.example.PBL3.repository;

import com.example.PBL3.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
	boolean existsById(UUID id);

	@Query("SELECT o FROM Order o JOIN FETCH o.customer c LEFT JOIN FETCH o.items i WHERE c.id = :customerId")
	List<Order> findByCustomerId(@Param("customerId") UUID customerId);

	@Query("SELECT o FROM Order o JOIN FETCH o.customer c")
	List<Order> findAll();
}
