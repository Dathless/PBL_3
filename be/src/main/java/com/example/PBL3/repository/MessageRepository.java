package com.example.PBL3.repository;

import com.example.PBL3.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    // Get all messages for a user (sent or received)
    @Query("SELECT m FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.createdAt DESC")
    List<Message> findByUserId(@Param("userId") UUID userId);

    // Get conversation between two users
    @Query("SELECT m FROM Message m WHERE (m.senderId = :user1 AND m.receiverId = :user2) OR (m.senderId = :user2 AND m.receiverId = :user1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("user1") UUID user1, @Param("user2") UUID user2);

    // Get messages about a specific product
    List<Message> findByProductId(UUID productId);

    // Count unread messages for a user
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :userId AND m.read = false")
    long countUnreadByReceiverId(@Param("userId") UUID userId);
}
