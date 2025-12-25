package com.example.PBL3.service.Impl;

import com.example.PBL3.dto.analytics.AnalyticsSummaryDTO;
import com.example.PBL3.dto.analytics.SeriesPointDTO;
import com.example.PBL3.dto.analytics.TopProductDTO;
import com.example.PBL3.model.OrderItem;
import com.example.PBL3.repository.OrderItemRepository;
import com.example.PBL3.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import com.example.PBL3.model.User;
import com.example.PBL3.model.Payout;
import com.example.PBL3.model.status.PayoutStatus;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.repository.PayoutRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SellerServiceImpl implements SellerService {

    private final OrderItemRepository orderItemRepository;
    private final com.example.PBL3.repository.ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PayoutRepository payoutRepository;

    public SellerServiceImpl(OrderItemRepository orderItemRepository,
            com.example.PBL3.repository.ProductRepository productRepository,
            UserRepository userRepository,
            PayoutRepository payoutRepository) {
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.payoutRepository = payoutRepository;
    }

    @Override
    public AnalyticsSummaryDTO getAnalyticsSummary(UUID sellerId, String period) {
        TimeRange current = getTimeRange(period);
        TimeRange previous = getPreviousTimeRange(current, period);

        // Current Stats
        BigDecimal curRevenue = orderItemRepository.calculateRevenue(sellerId, current.start, current.end);
        Long curOrders = orderItemRepository.countOrders(sellerId, current.start, current.end);
        Long curCustomers = orderItemRepository.countCustomers(sellerId, current.start, current.end);

        // Previous Stats
        BigDecimal prevRevenue = orderItemRepository.calculateRevenue(sellerId, previous.start, previous.end);
        Long prevOrders = orderItemRepository.countOrders(sellerId, previous.start, previous.end);
        Long prevCustomers = orderItemRepository.countCustomers(sellerId, previous.start, previous.end);

        // Handle nulls
        curRevenue = (curRevenue == null) ? BigDecimal.ZERO : curRevenue;
        curOrders = (curOrders == null) ? 0L : curOrders;
        curCustomers = (curCustomers == null) ? 0L : curCustomers;

        prevRevenue = (prevRevenue == null) ? BigDecimal.ZERO : prevRevenue;
        prevOrders = (prevOrders == null) ? 0L : prevOrders;
        prevCustomers = (prevCustomers == null) ? 0L : prevCustomers;

        // Conversion calculation
        Long curViews = productRepository.getTotalViewsBySeller(sellerId);
        curViews = (curViews == null || curViews == 0) ? 1L : curViews;
        double curConv = curOrders.doubleValue() / curViews.doubleValue() * 100.0;

        double prevViews = curViews.doubleValue() * 0.95;
        double prevConv = prevOrders.doubleValue() / prevViews * 100.0;

        AnalyticsSummaryDTO.Stat conversion = new AnalyticsSummaryDTO.Stat(curConv, prevConv);

        return new AnalyticsSummaryDTO(
                new AnalyticsSummaryDTO.Stat(curRevenue.doubleValue(), prevRevenue.doubleValue()),
                new AnalyticsSummaryDTO.Stat(curOrders.doubleValue(), prevOrders.doubleValue()),
                new AnalyticsSummaryDTO.Stat(curCustomers.doubleValue(), prevCustomers.doubleValue()),
                conversion);
    }

    @Override
    public List<SeriesPointDTO> getRevenueSeries(UUID sellerId, String period) {
        TimeRange range = getTimeRange(period);
        List<OrderItem> items = orderItemRepository.findCompletedOrderItemsInPeriod(sellerId, range.start, range.end);
        boolean isYearly = "1y".equals(period);

        Map<String, Double> aggregated = new HashMap<>();

        // Initialize map with 0s
        fillDateMap(aggregated, range.start, range.end, isYearly);

        for (OrderItem item : items) {
            String key = getDateKey(item.getOrder().getOrderDate(), isYearly);
            double value = item.getPrice().multiply(new BigDecimal(item.getQuantity())).doubleValue();
            aggregated.put(key, aggregated.getOrDefault(key, 0.0) + value);
        }

        List<SeriesPointDTO> result = aggregated.entrySet().stream()
                .map(e -> new SeriesPointDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(SeriesPointDTO::getLabel))
                .collect(Collectors.toList());
        return result;
    }

    @Override
    public List<SeriesPointDTO> getOrderSeries(UUID sellerId, String period) {
        TimeRange range = getTimeRange(period);
        List<OrderItem> items = orderItemRepository.findOrderItemsInPeriod(sellerId, range.start, range.end);
        boolean isYearly = "1y".equals(period);

        Map<String, Set<UUID>> orderSet = new HashMap<>(); // date -> set of order IDs

        // Initialize map
        Map<String, Double> resultMap = new HashMap<>();
        fillDateMap(resultMap, range.start, range.end, isYearly);

        for (OrderItem item : items) {
            String key = getDateKey(item.getOrder().getOrderDate(), isYearly);
            orderSet.computeIfAbsent(key, k -> new HashSet<>()).add(item.getOrder().getId());
        }

        orderSet.forEach((k, v) -> resultMap.put(k, (double) v.size()));

        List<SeriesPointDTO> result = resultMap.entrySet().stream()
                .map(e -> new SeriesPointDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(SeriesPointDTO::getLabel))
                .collect(Collectors.toList());
        return result;
    }

    @Override
    public List<TopProductDTO> getTopSellingProducts(UUID sellerId, String period) {
        TimeRange range = getTimeRange(period);
        List<TopProductDTO> all = orderItemRepository.findTopSellingProducts(sellerId, range.start, range.end);
        // Limit to top 5
        return all.stream().limit(5).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void syncSellerBalance(UUID sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        // 1. Calculate total delivered revenue (all time)
        BigDecimal totalRevenue = orderItemRepository.calculateRevenue(sellerId,
                LocalDateTime.of(2000, 1, 1, 0, 0), // Very early start
                LocalDateTime.now());

        if (totalRevenue == null)
            totalRevenue = BigDecimal.ZERO;

        // 2. Calculate total payouts requested (excluding CANCELLED)
        List<Payout> payouts = payoutRepository.findBySellerId(sellerId);
        BigDecimal totalPaidOut = payouts.stream()
                .filter(p -> p.getStatus() != PayoutStatus.CANCELLED)
                .map(Payout::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. New Balance = Revenue - Payouts
        BigDecimal newBalance = totalRevenue.subtract(totalPaidOut);

        // Ensure balance doesn't go below zero (though it shouldn't mathematically)
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            newBalance = BigDecimal.ZERO;
        }

        seller.setBalance(newBalance);
        userRepository.save(seller);
    }

    // Helpers

    private static class TimeRange {
        LocalDateTime start;
        LocalDateTime end;

        TimeRange(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
        }
    }

    private TimeRange getTimeRange(String period) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;
        switch (period) {
            case "7d":
                start = end.minusDays(7);
                break;
            case "30d":
                start = end.minusDays(30);
                break;
            case "90d":
                start = end.minusDays(90);
                break;
            case "1y":
                start = end.minusYears(1);
                break;
            default:
                start = end.minusDays(7);
                break;
        }
        return new TimeRange(start, end);
    }

    private TimeRange getPreviousTimeRange(TimeRange current, String period) {
        LocalDateTime end = current.start;
        LocalDateTime start;
        switch (period) {
            case "7d":
                start = end.minusDays(7);
                break;
            case "30d":
                start = end.minusDays(30);
                break;
            case "90d":
                start = end.minusDays(90);
                break;
            case "1y":
                start = end.minusYears(1);
                break;
            default:
                start = end.minusDays(7);
                break;
        }
        return new TimeRange(start, end);
    }

    private String getDateKey(LocalDateTime date, boolean isYearly) {
        if (date == null) {
            date = LocalDateTime.now(); // Fallback to avoid NPE
        }
        if (isYearly) {
            return date.toLocalDate().toString().substring(0, 7); // YYYY-MM
        }
        return date.toLocalDate().toString(); // YYYY-MM-DD
    }

    private void fillDateMap(Map<String, Double> map, LocalDateTime start, LocalDateTime end, boolean isYearly) {
        LocalDate currentDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        if (isYearly) {
            while (!currentDate.isAfter(endDate)) {
                String key = currentDate.toString().substring(0, 7);
                map.putIfAbsent(key, 0.0);
                currentDate = currentDate.plusMonths(1);
            }
        } else {
            long days = ChronoUnit.DAYS.between(currentDate, endDate);
            for (int i = 0; i <= days; i++) {
                String key = currentDate.plusDays(i).toString();
                map.putIfAbsent(key, 0.0);
            }
        }
    }
}
