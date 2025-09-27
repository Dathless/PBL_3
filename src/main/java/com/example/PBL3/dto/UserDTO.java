package com.example.PBL3.dto;

import com.example.PBL3.model.status.UserRole;

public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String address;
    private String phone;
    private boolean enabled;
    private UserRole role;

    public UserDTO() {}

    public UserDTO(String id, String username, String email, String address,
                   String phone, boolean enabled, UserRole role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.enabled = enabled;
        this.role = role;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

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
