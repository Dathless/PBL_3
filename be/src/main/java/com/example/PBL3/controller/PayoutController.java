package com.example.PBL3.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.PBL3.dto.PayoutDTO;
import com.example.PBL3.model.status.PayoutStatus;
import com.example.PBL3.service.PayoutService;

@RestController
@RequestMapping("/api/payouts")
public class PayoutController {

    private final PayoutService payoutService;

    public PayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<PayoutDTO>> getAllPayouts() {
        return ResponseEntity.ok(payoutService.getAllPayouts());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PayoutDTO> updatePayoutStatus(
            @PathVariable UUID id,
            @RequestParam PayoutStatus status) {
        return ResponseEntity.ok(payoutService.updatePayoutStatus(id, status));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<PayoutDTO>> getPayoutsBySellerId(@PathVariable UUID sellerId) {
        return ResponseEntity.ok(payoutService.getPayoutsBySellerId(sellerId));
    }

    @PostMapping("/request")
    public ResponseEntity<PayoutDTO> requestPayout(
            @RequestParam UUID sellerId,
            @RequestParam BigDecimal amount,
            @RequestParam String method) {
        return ResponseEntity.ok(payoutService.requestPayout(sellerId, amount, method));
    }

    @GetMapping("/stats/{sellerId}")
    public ResponseEntity<Map<String, Object>> getPayoutStats(@PathVariable UUID sellerId) {
        return ResponseEntity.ok(payoutService.getPayoutStats(sellerId));
    }
}
