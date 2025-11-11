package com.example.PBL3.service;

import com.example.PBL3.dto.LoginDTO;
import com.example.PBL3.dto.LoginResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    LoginResponse login(LoginDTO dto,  HttpServletResponse response);
    void logout(HttpServletResponse response);
//    String register(RegisterDTO dto);
}
