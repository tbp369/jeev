package com.student.service;

import com.student.dao.StudentDAO;
import com.student.dao.StudentDAOImpl;
import com.student.model.Student;

import java.util.List;

public class StudentServiceImpl implements StudentService {

    private final StudentDAO studentDAO;

    public StudentServiceImpl() {
        this.studentDAO = new StudentDAOImpl();
    }

    @Override
    public void addStudent(Student student) {
        studentDAO.addStudent(student);
    }

    @Override
    public Student getStudentById(int id) {
        return studentDAO.getStudentById(id);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentDAO.getAllStudents();
    }

    @Override
    public void updateStudent(Student student) {
        studentDAO.updateStudent(student);
    }

    @Override
    public void deleteStudent(int id) {
        studentDAO.deleteStudent(id);
    }
}
