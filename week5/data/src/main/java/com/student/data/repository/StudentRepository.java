package com.student.data.repository;

import com.student.data.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // You can add custom query methods here if needed, e.g.:
    // List<Student> findByGrade(String grade);
}
