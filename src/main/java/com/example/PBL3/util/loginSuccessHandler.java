package com.example.PBL3.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class loginSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
        throws IOException, ServletException {
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_CUSTOMER");
        if  (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        String token  = jwtUtil.generateToken(username, role);

        Cookie Jwtcookie = new Cookie("token", token);
        Jwtcookie.setPath("/");
        Jwtcookie.setHttpOnly(true);
        Jwtcookie.setMaxAge(86400);

        Cookie Ucookie = new Cookie("token", token);
        Ucookie.setPath("/");
        Ucookie.setHttpOnly(true);
        Ucookie.setMaxAge(86400);

        Cookie Rcookie = new Cookie("token", token);
        Rcookie.setPath("/");
        Rcookie.setHttpOnly(true);
        Rcookie.setMaxAge(86400);

        response.addCookie(Jwtcookie);
        response.addCookie(Ucookie);
        response.addCookie(Rcookie);

        response.sendRedirect("/");

    }
}
