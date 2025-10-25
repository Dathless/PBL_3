package com.example.PBL3.repository;

import com.example.PBL3.model.User;

import java.util.UUID;

import com.example.PBL3.model.status.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    User findByUsername(String username);
    User findByEmail(String email);
    User findByPhone(String phone);
}
