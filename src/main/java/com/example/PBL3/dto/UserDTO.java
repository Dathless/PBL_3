package com.example.PBL3.dto;

import java.time.LocalDateTime;
import lombok.*;
import java.util.UUID;

import com.example.PBL3.model.status.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String username;
    private String password;
    private String email;
    private String address;
    private String phone;
    private boolean enabled;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}