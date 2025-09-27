package com.example.PBL3.util;

import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.model.User;

public class MapperUtil {

    public static UserDTO toDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAddress(),
                user.getPhone(),
                user.isEnabled(),
                user.getRole()
        );
    }

    public static User toEntity(UserDTO dto, String password) {
        if (dto == null) return null;
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setPassword(password); // password truyền riêng khi tạo User
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setEnabled(dto.isEnabled());
        user.setRole(dto.getRole());
        return user;
    }
}
