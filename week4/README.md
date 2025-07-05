# Student Management System

The **Student Management System** is a Java-based application developed using the **Maven** build tool. It provides essential features to manage student data, including adding, updating, deleting, retrieving records, exporting data to CSV, and running unit tests. The application follows a layered architecture using DAO (Data Access Object), Service, and Utility components, and interacts with a **MySQL database** for persistent storage.

---

## 🔧 Implementation Details

This project follows a modular, maintainable structure composed of multiple layers:

### 1. 🧩 Model Layer
- `Student.java`: A POJO class representing student attributes (`id`, `name`, `age`, `email`, `course`).

### 2. 🗃️ DAO Layer
- **Interfaces**: Abstract contracts for CRUD operations on students.
- **Implementations**:
  - `StudentDAO.java`: Interface defining data operations.
  - `StudentDAOImpl.java`: Contains JDBC logic for executing operations on the MySQL database.

### 3. ⚙️ Service Layer
- Business logic implemented in:
  - `StudentService.java`
  - `StudentServiceImpl.java`
- Connects the DAO layer with the application’s main logic.

### 4. 🛠️ Utility Layer
- Support classes to assist in application functioning:
  - `DBUtil.java`: Establishes a JDBC connection to MySQL.
  - `CSVExporter.java`: Exports student data into `students_export.csv`.
  - `LoggerUtil.java`, `LoggerConfig.java`: Configure and manage application logging.
  - `Main.java`: Entry point that provides menu-driven functionality.

### 5. 🧪 Test Layer
- Contains **JUnit-based** unit tests for validation:
  - `DBUtilTest.java`: Tests DB connection.
  - `LoggerConfigTest.java`: Verifies logging setup.
  - `StudentServiceImplTest.java`: Tests core service functionalities.

---

## 🚀 How to Run the Project

### ✅ Prerequisites

- Java 17 or later
- Apache Maven 3.x
- MySQL Server (any recent version)

### 📦 Steps to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/tbp369/jeev.git
   cd jeev/week4
## sql code

-- Create the database

`CREATE DATABASE studentdb;`

-- Switch to the database
`USE studentdb;`

-- Create the 'students' table


`CCREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL,
    grade CHAR(2) NOT NULL CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C', 'D', 'F'))
);`

## Output
System logs saved to: student_app.log
Student data exported to: students_export.csv

## 📫 Contact

For questions, improvements, or contributions, please contact:

Email:zprasad369@gmail.com
