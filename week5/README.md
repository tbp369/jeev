
# Student Management System

A robust Spring Boot application to manage student data with advanced CRUD operations, validation, error handling, and MySQL integration. Designed with clean architecture, DTOs, global exception handling, and Swagger documentation.

## Features
- Add, update, delete, and fetch student records.
- Validates inputs using Bean Validation (e.g., age must be positive, name non-empty).
- Follows clean architecture: Controller, Service, Repository, Model, Config, Exception.
- Uses DTOs to separate entity from API layer.
- Global exception handling with @ControllerAdvice.
- Auto-generates Swagger UI for API testing.
- Unit and integration tests using JUnit 5, Mockito, and Testcontainers.

## Tech Stack
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- MySQL
- Lombok
- Swagger (OpenAPI)
- JUnit 5, Mockito

## Getting Started
1. Clone this repo and set up your MySQL database.
2. Update `application.properties` with your DB credentials.
3. Run the application using your IDE or `mvn spring-boot:run`.
4. Visit `http://localhost:8080/swagger-ui.html` to test APIs.

## Author
Built with 💻 using Spring Boot.
