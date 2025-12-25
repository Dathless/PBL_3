package com.example.PBL3.controller;

import com.example.PBL3.dto.analytics.AnalyticsSummaryDTO;
import com.example.PBL3.dto.analytics.SeriesPointDTO;
import com.example.PBL3.dto.analytics.TopProductDTO;
import com.example.PBL3.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @GetMapping("/{sellerId}/analytics/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getAnalyticsSummary(
            @PathVariable UUID sellerId,
            @RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(sellerService.getAnalyticsSummary(sellerId, period));
    }

    @GetMapping("/{sellerId}/analytics/revenue-trend")
    public ResponseEntity<List<SeriesPointDTO>> getRevenueSeries(
            @PathVariable UUID sellerId,
            @RequestParam(defaultValue = "daily") String granularity,
            @RequestParam(defaultValue = "7d") String period) {
        // We reuse 'period' to determine the range. 'granularity' could be used in
        // service if needed further.
        return ResponseEntity.ok(sellerService.getRevenueSeries(sellerId, period));
    }

    @GetMapping("/{sellerId}/analytics/order-trend")
    public ResponseEntity<List<SeriesPointDTO>> getOrderSeries(
            @PathVariable UUID sellerId,
            @RequestParam(defaultValue = "daily") String granularity,
            @RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(sellerService.getOrderSeries(sellerId, period));
    }

    @GetMapping("/{sellerId}/analytics/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopSellingProducts(
            @PathVariable UUID sellerId,
            @RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(sellerService.getTopSellingProducts(sellerId, period));
    }

    @PostMapping("/{sellerId}/sync-balance")
    public ResponseEntity<Void> syncBalance(@PathVariable UUID sellerId) {
        sellerService.syncSellerBalance(sellerId);
        return ResponseEntity.ok().build();
    }
}
