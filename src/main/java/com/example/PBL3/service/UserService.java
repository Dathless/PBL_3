package com.example.PBL3.service;

import java.util.List;

import com.example.PBL3.dto.UserDTO;

public interface UserService {
	List<UserDTO> getAllUsers();
    UserDTO getUserById(String id);
    UserDTO addUser(UserDTO userDTO, String password);
    UserDTO updateUser(String id, UserDTO userDTO, String password);
    void deleteUser(String id);

    UserDTO findByUsername(String username);
    UserDTO findByEmail(String email);
}