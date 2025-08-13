package com.taskmanager.dto.response;

import com.taskmanager.entity.Priority;
import com.taskmanager.entity.TaskStatus;
import java.time.LocalDateTime;
import java.util.Set;

public class TaskResponse {
    
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Priority priority;
    private TaskStatus status;
    private Set<String> tags;
    private UserResponse createdBy;
    private Set<UserResponse> assignees;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private boolean overdue;
    
    // Constructors
    public TaskResponse() {}
    
    public TaskResponse(Long id, String title, String description, LocalDateTime dueDate, 
                       Priority priority, TaskStatus status, Set<String> tags,
                       UserResponse createdBy, Set<UserResponse> assignees,
                       LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime completedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.tags = tags;
        this.createdBy = createdBy;
        this.assignees = assignees;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completedAt = completedAt;
        this.overdue = dueDate.isBefore(LocalDateTime.now()) && status != TaskStatus.COMPLETED;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public Priority getPriority() {
        return priority;
    }
    
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public Set<String> getTags() {
        return tags;
    }
    
    public void setTags(Set<String> tags) {
        this.tags = tags;
    }
    
    public UserResponse getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }
    
    public Set<UserResponse> getAssignees() {
        return assignees;
    }
    
    public void setAssignees(Set<UserResponse> assignees) {
        this.assignees = assignees;
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
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public boolean isOverdue() {
        return overdue;
    }
    
    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }
}

