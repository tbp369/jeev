package org.app.employeeservice.repository;

import org.app.employeeservice.model.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {
    List<Employee> findAll();
    Optional<Employee> findById(Long id);
    void save(Employee employee);
    void update(Long id, Employee employee);
    void delete(Long id);
}
