package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    @Async
    public void sendVerificationEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Email Verification - Smart Task Manager");
            
            String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + user.getEmailVerificationToken();
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Thank you for registering with Smart Task Manager!\n\n" +
                "Please click the following link to verify your email address:\n" +
                "%s\n\n" +
                "If you didn't create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Smart Task Manager Team",
                user.getFullName(), verificationUrl
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", user.getEmail(), e);
        }
    }
    
    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Password Reset - Smart Task Manager");
            
            String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password for Smart Task Manager.\n\n" +
                "Please click the following link to reset your password:\n" +
                "%s\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Smart Task Manager Team",
                user.getFullName(), resetUrl
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }
    
    @Async
    public void sendTaskAssignmentNotification(User assignee, Task task, User assignedBy) {
        if (!assignee.isNotificationsEnabled()) {
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(assignee.getEmail());
            message.setSubject("New Task Assigned - " + task.getTitle());
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm");
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "You have been assigned a new task:\n\n" +
                "Task: %s\n" +
                "Description: %s\n" +
                "Priority: %s\n" +
                "Due Date: %s\n" +
                "Assigned by: %s\n\n" +
                "Please log in to the Smart Task Manager to view more details and update the task status.\n\n" +
                "Best regards,\n" +
                "Smart Task Manager Team",
                assignee.getFullName(),
                task.getTitle(),
                task.getDescription() != null ? task.getDescription() : "No description provided",
                task.getPriority().getDisplayName(),
                task.getDueDate().format(formatter),
                assignedBy.getFullName()
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Task assignment notification sent to: {}", assignee.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send task assignment notification to: {}", assignee.getEmail(), e);
        }
    }
    
    @Async
    public void sendTaskReminderNotifications(List<Task> tasks) {
        for (Task task : tasks) {
            for (User assignee : task.getAssignees()) {
                if (assignee.isNotificationsEnabled()) {
                    sendTaskReminderNotification(assignee, task);
                }
            }
        }
    }
    
    private void sendTaskReminderNotification(User assignee, Task task) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(assignee.getEmail());
            
            boolean isOverdue = task.isOverdue();
            message.setSubject((isOverdue ? "Overdue Task: " : "Task Reminder: ") + task.getTitle());
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm");
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "This is a reminder about your %s task:\n\n" +
                "Task: %s\n" +
                "Description: %s\n" +
                "Priority: %s\n" +
                "Due Date: %s\n" +
                "Status: %s\n\n" +
                "Please log in to the Smart Task Manager to update the task status.\n\n" +
                "Best regards,\n" +
                "Smart Task Manager Team",
                assignee.getFullName(),
                isOverdue ? "overdue" : "upcoming",
                task.getTitle(),
                task.getDescription() != null ? task.getDescription() : "No description provided",
                task.getPriority().getDisplayName(),
                task.getDueDate().format(formatter),
                task.getStatus().getDisplayName()
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Task reminder notification sent to: {}", assignee.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send task reminder notification to: {}", assignee.getEmail(), e);
        }
    }
}

