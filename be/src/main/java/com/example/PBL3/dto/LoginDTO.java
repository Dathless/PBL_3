package com.example.PBL3.dto;

import com.example.PBL3.model.status.UserRole;
//import lombok.*;

//@Getter
//@Setter
public class LoginDTO {
    private String username;
    private String password;
    //private UserRole role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
