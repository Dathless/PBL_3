package com.example.PBL3.service.Impl;

import com.example.PBL3.dto.MessageDTO;
import com.example.PBL3.model.Message;
import com.example.PBL3.repository.MessageRepository;
import com.example.PBL3.repository.ProductRepository;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.MessageService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public MessageServiceImpl(MessageRepository messageRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Override
    public MessageDTO sendMessage(MessageDTO dto) {
        Message message = new Message();
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(dto.getReceiverId());
        message.setProductId(dto.getProductId());
        message.setContent(dto.getContent());
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);

        Message saved = messageRepo.save(message);
        return toDTO(saved);
    }

    @Override
    public List<MessageDTO> getConversation(UUID userId, UUID otherUserId) {
        return messageRepo.findConversation(userId, otherUserId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(UUID messageId) {
        Message message = messageRepo.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
        message.setRead(true);
        messageRepo.save(message);
    }

    @Override
    public long getUnreadCount(UUID userId) {
        return messageRepo.countUnreadByReceiverId(userId);
    }

    @Override
    public List<MessageDTO> getUserMessages(UUID userId) {
        return messageRepo.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MessageDTO toDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setReceiverId(message.getReceiverId());
        dto.setProductId(message.getProductId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setRead(message.isRead());

        // Fetch sender name
        userRepo.findById(message.getSenderId()).ifPresent(user -> {
            dto.setSenderName(user.getFullname());
        });

        // Fetch receiver name
        userRepo.findById(message.getReceiverId()).ifPresent(user -> {
            dto.setReceiverName(user.getFullname());
        });

        // Fetch product name if exists
        if (message.getProductId() != null) {
            productRepo.findById(message.getProductId()).ifPresent(product -> {
                dto.setProductName(product.getName());
            });
        }

        return dto;
    }
}
