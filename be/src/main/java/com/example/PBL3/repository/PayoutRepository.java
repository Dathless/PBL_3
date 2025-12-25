package com.example.PBL3.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PBL3.model.Payout;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, UUID> {
    List<Payout> findBySellerId(UUID sellerId);
}
