package com.example.PBL3.dto;

import com.example.PBL3.model.status.UserRole;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private List<UserRole> roles;
}
