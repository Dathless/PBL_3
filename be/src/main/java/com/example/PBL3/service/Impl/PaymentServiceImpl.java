package com.example.PBL3.service.Impl;

import com.example.PBL3.dto.PaymentDTO;
import com.example.PBL3.dto.PaymentRequestDTO;
import com.example.PBL3.dto.PaymentResponseDTO;
import com.example.PBL3.model.Order;
import com.example.PBL3.model.Payment;
import com.example.PBL3.repository.OrderRepository;
import com.example.PBL3.repository.PaymentRepository;
import com.example.PBL3.service.PaymentService;
import com.example.PBL3.util.MapperUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final MapperUtil mapperUtil;

    public PaymentServiceImpl(PaymentRepository paymentRepository, OrderRepository orderRepository, MapperUtil mapperUtil) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.mapperUtil = mapperUtil;
    }

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto){
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order Not Found"));
        paymentRepository.findByOrder_Id(order.getId()).ifPresent(p -> {
            throw new IllegalStateException("Payment already exists");
        });
        Payment payment = mapperUtil.toPayment(dto, order);
        Payment saved  = paymentRepository.save(payment);
        return mapperUtil.toPaymentResponseDTO(saved);
    }

    @Override
    public PaymentResponseDTO getPaymentById(UUID id){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment Not Found"));
        return mapperUtil.toPaymentResponseDTO(payment);
    }

    @Override
    public PaymentResponseDTO getPaymentByOrderId(UUID orderId){
        Payment payment = paymentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Payment Not Found In This Order"));
        return mapperUtil.toPaymentResponseDTO(payment);
    }

    @Override
    public List<PaymentDTO> getAllPayments(){
        return paymentRepository.findAll().stream()
                .map(mapperUtil::toPaymentDTO)
                .collect(Collectors.toList());
    }
}
