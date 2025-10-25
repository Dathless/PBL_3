package com.example.PBL3.service;

import com.example.PBL3.dto.JwtResponse;
import com.example.PBL3.dto.LoginDTO;
import com.example.PBL3.dto.RegisterDTO;

public interface AuthService {
    JwtResponse login(LoginDTO dto);
    String register(RegisterDTO dto);
}
