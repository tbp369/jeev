package com.example.employeemgmt.config;

import com.example.employeemgmt.entity.Employee;
import com.example.employeemgmt.entity.User;
import com.example.employeemgmt.enums.Role;
import com.example.employeemgmt.repository.EmployeeRepository;
import com.example.employeemgmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeEmployees();
    }
    
    private void initializeUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@company.com");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user created: username=admin, password=admin123");
        }
        
        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@company.com");
            user.setFirstName("Regular");
            user.setLastName("User");
            user.setRole(Role.USER);
            userRepository.save(user);
            System.out.println("Regular user created: username=user, password=user123");
        }
        
        // Create additional test users
        if (!userRepository.existsByUsername("john.doe")) {
            User johnDoe = new User();
            johnDoe.setUsername("john.doe");
            johnDoe.setPassword(passwordEncoder.encode("password123"));
            johnDoe.setEmail("john.doe@company.com");
            johnDoe.setFirstName("John");
            johnDoe.setLastName("Doe");
            johnDoe.setRole(Role.USER);
            userRepository.save(johnDoe);
            System.out.println("Test user created: username=john.doe, password=password123");
        }
        
        if (!userRepository.existsByUsername("jane.smith")) {
            User janeSmith = new User();
            janeSmith.setUsername("jane.smith");
            janeSmith.setPassword(passwordEncoder.encode("password123"));
            janeSmith.setEmail("jane.smith@company.com");
            janeSmith.setFirstName("Jane");
            janeSmith.setLastName("Smith");
            janeSmith.setRole(Role.ADMIN);
            userRepository.save(janeSmith);
            System.out.println("Test admin created: username=jane.smith, password=password123");
        }
    }
    
    private void initializeEmployees() {
        // Create sample employees if not exists
        if (employeeRepository.count() == 0) {
            Employee emp1 = new Employee();
            emp1.setFirstName("Alice");
            emp1.setLastName("Johnson");
            emp1.setEmail("alice.johnson@company.com");
            emp1.setPhoneNumber("+1-555-0101");
            emp1.setDepartment("Engineering");
            emp1.setPosition("Senior Software Engineer");
            emp1.setSalary(new BigDecimal("95000.00"));
            emp1.setHireDate(LocalDate.of(2022, 3, 15));
            emp1.setActive(true);
            employeeRepository.save(emp1);
            
            Employee emp2 = new Employee();
            emp2.setFirstName("Bob");
            emp2.setLastName("Wilson");
            emp2.setEmail("bob.wilson@company.com");
            emp2.setPhoneNumber("+1-555-0102");
            emp2.setDepartment("Marketing");
            emp2.setPosition("Marketing Manager");
            emp2.setSalary(new BigDecimal("75000.00"));
            emp2.setHireDate(LocalDate.of(2021, 8, 20));
            emp2.setActive(true);
            employeeRepository.save(emp2);
            
            Employee emp3 = new Employee();
            emp3.setFirstName("Carol");
            emp3.setLastName("Davis");
            emp3.setEmail("carol.davis@company.com");
            emp3.setPhoneNumber("+1-555-0103");
            emp3.setDepartment("Human Resources");
            emp3.setPosition("HR Specialist");
            emp3.setSalary(new BigDecimal("60000.00"));
            emp3.setHireDate(LocalDate.of(2023, 1, 10));
            emp3.setActive(true);
            employeeRepository.save(emp3);
            
            Employee emp4 = new Employee();
            emp4.setFirstName("David");
            emp4.setLastName("Brown");
            emp4.setEmail("david.brown@company.com");
            emp4.setPhoneNumber("+1-555-0104");
            emp4.setDepartment("Engineering");
            emp4.setPosition("Junior Developer");
            emp4.setSalary(new BigDecimal("65000.00"));
            emp4.setHireDate(LocalDate.of(2023, 6, 1));
            emp4.setActive(true);
            employeeRepository.save(emp4);
            
            Employee emp5 = new Employee();
            emp5.setFirstName("Eva");
            emp5.setLastName("Martinez");
            emp5.setEmail("eva.martinez@company.com");
            emp5.setPhoneNumber("+1-555-0105");
            emp5.setDepartment("Finance");
            emp5.setPosition("Financial Analyst");
            emp5.setSalary(new BigDecimal("70000.00"));
            emp5.setHireDate(LocalDate.of(2022, 11, 5));
            emp5.setActive(false); // Inactive employee for testing
            employeeRepository.save(emp5);
            
            System.out.println("Sample employees created successfully");
        }
    }
}

