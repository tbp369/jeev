package com.taskmanager.controller;

import com.taskmanager.entity.ActivityLog;
import com.taskmanager.entity.User;
import com.taskmanager.service.ActivityLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/activity-logs")
@Tag(name = "Activity Logs", description = "Activity log and audit trail APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActivityLogController {
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @GetMapping
    @Operation(summary = "Get all activity logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ActivityLog>> getAllActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs;
        if (userId != null || action != null || entityType != null || fromDate != null || toDate != null) {
            logs = activityLogService.getActivityLogsWithFilters(userId, action, entityType, fromDate, toDate, pageable);
        } else {
            logs = activityLogService.getAllActivityLogs(pageable);
        }
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get activity logs for specific user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<ActivityLog>> getUserActivityLogs(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getUserActivityLogs(userId, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/my-activities")
    @Operation(summary = "Get activity logs for current user")
    public ResponseEntity<Page<ActivityLog>> getMyActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getUserActivityLogs(currentUser.getId(), pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Get activity logs within date range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<ActivityLog>> getActivityLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getActivityLogsByDateRange(fromDate, toDate, pageable);
        
        return ResponseEntity.ok(logs);
    }
}

