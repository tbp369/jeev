package org.app.employeeservice.repository;

import org.app.employeeservice.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of EmployeeRepository using JdbcTemplate.
 */
@Repository
public class EmployeeRepositoryImpl {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieve all employees from the database.
     * @return List of Employee objects.
     */
    public List<Employee> findAll() {
        String sql = "SELECT * FROM employees";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Employee.class));
    }

    /**
     * Retrieve a specific employee by ID.
     * @param id Employee ID.
     * @return Optional containing the employee if found.
     */
    public Optional<Employee> findById(Long id) {
        String sql = "SELECT * FROM employees WHERE id = ?";
        List<Employee> employees = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Employee.class), id);
        return employees.stream().findFirst();
    }

    /**
     * Insert a new employee into the database.
     * @param employee Employee object to insert.
     */
    public void save(Employee employee) {
        String sql = "INSERT INTO employees (name, department, position, salary) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, employee.getName(), employee.getDepartment(), employee.getPosition(), employee.getSalary());
    }

    /**
     * Update an existing employee.
     * @param id ID of the employee to update.
     * @param employee Updated employee object.
     */
    public void update(Long id, Employee employee) {
        String sql = "UPDATE employees SET name = ?, department = ?, position = ?, salary = ? WHERE id = ?";
        jdbcTemplate.update(sql, employee.getName(), employee.getDepartment(), employee.getPosition(), employee.getSalary(), id);
    }

    /**
     * Delete an employee by ID.
     * @param id ID of the employee to delete.
     */
    public void delete(Long id) {
        String sql = "DELETE FROM employees WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
