package com.taskmanager.service;

import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.UserResponse;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    public User createUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.EMPLOYEE); // Default role
        user.setEmailVerificationToken(UUID.randomUUID().toString());
        
        User savedUser = userRepository.save(user);
        
        // Send verification email
        emailService.sendVerificationEmail(savedUser);
        
        // Log activity
        activityLogService.logActivity(savedUser, "USER_REGISTERED", 
            "User registered with email: " + savedUser.getEmail(), "User", savedUser.getId(), null);
        
        return savedUser;
    }
    
    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            userRepository.save(user);
            
            activityLogService.logActivity(user, "EMAIL_VERIFIED", 
                "Email verified successfully", "User", user.getId(), null);
            
            return true;
        }
        return false;
    }
    
    public void initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String resetToken = UUID.randomUUID().toString();
            user.setPasswordResetToken(resetToken);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(24)); // 24 hours expiry
            userRepository.save(user);
            
            emailService.sendPasswordResetEmail(user, resetToken);
            
            activityLogService.logActivity(user, "PASSWORD_RESET_REQUESTED", 
                "Password reset requested", "User", user.getId(), null);
        }
    }
    
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByPasswordResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setPasswordResetToken(null);
                user.setPasswordResetTokenExpiry(null);
                userRepository.save(user);
                
                activityLogService.logActivity(user, "PASSWORD_RESET", 
                    "Password reset successfully", "User", user.getId(), null);
                
                return true;
            }
        }
        return false;
    }
    
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findByActiveTrue(pageable)
                .map(this::convertToUserResponse);
    }
    
    public Page<UserResponse> searchUsers(String search, Pageable pageable) {
        return userRepository.findActiveUsersBySearch(search, pageable)
                .map(this::convertToUserResponse);
    }
    
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .filter(User::isActive)
                .map(this::convertToUserResponse);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRoleAndActiveTrue(role)
                .stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    public UserResponse updateUserRole(Long userId, Role newRole, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Role oldRole = user.getRole();
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        activityLogService.logActivity(currentUser, "USER_ROLE_UPDATED", 
            String.format("User role changed from %s to %s for user: %s", 
                oldRole, newRole, user.getEmail()), "User", user.getId(), null);
        
        return convertToUserResponse(updatedUser);
    }
    
    public void deactivateUser(Long userId, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(false);
        userRepository.save(user);
        
        activityLogService.logActivity(currentUser, "USER_DEACTIVATED", 
            "User deactivated: " + user.getEmail(), "User", user.getId(), null);
    }
    
    public void activateUser(Long userId, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(true);
        userRepository.save(user);
        
        activityLogService.logActivity(currentUser, "USER_ACTIVATED", 
            "User activated: " + user.getEmail(), "User", user.getId(), null);
    }
    
    public UserResponse updateNotificationSettings(Long userId, boolean notificationsEnabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setNotificationsEnabled(notificationsEnabled);
        User updatedUser = userRepository.save(user);
        
        activityLogService.logActivity(user, "NOTIFICATION_SETTINGS_UPDATED", 
            "Notification settings updated to: " + notificationsEnabled, "User", user.getId(), null);
        
        return convertToUserResponse(updatedUser);
    }
    
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            user.isEmailVerified(),
            user.isNotificationsEnabled(),
            user.isActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}

