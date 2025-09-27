package com.example.PBL3.service.Impl;

import org.springframework.stereotype.Service;

import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.exception.UserNotFoundException;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.UserService;
import com.example.PBL3.util.MapperUtil;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(MapperUtil::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO addUser(UserDTO userDTO, String password) {
    	User user = MapperUtil.toEntity(userDTO, password);
    	User saved = userRepository.save(user);
    	return MapperUtil.toDTO(saved);
    }

    @Override
    public UserDTO getUserById(String id) {
        return userRepository.findById(id)
                .map(MapperUtil::toDTO)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
    }

    @Override
    public UserDTO updateUser(String id, UserDTO userDTO, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setEnabled(userDTO.isEnabled());
        user.setRole(userDTO.getRole());
        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
        }

        User updated = userRepository.save(user);
        return MapperUtil.toDTO(updated);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(MapperUtil::toDTO)
                .orElseThrow(() -> new UserNotFoundException("User with username " + username + " not found"));
    }

    @Override
    public UserDTO findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(MapperUtil::toDTO)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
    }
}
