package com.example.PBL3.controller;

import com.example.PBL3.dto.LoginDTO;
import com.example.PBL3.dto.LoginResponse;
import com.example.PBL3.exception.UserNotFoundException;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.AuthService;
import com.example.PBL3.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.*;

import java.security.Principal;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(loginDTO, response));
    }

    @GetMapping("/currentUser")
    public ResponseEntity<?>  getCurrentUser(
            @CookieValue(name = "token", required = false) String token
    ) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "token is null"));
        }

        try {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "Id", user.getId(),
                    "username", user.getUsername(),
                    "role", role
            ));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }
}
