package com.example.PBL3.service;

import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.model.status.UserRole;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);
    UserDTO getUserById(UUID id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(UUID id, UserDTO userDTO);
    void deleteUser(UUID id);
    List<UserDTO> getUsersByUsername(String username);
    UserDTO getUserByEmail(String email);
    UserDTO getUserByPhone(String phone);
}