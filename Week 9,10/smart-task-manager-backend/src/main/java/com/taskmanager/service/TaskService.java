package com.taskmanager.service;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.dto.response.UserResponse;
import com.taskmanager.entity.*;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    public TaskResponse createTask(TaskRequest taskRequest, User createdBy) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setPriority(taskRequest.getPriority());
        task.setStatus(TaskStatus.TODO);
        task.setCreatedBy(createdBy);
        
        // Set tags
        if (taskRequest.getTags() != null) {
            task.setTags(taskRequest.getTags());
        }
        
        // Set assignees
        if (taskRequest.getAssigneeIds() != null && !taskRequest.getAssigneeIds().isEmpty()) {
            Set<User> assignees = new HashSet<>();
            for (Long assigneeId : taskRequest.getAssigneeIds()) {
                User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + assigneeId));
                assignees.add(assignee);
            }
            task.setAssignees(assignees);
        }
        
        Task savedTask = taskRepository.save(task);
        
        // Send notifications to assignees
        for (User assignee : savedTask.getAssignees()) {
            emailService.sendTaskAssignmentNotification(assignee, savedTask, createdBy);
        }
        
        // Log activity
        activityLogService.logActivity(createdBy, "TASK_CREATED", 
            "Created task: " + savedTask.getTitle(), "Task", savedTask.getId(), null);
        
        return convertToTaskResponse(savedTask);
    }
    
    public TaskResponse updateTask(Long taskId, TaskRequest taskRequest, User currentUser) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Check permissions
        if (!canUserModifyTask(currentUser, task)) {
            throw new RuntimeException("You don't have permission to modify this task");
        }
        
        String oldStatus = task.getStatus().name();
        
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setPriority(taskRequest.getPriority());
        
        // Update status if provided
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        
        // Update tags
        if (taskRequest.getTags() != null) {
            task.setTags(taskRequest.getTags());
        }
        
        // Update assignees (only managers and admins can do this)
        if (taskRequest.getAssigneeIds() != null && 
            (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.MANAGER)) {
            Set<User> newAssignees = new HashSet<>();
            for (Long assigneeId : taskRequest.getAssigneeIds()) {
                User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + assigneeId));
                newAssignees.add(assignee);
            }
            
            // Send notifications to newly assigned users
            Set<User> oldAssignees = new HashSet<>(task.getAssignees());
            task.setAssignees(newAssignees);
            
            for (User assignee : newAssignees) {
                if (!oldAssignees.contains(assignee)) {
                    emailService.sendTaskAssignmentNotification(assignee, task, currentUser);
                }
            }
        }
        
        Task updatedTask = taskRepository.save(task);
        
        // Log activity
        String statusChange = !oldStatus.equals(updatedTask.getStatus().name()) ? 
            String.format(" (Status changed from %s to %s)", oldStatus, updatedTask.getStatus().name()) : "";
        
        activityLogService.logActivity(currentUser, "TASK_UPDATED", 
            "Updated task: " + updatedTask.getTitle() + statusChange, "Task", updatedTask.getId(), null);
        
        return convertToTaskResponse(updatedTask);
    }
    
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus newStatus, User currentUser) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Check permissions
        if (!canUserModifyTask(currentUser, task)) {
            throw new RuntimeException("You don't have permission to modify this task");
        }
        
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);
        
        // Log activity
        activityLogService.logActivity(currentUser, "TASK_STATUS_UPDATED", 
            String.format("Task status changed from %s to %s for task: %s", 
                oldStatus.getDisplayName(), newStatus.getDisplayName(), task.getTitle()), 
            "Task", task.getId(), null);
        
        return convertToTaskResponse(updatedTask);
    }
    
    public void deleteTask(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Only creators, managers, and admins can delete tasks
        if (!canUserDeleteTask(currentUser, task)) {
            throw new RuntimeException("You don't have permission to delete this task");
        }
        
        taskRepository.delete(task);
        
        // Log activity
        activityLogService.logActivity(currentUser, "TASK_DELETED", 
            "Deleted task: " + task.getTitle(), "Task", task.getId(), null);
    }
    
    public Optional<TaskResponse> getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
            .map(this::convertToTaskResponse);
    }
    
    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
            .map(this::convertToTaskResponse);
    }
    
    public Page<TaskResponse> getTasksByAssignee(Long assigneeId, Pageable pageable) {
        return taskRepository.findByAssigneeId(assigneeId, pageable)
            .map(this::convertToTaskResponse);
    }
    
    public Page<TaskResponse> getTasksByCreator(Long creatorId, Pageable pageable) {
        return taskRepository.findByCreatedById(creatorId, pageable)
            .map(this::convertToTaskResponse);
    }
    
    public Page<TaskResponse> getTasksWithFilters(Long assigneeId, TaskStatus status, Priority priority,
                                                 LocalDateTime fromDate, LocalDateTime toDate, 
                                                 String search, Pageable pageable) {
        return taskRepository.findTasksWithFilters(assigneeId, status, priority, fromDate, toDate, search, pageable)
            .map(this::convertToTaskResponse);
    }
    
    public List<TaskResponse> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDateTime.now())
            .stream()
            .map(this::convertToTaskResponse)
            .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getUpcomingTasks(int hours) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureTime = now.plusHours(hours);
        return taskRepository.findTasksDueWithin(now, futureTime)
            .stream()
            .map(this::convertToTaskResponse)
            .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getUserUpcomingTasks(Long userId, int hours) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureTime = now.plusHours(hours);
        return taskRepository.findUpcomingTasksForUser(userId, now, futureTime)
            .stream()
            .map(this::convertToTaskResponse)
            .collect(Collectors.toList());
    }
    
    private boolean canUserModifyTask(User user, Task task) {
        // Admins and managers can modify any task
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER) {
            return true;
        }
        
        // Employees can only modify tasks assigned to them
        return task.getAssignees().contains(user);
    }
    
    private boolean canUserDeleteTask(User user, Task task) {
        // Admins can delete any task
        if (user.getRole() == Role.ADMIN) {
            return true;
        }
        
        // Managers can delete any task
        if (user.getRole() == Role.MANAGER) {
            return true;
        }
        
        // Task creators can delete their own tasks
        return task.getCreatedBy().equals(user);
    }
    
    private TaskResponse convertToTaskResponse(Task task) {
        UserResponse createdBy = convertToUserResponse(task.getCreatedBy());
        Set<UserResponse> assignees = task.getAssignees().stream()
            .map(this::convertToUserResponse)
            .collect(Collectors.toSet());
        
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getDueDate(),
            task.getPriority(),
            task.getStatus(),
            task.getTags(),
            createdBy,
            assignees,
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getCompletedAt()
        );
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

