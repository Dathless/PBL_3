package com.example.PBL3.controller;

import org.springframework.web.bind.annotation.*;

import com.example.PBL3.dto.UserDTO;
import com.example.PBL3.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET user by id
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    // POST add user
    @PostMapping
    public UserDTO addUser(@RequestBody UserDTO userDTO, @RequestParam String password) {
        return userService.addUser(userDTO, password);
    }

    // PUT update user
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable String id,
                              @RequestBody UserDTO userDTO,
                              @RequestParam(required = false) String password) {
        return userService.updateUser(id, userDTO, password);
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    // GET user by username
    @GetMapping("/find/by-username")
    public UserDTO findByUsername(@RequestParam String username) {
        return userService.findByUsername(username);
    }

    // GET user by email
    @GetMapping("/find/by-email")
    public UserDTO findByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }
}