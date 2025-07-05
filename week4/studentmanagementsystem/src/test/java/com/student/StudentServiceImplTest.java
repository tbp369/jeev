package com.student;

import com.student.model.Student;
import com.student.service.StudentService;
import com.student.service.StudentServiceImpl;
import org.junit.jupiter.api.*;

import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class StudentServiceImplTest {

    private static StudentService service;

    @BeforeAll
    public static void setup() {
        service = new StudentServiceImpl();
    }

    @Test
    @Order(1)
    public void testAddStudent() {
        Student student = new Student(101, "John Doe", "john@example.com", "Math", "A+");
        service.addStudent(student);
        List<Student> students = service.getAllStudents();
        Assertions.assertTrue(students.stream().anyMatch(s -> s.getId() == 101));
    }

    @Test
    @Order(2)
    public void testUpdateStudent() {
        Student updatedStudent = new Student(101, "John Smith", "johnsmith@example.com", "Science", "A");
        service.updateStudent(updatedStudent);
        List<Student> students = service.getAllStudents();
        Assertions.assertTrue(students.stream().anyMatch(s -> s.getName().equals("John Smith")));
    }

    @Test
    @Order(3)
    public void testDeleteStudent() {
        service.deleteStudent(101);
        List<Student> students = service.getAllStudents();
        Assertions.assertFalse(students.stream().anyMatch(s -> s.getId() == 101));
    }
}
