package com.example.PBL3.model;

import com.example.PBL3.model.status.UserRole;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(length = 20, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true, length = 255)
    private String username;

    @Column(nullable = false, length = 45)
    private String password;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 127)
    private String address;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('ADMIN','SELLER','CUSTOMER') DEFAULT 'CUSTOMER'")
    private UserRole role = UserRole.CUSTOMER;

    // ----- Constructors -----
    public User() {
    }

    public User(String id, String username, String password, String email,
                String address, String phone, boolean enabled, UserRole role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.enabled = enabled;
        this.role = role;
    }

    // ----- Getters & Setters -----
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}