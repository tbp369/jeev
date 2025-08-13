package com.taskmanager.controller;

import com.taskmanager.dto.request.LoginRequest;
import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.JwtResponse;
import com.taskmanager.entity.User;
import com.taskmanager.security.JwtUtils;
import com.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Validate password confirmation
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password and confirm password do not match"));
            }
            
            User user = userService.createUser(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully! Please check your email to verify your account.");
            response.put("userId", user.getId());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest,
                                            HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            User user = (User) authentication.getPrincipal();
            
            if (!user.isEmailVerified()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Please verify your email address before logging in"));
            }
            
            JwtResponse jwtResponse = new JwtResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
            );
            
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Invalid email or password"));
        }
    }
    
    @GetMapping("/verify-email")
    @Operation(summary = "Verify user email address")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            boolean verified = userService.verifyEmail(token);
            
            if (verified) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email verified successfully! You can now log in.");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid or expired verification token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Email verification failed"));
        }
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            userService.initiatePasswordReset(email);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "If an account with that email exists, a password reset link has been sent.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Failed to process password reset request"));
        }
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                         @RequestParam String newPassword,
                                         @RequestParam String confirmPassword) {
        try {
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password and confirm password do not match"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password must be at least 6 characters long"));
            }
            
            boolean reset = userService.resetPassword(token, newPassword);
            
            if (reset) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Password reset successfully! You can now log in with your new password.");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid or expired reset token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Password reset failed"));
        }
    }
    
    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}

