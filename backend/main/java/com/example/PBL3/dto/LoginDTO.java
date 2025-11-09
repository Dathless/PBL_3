package com.example.PBL3.dto;

import com.example.PBL3.model.status.UserRole;
import lombok.*;

@Data
public class LoginDTO {
    private String username;
    private String password;
    private UserRole role;
}
