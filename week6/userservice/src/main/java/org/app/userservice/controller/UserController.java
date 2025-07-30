package org.app.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.userservice.dto.AuthRequest;
import org.app.userservice.dto.AuthResponse;
import org.app.userservice.dto.RegisterRequest;
import org.app.userservice.model.User;
import org.app.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling user registration, login, and profile access.
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for: {}", request.getUsername());
        return ResponseEntity.ok(userService.register(request));
    }

    /**
     * Login and receive a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        return ResponseEntity.ok(userService.authenticate(request));
    }

    /**
     * Get profile details of the authenticated user.
     */
    @GetMapping("/profile")
    public ResponseEntity<User> profile(Authentication authentication) {
        String username = authentication.getName();
        log.info("Fetching profile for: {}", username);
        return ResponseEntity.ok(userService.getProfile(username));
    }
}
