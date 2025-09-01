package com.dms.auth.controller;

import com.dms.auth.dto.AuthResponse;
import com.dms.auth.dto.LoginRequest;
import com.dms.auth.dto.RegisterRequest;
import com.dms.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Invalid authorization header");
            }

            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);

            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", authService.getUsernameFromToken(token));
                response.put("role", authService.getRoleFromToken(token));
                response.put("userId", authService.getUserIdFromToken(token));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid token");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token validation failed");
        }
    }
}

