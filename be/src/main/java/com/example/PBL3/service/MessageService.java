package com.example.PBL3.service;

import com.example.PBL3.dto.MessageDTO;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    MessageDTO sendMessage(MessageDTO dto);

    List<MessageDTO> getConversation(UUID userId, UUID otherUserId);

    void markAsRead(UUID messageId);

    long getUnreadCount(UUID userId);

    List<MessageDTO> getUserMessages(UUID userId);
}
