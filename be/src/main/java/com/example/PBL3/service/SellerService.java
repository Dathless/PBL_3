package com.example.PBL3.service;

import com.example.PBL3.dto.analytics.AnalyticsSummaryDTO;
import com.example.PBL3.dto.analytics.SeriesPointDTO;
import com.example.PBL3.dto.analytics.TopProductDTO;
import java.util.List;
import java.util.UUID;

public interface SellerService {
    AnalyticsSummaryDTO getAnalyticsSummary(UUID sellerId, String period);

    List<SeriesPointDTO> getRevenueSeries(UUID sellerId, String period);

    List<SeriesPointDTO> getOrderSeries(UUID sellerId, String period);

    List<TopProductDTO> getTopSellingProducts(UUID sellerId, String period);

    void syncSellerBalance(UUID sellerId);
}
