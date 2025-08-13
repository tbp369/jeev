package com.taskmanager.service;

import com.taskmanager.entity.ActivityLog;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class ActivityLogService {
    
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @Async
    public void logActivity(User user, String action, String description, String entityType, Long entityId, String ipAddress) {
        ActivityLog log = new ActivityLog(user, action, description, entityType, entityId, ipAddress);
        activityLogRepository.save(log);
    }
    
    public Page<ActivityLog> getAllActivityLogs(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    public Page<ActivityLog> getUserActivityLogs(Long userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    public Page<ActivityLog> getActivityLogsByDateRange(LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        return activityLogRepository.findByDateRange(fromDate, toDate, pageable);
    }
    
    public Page<ActivityLog> getActivityLogsWithFilters(Long userId, String action, String entityType, 
                                                       LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        return activityLogRepository.findWithFilters(userId, action, entityType, fromDate, toDate, pageable);
    }
    
    public long getUserActivityCount(Long userId, LocalDateTime fromDate) {
        return activityLogRepository.countUserActivitiesSince(userId, fromDate);
    }
}

