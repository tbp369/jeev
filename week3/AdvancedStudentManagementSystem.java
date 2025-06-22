// Importing required libraries
import java.io.Serializable;
import java.util.Objects;
import java.io.*;
import java.util.*;
import java.util.InputMismatchException;
import java.util.Scanner;

// Student class implementing Serializable for file operations
class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    // Student attributes
    private int id;
    private String name;
    private int age;
    private String grade;
    private String address;

    // Constructor
    public Student(int id, String name, int age, String grade, String address) {
        this.id = id;
        this.name = name.toUpperCase(); // Convert to uppercase
        this.age = age;
        this.grade = grade;
        this.address = address;
    }

    // Getters and setters for student fields
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
        this.name = name.toUpperCase(); // Convert to uppercase
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // Displaying student details
    @Override
    public String toString() {
        return "Student{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", age=" + age +
               ", grade='" + grade + '\'' +
               ", address='" + address + '\'' +
               "}";
    }

    // Equality based on student ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return id == student.id;
    }

    // Hash code based on student ID
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

// StudentManager class to manage student records
class StudentManager {
    private ArrayList<Student> students;
    private HashMap<Integer, Student> studentMap;
    private TreeSet<Student> sortedStudents;

    // Constructor
    public StudentManager() {
        sortedStudents = new TreeSet<>(Comparator.comparing(Student::getName).thenComparing(Student::getId));
        students = new ArrayList<>();
        studentMap = new HashMap<>();
    }

    // Method to validate input data
    private boolean validateStudentData(String name, int age, String address) {
        if (age <= 0) {
            System.out.println("Error: Age must be positive.");
            return false;
        }
        if (name == null || name.trim().isEmpty()) {
            System.out.println("Error: Name cannot be empty.");
            return false;
        }
        if (address == null || address.trim().isEmpty()) {
            System.out.println("Error: Address cannot be empty.");
            return false;
        }
        return true;
    }

    // Method to validate data structure consistency
    private boolean validateCollections() {
        return students.size() == studentMap.size() && 
               students.size() == sortedStudents.size();
    }

    // Method to add a new student
    public boolean addStudent(Student student) {
        if (studentMap.containsKey(student.getId())) {
            System.out.println("Error: Student with ID " + student.getId() + " already exists.");
            return false;
        }
        
        if (!validateStudentData(student.getName(), student.getAge(), student.getAddress())) {
            return false;
        }

        try {
            students.add(student);
            studentMap.put(student.getId(), student);
            sortedStudents.add(student);
            
            // Validate data consistency
            if (!validateCollections()) {
                // Rollback if inconsistent
                students.remove(student);
                studentMap.remove(student.getId());
                sortedStudents.remove(student);
                System.out.println("Error: Data consistency issue. Operation rolled back.");
                return false;
            }
            
            System.out.println("Student added successfully.");
            return true;
        } catch (Exception e) {
            System.err.println("Error adding student: " + e.getMessage());
            return false;
        }
    }

    // Method to remove a student by ID
    public boolean removeStudent(int id) {
        Student studentToRemove = studentMap.get(id);
        if (studentToRemove == null) {
            System.out.println("Error: Student with ID " + id + " not found.");
            return false;
        }

        try {
            students.remove(studentToRemove);
            studentMap.remove(id);
            sortedStudents.remove(studentToRemove);
            
            // Validate data consistency
            if (!validateCollections()) {
                // Rollback if inconsistent
                students.add(studentToRemove);
                studentMap.put(id, studentToRemove);
                sortedStudents.add(studentToRemove);
                System.out.println("Error: Data consistency issue. Operation rolled back.");
                return false;
            }
            
            System.out.println("Student with ID " + id + " removed successfully.");
            return true;
        } catch (Exception e) {
            System.err.println("Error removing student: " + e.getMessage());
            return false;
        }
    }

    // Method to update student details
    public boolean updateStudent(int id, String name, int age, String grade, String address) {
        Student studentToUpdate = studentMap.get(id);
        if (studentToUpdate == null) {
            System.out.println("Error: Student with ID " + id + " not found.");
            return false;
        }

        if (!validateStudentData(name, age, address)) {
            return false;
        }

        // Store original values for rollback
        String originalName = studentToUpdate.getName();
        int originalAge = studentToUpdate.getAge();
        String originalGrade = studentToUpdate.getGrade();
        String originalAddress = studentToUpdate.getAddress();

        try {
            // Remove from sorted set before updating
            sortedStudents.remove(studentToUpdate);

            // Update the student
            studentToUpdate.setName(name);
            studentToUpdate.setAge(age);
            studentToUpdate.setGrade(grade);
            studentToUpdate.setAddress(address);

            // Add back to sorted set
            sortedStudents.add(studentToUpdate);

            // Validate data consistency
            if (!validateCollections()) {
                // Rollback changes
                sortedStudents.remove(studentToUpdate);
                studentToUpdate.setName(originalName);
                studentToUpdate.setAge(originalAge);
                studentToUpdate.setGrade(originalGrade);
                studentToUpdate.setAddress(originalAddress);
                sortedStudents.add(studentToUpdate);
                System.out.println("Error: Data consistency issue. Operation rolled back.");
                return false;
            }

            System.out.println("Student with ID " + id + " updated successfully.");
            return true;
        } catch (Exception e) {
            // Rollback on exception
            sortedStudents.remove(studentToUpdate);
            studentToUpdate.setName(originalName);
            studentToUpdate.setAge(originalAge);
            studentToUpdate.setGrade(originalGrade);
            studentToUpdate.setAddress(originalAddress);
            sortedStudents.add(studentToUpdate);
            System.err.println("Error updating student: " + e.getMessage());
            return false;
        }
    }

    // Method to search student by ID
    public Student searchStudent(int id) {
        return studentMap.get(id);
    }

    // Display all students (sorted)
    public void displayAllStudents() {
        if (sortedStudents.isEmpty()) {
            System.out.println("No students to display.");
            return;
        }
        System.out.println("\n--- All Students (Sorted by Name, then ID) ---");
        int count = 1;
        for (Student student : sortedStudents) {
            System.out.println(count + ". " + student);
            count++;
        }
        System.out.println("Total students: " + sortedStudents.size());
        System.out.println("-----------------------------------------------");
    }

    // Load student data from file
    public boolean loadFromFile(String filename) {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename))) {
            @SuppressWarnings("unchecked")
            List<Student> loadedStudents = (List<Student>) ois.readObject();
            
            // Clear existing data
            students.clear();
            studentMap.clear();
            sortedStudents.clear();
            
            // Load new data
            for (Student student : loadedStudents) {
                students.add(student);
                studentMap.put(student.getId(), student);
                sortedStudents.add(student);
            }
            
            // Validate loaded data
            if (!validateCollections()) {
                System.err.println("Error: Loaded data is inconsistent. Starting with empty data.");
                students.clear();
                studentMap.clear();
                sortedStudents.clear();
                return false;
            }
            
            System.out.println("Student data loaded from " + filename + " successfully. (" + students.size() + " records)");
            return true;
        } catch (FileNotFoundException e) {
            System.out.println("No existing data file found: " + filename + ". Starting with empty data.");
            return true; // This is not an error condition
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error loading student data: " + e.getMessage());
            return false;
        }
    }

    // Save student data to file
    public boolean saveToFile(String filename) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(students);
            System.out.println("Student data saved to " + filename + " successfully. (" + students.size() + " records)");
            return true;
        } catch (IOException e) {
            System.err.println("Error saving student data: " + e.getMessage());
            return false;
        }
    }

    // Get total number of students
    public int getStudentCount() {
        return students.size();
    }
}

// Main class to run the student management application
public class AdvancedStudentManagementSystem {
    private static final String DATA_FILE = "students.dat";
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        StudentManager manager = new StudentManager();
        
        // Load existing data
        System.out.println("=== Student Management System ===");
        manager.loadFromFile(DATA_FILE);

        int choice;
        do {
            printMenu();
            choice = getUserChoice();

            // Perform action based on user's choice
            switch (choice) {
                case 1:
                    addStudent(manager);
                    break;
                case 2:
                    removeStudent(manager);
                    break;
                case 3:
                    updateStudent(manager);
                    break;
                case 4:
                    searchStudent(manager);
                    break;
                case 5:
                    manager.displayAllStudents();
                    break;
                case 6:
                    if (manager.saveToFile(DATA_FILE)) {
                        System.out.println("Data saved successfully. Exiting application. Goodbye!");
                    } else {
                        System.out.println("Warning: Failed to save data. Exiting anyway.");
                    }
                    break;
                default:
                    System.out.println("Invalid choice. Please enter a number between 1 and 6.");
            }
            
            if (choice != 6) {
                System.out.println("\nPress Enter to continue...");
                scanner.nextLine();
            }
        } while (choice != 6);

        scanner.close();
    }

    // Print the main menu
    private static void printMenu() {
        System.out.println("\n" + "=".repeat(40));
        System.out.println("    STUDENT MANAGEMENT SYSTEM");
        System.out.println("=".repeat(40));
        System.out.println("1. Add a new student");
        System.out.println("2. Remove a student by ID");
        System.out.println("3. Update student details by ID");
        System.out.println("4. Search for a student by ID");
        System.out.println("5. Display all students (sorted)");
        System.out.println("6. Save and exit");
        System.out.println("=".repeat(40));
        System.out.print("Enter your choice (1-6): ");
    }

    // Get user's menu choice with improved error handling
    private static int getUserChoice() {
        while (true) {
            try {
                int input = scanner.nextInt();
                scanner.nextLine(); // Consume the leftover newline
                if (input >= 1 && input <= 6) {
                    return input;
                } else {
                    System.out.print("Please enter a number between 1 and 6: ");
                }
            } catch (InputMismatchException e) {
                System.out.print("Invalid input. Please enter a number (1-6): ");
                scanner.next(); // Consume the invalid input
                scanner.nextLine(); // Consume the leftover newline
            }
        }
    }

    // Collect input and add a new student
    private static void addStudent(StudentManager manager) {
        System.out.println("\n--- Add New Student ---");
        
        int id = getPositiveIntInput("Enter student ID: ");
        if (id == -1) return;

        System.out.print("Enter student name: ");
        String name = scanner.nextLine().trim();

        int age = getPositiveIntInput("Enter student age: ");
        if (age == -1) return;

        System.out.print("Enter student grade: ");
        String grade = scanner.nextLine().trim();

        System.out.print("Enter student address: ");
        String address = scanner.nextLine().trim();

        Student newStudent = new Student(id, name, age, grade, address);
        manager.addStudent(newStudent);
    }

    // Collect ID and remove a student
    private static void removeStudent(StudentManager manager) {
        System.out.println("\n--- Remove Student ---");
        
        if (manager.getStudentCount() == 0) {
            System.out.println("No students available to remove.");
            return;
        }
        
        int id = getPositiveIntInput("Enter student ID to remove: ");
        if (id == -1) return;
        
        // Show student details before removal
        Student student = manager.searchStudent(id);
        if (student != null) {
            System.out.println("Student to be removed: " + student);
            System.out.print("Are you sure you want to remove this student? (y/N): ");
            String confirmation = scanner.nextLine().trim().toLowerCase();
            if (confirmation.equals("y") || confirmation.equals("yes")) {
                manager.removeStudent(id);
            } else {
                System.out.println("Removal cancelled.");
            }
        } else {
            manager.removeStudent(id); // This will show the "not found" message
        }
    }

    // Update details for an existing student with improved UX
    private static void updateStudent(StudentManager manager) {
        System.out.println("\n--- Update Student ---");
        
        if (manager.getStudentCount() == 0) {
            System.out.println("No students available to update.");
            return;
        }
        
        int id = getPositiveIntInput("Enter student ID to update: ");
        if (id == -1) return;

        Student existingStudent = manager.searchStudent(id);
        if (existingStudent == null) {
            System.out.println("Error: Student with ID " + id + " not found.");
            return;
        }

        System.out.println("Current student details: " + existingStudent);
        System.out.println("Enter new values (press Enter to keep current value):");

        // Name update
        System.out.print("Enter new name [" + existingStudent.getName() + "]: ");
        String name = scanner.nextLine().trim();
        if (name.isEmpty()) {
            name = existingStudent.getName();
        }

        // Age update
        int age = getOptionalPositiveIntInput("Enter new age [" + existingStudent.getAge() + "]: ");
        if (age == -1) {
            age = existingStudent.getAge();
        }

        // Grade update
        System.out.print("Enter new grade [" + existingStudent.getGrade() + "]: ");
        String grade = scanner.nextLine().trim();
        if (grade.isEmpty()) {
            grade = existingStudent.getGrade();
        }

        // Address update
        System.out.print("Enter new address [" + existingStudent.getAddress() + "]: ");
        String address = scanner.nextLine().trim();
        if (address.isEmpty()) {
            address = existingStudent.getAddress();
        }

        manager.updateStudent(id, name, age, grade, address);
    }

    // Search for a student by ID
    private static void searchStudent(StudentManager manager) {
        System.out.println("\n--- Search Student ---");
        
        if (manager.getStudentCount() == 0) {
            System.out.println("No students available to search.");
            return;
        }
        
        int id = getPositiveIntInput("Enter student ID to search: ");
        if (id == -1) return;

        Student foundStudent = manager.searchStudent(id);
        if (foundStudent != null) {
            System.out.println("\n--- Student Found ---");
            System.out.println(foundStudent);
        } else {
            System.out.println("Student with ID " + id + " not found.");
        }
    }

    // Get valid positive integer input from user
    private static int getPositiveIntInput(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                int input = scanner.nextInt();
                scanner.nextLine(); // Consume the leftover newline
                if (input <= 0) {
                    System.out.println("Please enter a positive number greater than 0.");
                    continue;
                }
                return input;
            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a valid positive integer.");
                scanner.next(); // Consume invalid input
                scanner.nextLine(); // Consume leftover newline
            }
        }
    }

    // Get optional positive integer input (allows empty input)
    private static int getOptionalPositiveIntInput(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            
            if (input.isEmpty()) {
                return -1; // Indicates to keep current value
            }
            
            try {
                int value = Integer.parseInt(input);
                if (value <= 0) {
                    System.out.println("Please enter a positive number greater than 0, or press Enter to keep current value.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid positive integer, or press Enter to keep current value.");
            }
        }
    }
}
