package com.example.employeemgmt.controller;

import com.example.employeemgmt.config.JwtUtil;
import com.example.employeemgmt.dto.JwtResponse;
import com.example.employeemgmt.dto.LoginRequest;
import com.example.employeemgmt.dto.UserProfile;
import com.example.employeemgmt.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
 
  
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = (User) userDetails;
            
            String jwt = jwtUtil.generateToken(userDetails);
            
            return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername(), user.getEmail(), user.getRole()));
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                .body("Error: Invalid username or password!");
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        UserProfile userProfile = new UserProfile(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole()
        );
        
        return ResponseEntity.ok(userProfile);
    }
}

