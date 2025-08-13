package com.taskmanager.service;

import com.taskmanager.entity.Role;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
    }
    
    private void initializeDefaultUsers() {
        logger.info("Initializing default users...");
        
        // Create Admin user
        if (!userRepository.existsByEmail("admin@taskmanager.com")) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@taskmanager.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEmailVerified(true);
            admin.setActive(true);
            userRepository.save(admin);
            logger.info("Created default admin user: admin@taskmanager.com");
        }
        
        // Create Manager user
        if (!userRepository.existsByEmail("manager@taskmanager.com")) {
            User manager = new User();
            manager.setFirstName("Project");
            manager.setLastName("Manager");
            manager.setEmail("manager@taskmanager.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole(Role.MANAGER);
            manager.setEmailVerified(true);
            manager.setActive(true);
            userRepository.save(manager);
            logger.info("Created default manager user: manager@taskmanager.com");
        }
        
        // Create Employee user
        if (!userRepository.existsByEmail("employee@taskmanager.com")) {
            User employee = new User();
            employee.setFirstName("Team");
            employee.setLastName("Employee");
            employee.setEmail("employee@taskmanager.com");
            employee.setPassword(passwordEncoder.encode("employee123"));
            employee.setRole(Role.EMPLOYEE);
            employee.setEmailVerified(true);
            employee.setActive(true);
            userRepository.save(employee);
            logger.info("Created default employee user: employee@taskmanager.com");
        }
        
        logger.info("Default users initialization completed.");
    }
}

