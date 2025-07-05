package com.student.dao;

import com.student.model.Student;
import com.student.util.DBUtil;
import com.student.util.LoggerUtil;

import java.sql.*;
import java.util.*;
import java.util.logging.Logger;

public class StudentDAOImpl implements StudentDAO {

    private static final Logger logger = LoggerUtil.getLogger(StudentDAOImpl.class);

    @Override
    public void addStudent(Student student) {
        String sql = "INSERT INTO students (id, name, email, course, grade) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, student.getId());
            stmt.setString(2, student.getName());
            stmt.setString(3, student.getEmail());
            stmt.setString(4, student.getCourse());
            stmt.setString(5, student.getGrade());
            stmt.executeUpdate();

            logger.info("Student added successfully: ID = " + student.getId());

        } catch (SQLException e) {
            logger.severe("Error adding student (ID = " + student.getId() + "): " + e.getMessage());
        }
    }

    @Override
    public Student getStudentById(int id) {
        String sql = "SELECT * FROM students WHERE id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                logger.info("Student retrieved: ID = " + id);
                return new Student(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("course"),
                    rs.getString("grade")
                );
            } else {
                logger.warning("Student not found with ID = " + id);
            }

        } catch (SQLException e) {
            logger.severe("Error retrieving student by ID (" + id + "): " + e.getMessage());
        }

        return null;
    }

    @Override
    public List<Student> getAllStudents() {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM students";

        try (Connection conn = DBUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(new Student(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("course"),
                    rs.getString("grade")
                ));
            }

            logger.info("Retrieved all students. Count: " + list.size());

        } catch (SQLException e) {
            logger.severe("Error retrieving all students: " + e.getMessage());
        }

        return list;
    }

    @Override
    public void updateStudent(Student student) {
        String sql = "UPDATE students SET name=?, email=?, course=?, grade=? WHERE id=?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setString(3, student.getCourse());
            stmt.setString(4, student.getGrade());
            stmt.setInt(5, student.getId());
            int rows = stmt.executeUpdate();

            if (rows > 0) {
                logger.info("Student updated: ID = " + student.getId());
            } else {
                logger.warning("No student updated. ID may not exist: " + student.getId());
            }

        } catch (SQLException e) {
            logger.severe("Error updating student (ID = " + student.getId() + "): " + e.getMessage());
        }
    }

    @Override
    public void deleteStudent(int id) {
        String sql = "DELETE FROM students WHERE id=?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int rows = stmt.executeUpdate();

            if (rows > 0) {
                logger.info("Student deleted: ID = " + id);
            } else {
                logger.warning("No student deleted. ID may not exist: " + id);
            }

        } catch (SQLException e) {
            logger.severe("Error deleting student (ID = " + id + "): " + e.getMessage());
        }
    }
}
