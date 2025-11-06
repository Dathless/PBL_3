package com.example.PBL3.service.Impl;

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
import jakarta.servlet.http.HttpSession;
import lombok.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
//    private final HttpSession session;

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

//        String token = jwtUtil.generateToken(user.getUsername(), role);
//        Save info to session
//        session.setAttribute("user", user);
//        session.setAttribute("role", role);

//        Cookie jwtCookie = new Cookie("JWT", token);
//        jwtCookie.setPath("/");
//        jwtCookie.setHttpOnly(true);
//        jwtCookie.setSecure(true);
//        jwtCookie.setMaxAge(24 * 60 * 60);
//
//        Cookie usernameCookie = new Cookie("username", user.getUsername());
//        usernameCookie.setPath("/");
//        usernameCookie.setHttpOnly(true);
//        usernameCookie.setMaxAge(24 * 60 * 60);
//        usernameCookie.setSecure(true);
//
//        Cookie roleCookie = new Cookie("role", role);
//        roleCookie.setPath("/");
//        roleCookie.setHttpOnly(true);
//        roleCookie.setMaxAge(24 * 60 * 60);
//        roleCookie.setSecure(true);
//
        loginResponse.setUsername(user.getUsername());
        loginResponse.setRole(role);
//        loginResponse.setToken(token);
//
//        response.addCookie(jwtCookie);
//        response.addCookie(usernameCookie);
//        response.addCookie(roleCookie);

        return loginResponse;

    }
}
