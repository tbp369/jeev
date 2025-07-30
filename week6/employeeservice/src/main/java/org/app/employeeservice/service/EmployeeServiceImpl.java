package org.app.employeeservice.service;

import org.app.employeeservice.exception.EmployeeNotFoundException;
import org.app.employeeservice.model.Employee;
import org.app.employeeservice.repository.EmployeeRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class that handles business logic for Employee operations.
 */
@Service
public class EmployeeServiceImpl {

    @Autowired
    private EmployeeRepositoryImpl employeeRepository;

    /**
     * Retrieve all employees from the database.
     * @return List of employees.
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Retrieve a specific employee by ID.
     * @param id ID of the employee.
     * @return Employee object if found.
     * @throws EmployeeNotFoundException if employee is not found.
     */
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with ID: " + id));
    }

    /**
     * Create a new employee.
     * @param employee Employee to be created.
     */
    public void createEmployee(Employee employee) {
        employeeRepository.save(employee);
    }

    /**
     * Update an existing employee.
     * @param id ID of the employee to update.
     * @param employee Updated employee object.
     * @throws EmployeeNotFoundException if the employee is not found.
     */
    public void updateEmployee(Long id, Employee employee) {
        if (!employeeRepository.findById(id).isPresent()) {
            throw new EmployeeNotFoundException("Cannot update. Employee not found with ID: " + id);
        }
        employeeRepository.update(id, employee);
    }

    /**
     * Delete an employee by ID.
     * @param id ID of the employee to delete.
     * @throws EmployeeNotFoundException if the employee is not found.
     */
    public void deleteEmployee(Long id) {
        if (!employeeRepository.findById(id).isPresent()) {
            throw new EmployeeNotFoundException("Cannot delete. Employee not found with ID: " + id);
        }
        employeeRepository.delete(id);
    }
}
