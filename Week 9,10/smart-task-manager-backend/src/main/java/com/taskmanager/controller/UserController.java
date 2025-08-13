package com.taskmanager.controller;

import com.taskmanager.dto.response.UserResponse;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "User management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        Optional<UserResponse> user = userService.getUserById(currentUser.getId());
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    @Operation(summary = "Get all users with pagination")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserResponse> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userService.searchUsers(search, pageable);
        } else {
            users = userService.getAllUsers(pageable);
        }
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<UserResponse> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-role/{role}")
    @Operation(summary = "Get users by role")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable Role role) {
        List<UserResponse> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/employees")
    @Operation(summary = "Get all employees")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserResponse>> getEmployees() {
        List<UserResponse> employees = userService.getUsersByRole(Role.EMPLOYEE);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/managers")
    @Operation(summary = "Get all managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getManagers() {
        List<UserResponse> managers = userService.getUsersByRole(Role.MANAGER);
        return ResponseEntity.ok(managers);
    }
    
    @PutMapping("/{id}/role")
    @Operation(summary = "Update user role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                           @RequestParam Role role,
                                           @AuthenticationPrincipal User currentUser) {
        try {
            UserResponse user = userService.updateUserRole(id, role, currentUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id,
                                           @AuthenticationPrincipal User currentUser) {
        try {
            userService.deactivateUser(id, currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deactivated successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long id,
                                         @AuthenticationPrincipal User currentUser) {
        try {
            userService.activateUser(id, currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User activated successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/me/notifications")
    @Operation(summary = "Update notification settings")
    public ResponseEntity<?> updateNotificationSettings(
            @RequestParam boolean enabled,
            @AuthenticationPrincipal User currentUser) {
        try {
            UserResponse user = userService.updateNotificationSettings(currentUser.getId(), enabled);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}

