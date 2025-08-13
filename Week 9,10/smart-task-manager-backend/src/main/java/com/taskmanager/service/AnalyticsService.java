package com.taskmanager.service;

import com.taskmanager.entity.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> getDashboardStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Task counts by status for the user
        long todoCount = taskRepository.countByAssigneeIdAndStatus(userId, TaskStatus.TODO);
        long inProgressCount = taskRepository.countByAssigneeIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        long blockedCount = taskRepository.countByAssigneeIdAndStatus(userId, TaskStatus.BLOCKED);
        long completedCount = taskRepository.countByAssigneeIdAndStatus(userId, TaskStatus.COMPLETED);
        
        stats.put("todoTasks", todoCount);
        stats.put("inProgressTasks", inProgressCount);
        stats.put("blockedTasks", blockedCount);
        stats.put("completedTasks", completedCount);
        stats.put("totalTasks", todoCount + inProgressCount + blockedCount + completedCount);
        
        // Task distribution by status
        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("TODO", todoCount);
        statusDistribution.put("IN_PROGRESS", inProgressCount);
        statusDistribution.put("BLOCKED", blockedCount);
        statusDistribution.put("COMPLETED", completedCount);
        stats.put("statusDistribution", statusDistribution);
        
        return stats;
    }
    
    public Map<String, Object> getOverallStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Overall task counts by status
        long todoCount = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgressCount = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long blockedCount = taskRepository.countByStatus(TaskStatus.BLOCKED);
        long completedCount = taskRepository.countByStatus(TaskStatus.COMPLETED);
        
        stats.put("todoTasks", todoCount);
        stats.put("inProgressTasks", inProgressCount);
        stats.put("blockedTasks", blockedCount);
        stats.put("completedTasks", completedCount);
        stats.put("totalTasks", todoCount + inProgressCount + blockedCount + completedCount);
        
        // Task distribution by status
        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("TODO", todoCount);
        statusDistribution.put("IN_PROGRESS", inProgressCount);
        statusDistribution.put("BLOCKED", blockedCount);
        statusDistribution.put("COMPLETED", completedCount);
        stats.put("statusDistribution", statusDistribution);
        
        return stats;
    }
    
    public Map<String, Long> getTaskCountByStatus() {
        List<Object[]> results = taskRepository.getTaskCountByStatus();
        Map<String, Long> statusCounts = new HashMap<>();
        
        for (Object[] result : results) {
            TaskStatus status = (TaskStatus) result[0];
            Long count = (Long) result[1];
            statusCounts.put(status.name(), count);
        }
        
        return statusCounts;
    }
    
    public Map<String, Object> getCompletedTasksByUser() {
        List<Object[]> results = taskRepository.getCompletedTaskCountByUser();
        Map<String, Object> userStats = new HashMap<>();
        
        for (Object[] result : results) {
            Long userId = (Long) result[0];
            String firstName = (String) result[1];
            String lastName = (String) result[2];
            Long count = (Long) result[3];
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId);
            userInfo.put("name", firstName + " " + lastName);
            userInfo.put("completedTasks", count);
            
            userStats.put(userId.toString(), userInfo);
        }
        
        return userStats;
    }
    
    public Map<String, Object> getTotalTasksByUser() {
        List<Object[]> results = taskRepository.getTotalTaskCountByUser();
        Map<String, Object> userStats = new HashMap<>();
        
        for (Object[] result : results) {
            Long userId = (Long) result[0];
            String firstName = (String) result[1];
            String lastName = (String) result[2];
            Long count = (Long) result[3];
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId);
            userInfo.put("name", firstName + " " + lastName);
            userInfo.put("totalTasks", count);
            
            userStats.put(userId.toString(), userInfo);
        }
        
        return userStats;
    }
    
    public Map<String, Object> getProductivityMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Get completed vs total tasks by user
        Map<String, Object> completedByUser = getCompletedTasksByUser();
        Map<String, Object> totalByUser = getTotalTasksByUser();
        
        Map<String, Object> productivityByUser = new HashMap<>();
        
        for (String userId : totalByUser.keySet()) {
            Map<String, Object> totalInfo = (Map<String, Object>) totalByUser.get(userId);
            Map<String, Object> completedInfo = (Map<String, Object>) completedByUser.get(userId);
            
            Long totalTasks = (Long) totalInfo.get("totalTasks");
            Long completedTasks = completedInfo != null ? (Long) completedInfo.get("completedTasks") : 0L;
            
            double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;
            
            Map<String, Object> userProductivity = new HashMap<>();
            userProductivity.put("userId", totalInfo.get("userId"));
            userProductivity.put("name", totalInfo.get("name"));
            userProductivity.put("totalTasks", totalTasks);
            userProductivity.put("completedTasks", completedTasks);
            userProductivity.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
            
            productivityByUser.put(userId, userProductivity);
        }
        
        metrics.put("userProductivity", productivityByUser);
        
        return metrics;
    }
    
    public Map<String, Object> getWorkloadDistribution() {
        Map<String, Object> workload = new HashMap<>();
        
        // Get total tasks by user
        Map<String, Object> totalByUser = getTotalTasksByUser();
        
        // Calculate workload distribution
        long totalTasksOverall = totalByUser.values().stream()
            .mapToLong(userInfo -> (Long) ((Map<String, Object>) userInfo).get("totalTasks"))
            .sum();
        
        Map<String, Object> workloadByUser = new HashMap<>();
        
        for (String userId : totalByUser.keySet()) {
            Map<String, Object> userInfo = (Map<String, Object>) totalByUser.get(userId);
            Long userTasks = (Long) userInfo.get("totalTasks");
            
            double workloadPercentage = totalTasksOverall > 0 ? (double) userTasks / totalTasksOverall * 100 : 0.0;
            
            Map<String, Object> userWorkload = new HashMap<>();
            userWorkload.put("userId", userInfo.get("userId"));
            userWorkload.put("name", userInfo.get("name"));
            userWorkload.put("taskCount", userTasks);
            userWorkload.put("workloadPercentage", Math.round(workloadPercentage * 100.0) / 100.0);
            
            workloadByUser.put(userId, userWorkload);
        }
        
        workload.put("userWorkload", workloadByUser);
        workload.put("totalTasks", totalTasksOverall);
        
        return workload;
    }
}

