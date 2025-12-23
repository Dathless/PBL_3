package com.example.PBL3.controller;

import com.example.PBL3.dto.request.ProductApprovalRequest;
import com.example.PBL3.model.User;
import com.example.PBL3.repository.UserRepository;
import com.example.PBL3.service.ProductApprovalService;
import com.example.PBL3.util.PassEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;

//@RestController
//@RequestMapping("/api/admin")
//@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductApprovalService productApprovalService;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminController.class);

    public AdminController(UserRepository userRepository, ProductApprovalService productApprovalService) {
        this.userRepository = userRepository;
        this.productApprovalService = productApprovalService;
    }

    /**
     * Reset password cho admin user cụ thể
     * Endpoint này chỉ để setup ban đầu, nên được bảo vệ hoặc xóa sau khi dùng
     */
    @PostMapping("/reset-admin-password")
    public ResponseEntity<?> resetAdminPassword(
            @RequestParam(defaultValue = "admin01") String username,
            @RequestParam(defaultValue = "Admin@123") String newPassword) {
        
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Hash password mới
            String hashedPassword = PassEncoder.encode(newPassword);
            user.setPassword(hashedPassword);
            user.setEnabled(true);
            
            userRepository.save(user);
            
            log.info("Password reset successfully for user: {}", username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error resetting password: ", e);
            log.error("Error resetting admin password", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
