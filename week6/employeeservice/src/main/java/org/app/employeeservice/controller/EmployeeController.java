package org.app.employeeservice.controller;

import org.app.employeeservice.model.Employee;
import org.app.employeeservice.service.EmployeeServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing employee-related endpoints.
 */
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeServiceImpl employeeService;

    /**
     * GET /employees : Get all employees.
     */
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    /**
     * GET /employees/{id} : Get employee by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    /**
     * POST /employees : Create a new employee.
     */
    @PostMapping
    public ResponseEntity<String> createEmployee(@Valid @RequestBody Employee employee) {
        employeeService.createEmployee(employee);
        return ResponseEntity.ok("Employee created successfully.");
    }

    /**
     * PUT /employees/{id} : Update existing employee.
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok("Employee updated successfully.");
    }

    /**
     * DELETE /employees/{id} : Delete employee by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }
}
