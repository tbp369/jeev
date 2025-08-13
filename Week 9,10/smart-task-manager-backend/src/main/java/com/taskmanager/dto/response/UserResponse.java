package com.taskmanager.dto.response;

import com.taskmanager.entity.Role;
import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private boolean emailVerified;
    private boolean notificationsEnabled;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(Long id, String firstName, String lastName, String email, Role role, 
                       boolean emailVerified, boolean notificationsEnabled, boolean active,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.emailVerified = emailVerified;
        this.notificationsEnabled = notificationsEnabled;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public boolean isEmailVerified() {
        return emailVerified;
    }
    
    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }
    
    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}

