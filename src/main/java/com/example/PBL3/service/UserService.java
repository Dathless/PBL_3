package com.example.PBL3.service;

import com.example.PBL3.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);
    UserDTO getUserById(UUID id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(UUID id, UserDTO userDTO);
    void deleteUser(UUID id);
    UserDTO getUserByUsername(String username);
    UserDTO getUserByEmail(String email);
    UserDTO getUserByPhone(String phone);
}