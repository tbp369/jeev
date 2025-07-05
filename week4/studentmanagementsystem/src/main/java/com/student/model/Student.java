package com.student.model;

public class Student {

    private int id; // now user-defined
    private String name;
    private String email;
    private String course;
    private String grade;

    // Default constructor
    public Student() {}

    // Constructor with ID (for insert and update)
    public Student(int id, String name, String email, String course, String grade) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.course = course;
        this.grade = grade;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    @Override
    public String toString() {
        return String.format(
                "Student [ID=%d, Name=%s, Email=%s, Course=%s, Grade=%s]",
                id, name, email, course, grade);
    }
}
