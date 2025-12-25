package com.example.PBL3.repository;

import com.example.PBL3.model.OrderItem;
import com.example.PBL3.dto.analytics.TopProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	List<OrderItem> findByOrderId(UUID orderId);

	boolean existsByProductId(UUID productId);

	@Query("SELECT oi FROM OrderItem oi " +
			"JOIN FETCH oi.order o " +
			"JOIN FETCH o.customer c " +
			"JOIN FETCH oi.product p " +
			"JOIN FETCH p.seller s " +
			"WHERE s.id = :sellerId")
	List<OrderItem> findBySellerId(@Param("sellerId") UUID sellerId);

	// Analytics

	@Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi " +
			"JOIN oi.product p " +
			"JOIN oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end " +
			"AND o.status = 'DELIVERED'")
	BigDecimal calculateRevenue(@Param("sellerId") UUID sellerId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	@Query("SELECT COUNT(DISTINCT o.id) FROM OrderItem oi " +
			"JOIN oi.product p " +
			"JOIN oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end " +
			"AND o.status <> 'CANCELED'")
	Long countOrders(@Param("sellerId") UUID sellerId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	@Query("SELECT COUNT(DISTINCT o.customer.id) FROM OrderItem oi " +
			"JOIN oi.product p " +
			"JOIN oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end " +
			"AND o.status <> 'CANCELED'")
	Long countCustomers(@Param("sellerId") UUID sellerId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	@Query("SELECT new com.example.PBL3.dto.analytics.TopProductDTO(p.name, SUM(oi.quantity), SUM(oi.price * oi.quantity), "
			+
			"(SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product = p AND pi.id = (SELECT MIN(pi2.id) FROM ProductImage pi2 WHERE pi2.product = p))) "
			+
			"FROM OrderItem oi " +
			"JOIN oi.product p " +
			"JOIN oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end " +
			"AND o.status <> 'CANCELED' " +
			"GROUP BY p.id, p.name " + // Group by ID to allow subquery and unique identification
			"ORDER BY SUM(oi.quantity) DESC")
	List<TopProductDTO> findTopSellingProducts(@Param("sellerId") UUID sellerId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);

	// For charts, we can fetch raw data points and aggregate in service to be DB
	// agnostic regarding DATE() functions
	// Or we can just fetch all relevant order items in the period
	@Query("SELECT oi FROM OrderItem oi " +
			"JOIN FETCH oi.product p " +
			"JOIN FETCH oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end " +
			"AND o.status = 'DELIVERED'")
	List<OrderItem> findCompletedOrderItemsInPeriod(@Param("sellerId") UUID sellerId,
			@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT oi FROM OrderItem oi " +
			"JOIN FETCH oi.product p " +
			"JOIN FETCH oi.order o " +
			"WHERE p.seller.id = :sellerId " +
			"AND o.orderDate BETWEEN :start AND :end")
	List<OrderItem> findOrderItemsInPeriod(@Param("sellerId") UUID sellerId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);
}
