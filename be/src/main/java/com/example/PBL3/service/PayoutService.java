package com.example.PBL3.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.PBL3.dto.PayoutDTO;

public interface PayoutService {
    List<PayoutDTO> getPayoutsBySellerId(UUID sellerId);

    PayoutDTO requestPayout(UUID sellerId, BigDecimal amount, String method);

    java.util.Map<String, Object> getPayoutStats(UUID sellerId);

    List<PayoutDTO> getAllPayouts();

    PayoutDTO updatePayoutStatus(UUID payoutId, com.example.PBL3.model.status.PayoutStatus status);
}
