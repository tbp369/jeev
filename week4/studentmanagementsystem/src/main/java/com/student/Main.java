package com.student;

import com.student.model.Student;
import com.student.service.StudentService;
import com.student.service.StudentServiceImpl;
import com.student.util.CSVExporter;

import java.util.List;
import java.util.Scanner;
import java.util.logging.Logger;

public class Main {

    private static final Logger logger = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StudentService service = new StudentServiceImpl();

        while (true) {
            System.out.println("\n--- Student Management System ---");
            System.out.println("1. Add Student");
            System.out.println("2. View All Students");
            System.out.println("3. Update Student");
            System.out.println("4. Delete Student");
            System.out.println("5. Export to CSV");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");

            int choice = Integer.parseInt(scanner.nextLine());

            switch (choice) {
                case 1:
                    System.out.print("Enter ID: ");
                    int id = Integer.parseInt(scanner.nextLine());
                    System.out.print("Enter Name: ");
                    String name = scanner.nextLine();
                    System.out.print("Enter Email: ");
                    String email = scanner.nextLine();
                    System.out.print("Enter Course: ");
                    String course = scanner.nextLine();
                    System.out.print("Enter Grade (A+, A, B+, B, C, D, F): ");
                    String grade = scanner.nextLine();

                    Student newStudent = new Student(id, name, email, course, grade);
                    service.addStudent(newStudent);
                    logger.info("Student added: " + newStudent);
                    break;

                case 2:
                    List<Student> students = service.getAllStudents();
                    students.forEach(System.out::println);
                    logger.info("Displayed all students.");
                    break;

                case 3:
                    System.out.print("Enter ID to Update: ");
                    int updateId = Integer.parseInt(scanner.nextLine());
                    System.out.print("Enter New Name: ");
                    String newName = scanner.nextLine();
                    System.out.print("Enter New Email: ");
                    String newEmail = scanner.nextLine();
                    System.out.print("Enter New Course: ");
                    String newCourse = scanner.nextLine();
                    System.out.print("Enter New Grade: ");
                    String newGrade = scanner.nextLine();

                    Student updatedStudent = new Student(updateId, newName, newEmail, newCourse, newGrade);
                    service.updateStudent(updatedStudent);
                    logger.info("Student updated: " + updatedStudent);
                    break;

                case 4:
                    System.out.print("Enter ID to Delete: ");
                    int deleteId = Integer.parseInt(scanner.nextLine());
                    service.deleteStudent(deleteId);
                    logger.info("Student deleted with ID: " + deleteId);
                    break;

                case 5:
                    CSVExporter.exportToCSV();
                    break;

                case 6:
                    System.out.println("Exiting program.");
                    scanner.close();
                    System.exit(0);

                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
}
