package com.example.PBL3.service;

import com.example.PBL3.dto.PaymentDTO;
import com.example.PBL3.dto.PaymentRequestDTO;
import com.example.PBL3.dto.PaymentResponseDTO;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentResponseDTO createPayment(PaymentRequestDTO paymentRequestDTO);
    PaymentResponseDTO getPaymentById(UUID id);
    PaymentResponseDTO getPaymentByOrderId(UUID orderId);
    List<PaymentDTO> getAllPayments();
}
