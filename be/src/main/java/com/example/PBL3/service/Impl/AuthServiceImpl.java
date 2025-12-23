package com.example.PBL3.service.Impl;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PBL3.dto.LoginDTO;
import com.example.PBL3.dto.LoginResponse;
import com.example.PBL3.exception.UserNotFoundException;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.AuthService;
import com.example.PBL3.util.JwtUtil;
import com.example.PBL3.util.PassEncoder;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
//    private final HttpSession session;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponse login(LoginDTO dto, HttpServletResponse response){

        LoginResponse loginResponse = new LoginResponse();

        if (!userRepository.existsByUsername(dto.getUsername())) {
            throw new UsernameNotFoundException("Username not found");
        }
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Username not found"));

        if (!PassEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String role = user.getRole().name();
        String fullname = user.getFullname();
        String token = jwtUtil.generateToken(user.getUsername(), role);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day
        response.addCookie(cookie);

        loginResponse.setUsername(user.getUsername());
        loginResponse.setRole(role);
        loginResponse.setFullname(fullname);
        loginResponse.setToken(token);

        return loginResponse;

    }

    @Override
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Xóa cookie
        response.addCookie(cookie);
    }
}
