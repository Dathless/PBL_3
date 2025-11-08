package com.example.PBL3.controller;

import com.example.PBL3.dto.PaymentDTO;
import com.example.PBL3.dto.PaymentRequestDTO;
import com.example.PBL3.dto.PaymentResponseDTO;
import com.example.PBL3.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(@Valid @RequestBody PaymentRequestDTO paymentRequestDTO){
        PaymentResponseDTO paymentResponseDTO = paymentService.createPayment(paymentRequestDTO);
        return ResponseEntity.ok(paymentResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable UUID id){
        PaymentResponseDTO paymentResponseDTO = paymentService.getPaymentById(id);
        return ResponseEntity.ok(paymentResponseDTO);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentByOrderId(@PathVariable UUID orderId){
        PaymentResponseDTO paymentResponseDTO = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(paymentResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments(){
        List<PaymentDTO> list = paymentService.getAllPayments();
        return ResponseEntity.ok(list);
    }
}
