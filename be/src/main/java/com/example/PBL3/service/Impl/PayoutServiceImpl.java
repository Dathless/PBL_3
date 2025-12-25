package com.example.PBL3.service.Impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.PayoutDTO;
import com.example.PBL3.model.Payout;
import com.example.PBL3.model.User;
import com.example.PBL3.model.status.PayoutStatus;
import com.example.PBL3.repository.PayoutRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.PayoutService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
public class PayoutServiceImpl implements PayoutService {

        private final PayoutRepository payoutRepo;
        private final UserRepository userRepo;

        public PayoutServiceImpl(PayoutRepository payoutRepo, UserRepository userRepo) {
                this.payoutRepo = payoutRepo;
                this.userRepo = userRepo;
        }

        @Override
        public List<PayoutDTO> getPayoutsBySellerId(UUID sellerId) {
                return payoutRepo.findBySellerId(sellerId).stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public PayoutDTO requestPayout(UUID sellerId, BigDecimal amount, String method) {
                User seller = userRepo.findById(sellerId)
                                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

                if (seller.getBalance().compareTo(amount) < 0) {
                        throw new IllegalArgumentException("Insufficient balance");
                }

                // Deduct balance
                seller.setBalance(seller.getBalance().subtract(amount));
                userRepo.save(seller);

                // Create payout record
                Payout payout = Payout.builder()
                                .seller(seller)
                                .amount(amount)
                                .method(method)
                                .status(PayoutStatus.PENDING)
                                .build();

                payout = payoutRepo.save(payout);
                return mapToDTO(payout);
        }

        @Override
        public Map<String, Object> getPayoutStats(UUID sellerId) {
                User seller = userRepo.findById(sellerId)
                                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));

                List<Payout> payouts = payoutRepo.findBySellerId(sellerId);

                BigDecimal totalEarnings = seller.getBalance(); // Current available balance
                // Note: Real total earnings would be balance + completed payouts.
                // For this UI, "Total Earnings" usually means "Total Earned All Time" or
                // "Current Balance".
                // Let's assume stats.totalEarnings = current balance + total paid out.

                BigDecimal pendingPayout = payouts.stream()
                                .filter(p -> p.getStatus() == PayoutStatus.PENDING)
                                .map(Payout::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal completedPayouts = payouts.stream()
                                .filter(p -> p.getStatus() == PayoutStatus.COMPLETED)
                                .map(Payout::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalEarnedAllTime = seller.getBalance().add(completedPayouts).add(pendingPayout); // Rough
                                                                                                              // estimate

                return Map.of(
                                "totalEarnings", totalEarnedAllTime,
                                "currentBalance", seller.getBalance(),
                                "pendingPayout", pendingPayout,
                                "completedPayouts", completedPayouts,
                                "nextPayout", "N/A" // Placeholder
                );
        }

        @Override
        public List<PayoutDTO> getAllPayouts() {
                return payoutRepo.findAll().stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public PayoutDTO updatePayoutStatus(UUID payoutId, PayoutStatus status) {
                Payout payout = payoutRepo.findById(payoutId)
                                .orElseThrow(() -> new EntityNotFoundException("Payout not found"));

                PayoutStatus oldStatus = payout.getStatus();
                payout.setStatus(status);

                // If rejecting/cancelling, refund the balance to the seller
                if (status == PayoutStatus.CANCELLED && oldStatus != PayoutStatus.CANCELLED) {
                        User seller = payout.getSeller();
                        seller.setBalance(seller.getBalance().add(payout.getAmount()));
                        userRepo.save(seller);
                }

                payout = payoutRepo.save(payout);
                return mapToDTO(payout);
        }

        private PayoutDTO mapToDTO(Payout payout) {
                return PayoutDTO.builder()
                                .id(payout.getId())
                                .sellerId(payout.getSeller().getId())
                                .sellerName(payout.getSeller().getFullname())
                                .amount(payout.getAmount())
                                .status(payout.getStatus())
                                .method(payout.getMethod())
                                .createdAt(payout.getCreatedAt())
                                .updatedAt(payout.getUpdatedAt())
                                .build();
        }
}
