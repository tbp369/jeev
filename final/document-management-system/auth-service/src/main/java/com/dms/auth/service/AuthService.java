package com.dms.auth.service;

import com.dms.auth.dto.AuthResponse;
import com.dms.auth.dto.LoginRequest;
import com.dms.auth.dto.RegisterRequest;
import com.dms.auth.entity.User;
import com.dms.auth.repository.UserRepository;
import com.dms.auth.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtils.generateJwtToken(
                user.getUsername(), 
                user.getRole().name(), 
                user.getId()
        );

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail(),
                registerRequest.getRole()
        );

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateJwtToken(
                savedUser.getUsername(), 
                savedUser.getRole().name(), 
                savedUser.getId()
        );

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), 
                savedUser.getEmail(), savedUser.getRole());
    }

    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }

    public String getUsernameFromToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }

    public String getRoleFromToken(String token) {
        return jwtUtils.getRoleFromJwtToken(token);
    }

    public Long getUserIdFromToken(String token) {
        return jwtUtils.getUserIdFromJwtToken(token);
    }
}

