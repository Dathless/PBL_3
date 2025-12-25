package com.example.PBL3.service;

import com.example.PBL3.dto.NotificationDTO;
import com.example.PBL3.model.status.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationDTO> getUserNotifications(UUID userId);

    long getUnreadCount(UUID userId);

    void markAsRead(UUID notificationId);

    void markAllAsRead(UUID userId);

    void createNotification(UUID userId, String title, String message, NotificationType type);

    void deleteNotification(UUID notificationId);
}
