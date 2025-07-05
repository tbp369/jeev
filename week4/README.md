
# Student Management System

The Student Management System is a Java-based application developed using the Maven build tool. It provides essential features to manage student data, including adding, updating, deleting, retrieving records, exporting data to CSV, and running unit tests. The application follows a layered architecture using DAO (Data Access Object), Service, and Utility components, and interacts with a MySQL database for persistent storage.

## 🔧 Implementation Details

This project is structured using a modular and maintainable approach with the following layers:

### 1. Model Layer
- Contains the `Student.java` class which acts as a POJO to define student attributes like `id`, `name`, `age`, `email`, and `course`.

### 2. DAO Layer
- Interfaces: Define abstract methods for database operations.
- Implementations: Provide JDBC-based logic to interact with the database (`StudentDAO.java`, `StudentDAOImpl.java`).

### 3. Service Layer
- Contains business logic for managing students (`StudentService.java`, `StudentServiceImpl.java`).
- Acts as a bridge between the DAO layer and the main application.

### 4. Utility Layer
- Includes helper classes:
  - `DBUtil.java`: Manages the database connection using JDBC.
  - `CSVExporter.java`: Handles exporting student data to a `.csv` file.
  - `LoggerUtil.java` and `LoggerConfig.java`: Setup and manage logging with custom log configurations.
  - `Main.java`: The entry point that initializes services and interacts with the user.

### 5. Test Layer
- Includes unit tests written using JUnit to validate utility and service logic.
  - `DBUtilTest.java`: Tests database connection setup.
  - `LoggerConfigTest.java`: Ensures logging is working.
  - `StudentServiceImplTest.java`: Tests service layer CRUD logic.

## 🚀 How to Run the Project

### Prerequisites
- Java 17 or above
- Maven 3.x
- MySQL Server

### Steps

1. Clone or copy the project into your working directory:
   ```bash
   git clone https://github.com/yourusername/jeev.git
   cd jeev/week4
Place your STUDENTMANAGEMENTSYSTEM folder inside week4 if not already present.
Update the MySQL database credentials in DBUtil.java as per your system.
Run the project using Maven:
mvn clean install
mvn exec:java -Dexec.mainClass="com.student.util.Main"
To run tests:
mvn test
After usage, the system logs activities to student_app.log and exports records to students_export.csv.
🧪 Developed Using

This application is built as a Maven-based project, utilizing the standard Maven folder structure and lifecycle. Key dependencies and plugins are managed through the pom.xml file.

Features supported by Maven:

Dependency management
Build lifecycle
Unit testing
Execution through exec-maven-plugin
🗃️ Database Setup (MySQL)

Before running the application, create the database and table using the SQL below:

-- Create database
CREATE DATABASE studentdb;

-- Switch to the database
USE studentdb;

-- Create students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(100),
    course VARCHAR(100)
);
You can access this database via DBUtil.java, which uses JDBC to connect and perform operations.

📫 Contact

For questions, improvements, or contributions, please reach out to:

GitHub: tbp369
