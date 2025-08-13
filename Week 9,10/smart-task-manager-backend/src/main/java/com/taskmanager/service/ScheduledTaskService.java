package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ScheduledTaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTaskService.class);
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Send daily reminders at 9:00 AM every day
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyTaskReminders() {
        logger.info("Starting daily task reminder job");
        
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime tomorrow = now.plusDays(1);
            
            // Get tasks due within 24 hours
            List<Task> upcomingTasks = taskRepository.findTasksDueWithin(now, tomorrow);
            
            // Get overdue tasks
            List<Task> overdueTasks = taskRepository.findOverdueTasks(now);
            
            // Send reminders for upcoming tasks
            if (!upcomingTasks.isEmpty()) {
                emailService.sendTaskReminderNotifications(upcomingTasks);
                logger.info("Sent reminders for {} upcoming tasks", upcomingTasks.size());
            }
            
            // Send reminders for overdue tasks
            if (!overdueTasks.isEmpty()) {
                emailService.sendTaskReminderNotifications(overdueTasks);
                logger.info("Sent reminders for {} overdue tasks", overdueTasks.size());
            }
            
            logger.info("Daily task reminder job completed successfully");
        } catch (Exception e) {
            logger.error("Error in daily task reminder job", e);
        }
    }
    
    // Clean up expired password reset tokens every hour
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredTokens() {
        logger.info("Starting expired token cleanup job");
        
        try {
            LocalDateTime now = LocalDateTime.now();
            List<User> usersWithExpiredTokens = userRepository.findUsersWithExpiredPasswordResetTokens(now);
            
            for (User user : usersWithExpiredTokens) {
                user.setPasswordResetToken(null);
                user.setPasswordResetTokenExpiry(null);
                userRepository.save(user);
            }
            
            if (!usersWithExpiredTokens.isEmpty()) {
                logger.info("Cleaned up expired tokens for {} users", usersWithExpiredTokens.size());
            }
            
            logger.info("Expired token cleanup job completed successfully");
        } catch (Exception e) {
            logger.error("Error in expired token cleanup job", e);
        }
    }
    
    // Send weekly summary every Monday at 8:00 AM
    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklySummary() {
        logger.info("Starting weekly summary job");
        
        try {
            // This could be expanded to send weekly productivity reports
            // For now, just log that the job ran
            logger.info("Weekly summary job completed successfully");
        } catch (Exception e) {
            logger.error("Error in weekly summary job", e);
        }
    }
}

