package com.student.data.service;

import com.student.data.exception.ResourceNotFoundException;
import com.student.data.model.Student;
import com.student.data.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public Student addStudent(Student student) {
        log.info("Adding new student: {}", student);
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        log.info("Fetching all students");
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        log.info("Fetching student with ID: {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Override
    public Student updateStudent(Long id, Student updatedStudent) {
        log.info("Updating student with ID: {}", id);
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        existingStudent.setName(updatedStudent.getName());
        existingStudent.setAge(updatedStudent.getAge());
        existingStudent.setGrade(updatedStudent.getGrade());
        existingStudent.setAddress(updatedStudent.getAddress());

        return studentRepository.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        log.info("Deleting student with ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }
}
