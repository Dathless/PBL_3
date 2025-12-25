package com.example.PBL3.controller;

import com.example.PBL3.dto.MessageDTO;
import com.example.PBL3.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO dto) {
        return ResponseEntity.ok(messageService.sendMessage(dto));
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable UUID otherUserId,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(messageService.getConversation(userId, otherUserId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        messageService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<java.util.Map<String, Long>> getUnreadCount(@RequestParam UUID userId) {
        long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(java.util.Map.of("count", count));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MessageDTO>> getUserMessages(@PathVariable UUID userId) {
        return ResponseEntity.ok(messageService.getUserMessages(userId));
    }
}
