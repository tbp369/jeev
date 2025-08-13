package com.taskmanager.controller;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.entity.Priority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Task management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @PostMapping
    @Operation(summary = "Create a new task")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> createTask(@Valid @RequestBody TaskRequest taskRequest,
                                       @AuthenticationPrincipal User currentUser) {
        try {
            TaskResponse task = taskService.createTask(taskRequest, currentUser);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all tasks with pagination and filtering")
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TaskResponse> tasks = taskService.getTasksWithFilters(
            assigneeId, status, priority, fromDate, toDate, search, pageable);
        
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<TaskResponse> task = taskService.getTaskById(id);
        
        if (task.isPresent()) {
            return ResponseEntity.ok(task.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                       @Valid @RequestBody TaskRequest taskRequest,
                                       @AuthenticationPrincipal User currentUser) {
        try {
            TaskResponse task = taskService.updateTask(id, taskRequest, currentUser);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id,
                                             @RequestParam TaskStatus status,
                                             @AuthenticationPrincipal User currentUser) {
        try {
            TaskResponse task = taskService.updateTaskStatus(id, status, currentUser);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<?> deleteTask(@PathVariable Long id,
                                       @AuthenticationPrincipal User currentUser) {
        try {
            taskService.deleteTask(id, currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Task deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/my-tasks")
    @Operation(summary = "Get tasks assigned to current user")
    public ResponseEntity<Page<TaskResponse>> getMyTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TaskResponse> tasks = taskService.getTasksByAssignee(currentUser.getId(), pageable);
        
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/created-by-me")
    @Operation(summary = "Get tasks created by current user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<TaskResponse>> getTasksCreatedByMe(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TaskResponse> tasks = taskService.getTasksByCreator(currentUser.getId(), pageable);
        
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue tasks")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks() {
        List<TaskResponse> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming tasks")
    public ResponseEntity<List<TaskResponse>> getUpcomingTasks(
            @RequestParam(defaultValue = "24") int hours,
            @AuthenticationPrincipal User currentUser) {
        
        List<TaskResponse> tasks = taskService.getUserUpcomingTasks(currentUser.getId(), hours);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tasks assigned to specific user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<TaskResponse>> getTasksByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TaskResponse> tasks = taskService.getTasksByAssignee(userId, pageable);
        
        return ResponseEntity.ok(tasks);
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}

