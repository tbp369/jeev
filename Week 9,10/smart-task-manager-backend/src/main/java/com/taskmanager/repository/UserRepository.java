package com.taskmanager.repository;

import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailVerificationToken(String token);
    
    Optional<User> findByPasswordResetToken(String token);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByRoleAndActiveTrue(Role role);
    
    Page<User> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.active = true AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findActiveUsersBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.passwordResetToken IS NOT NULL AND u.passwordResetTokenExpiry < :now")
    List<User> findUsersWithExpiredPasswordResetTokens(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.active = true")
    long countByRoleAndActiveTrue(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.role IN :roles AND u.active = true")
    List<User> findByRoleInAndActiveTrue(@Param("roles") List<Role> roles);
}

