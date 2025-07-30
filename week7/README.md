# Employee Management System - Spring Security

This is a basic Spring Boot REST API that demonstrates user authentication and role-based access control using Spring Security. It supports login, password encryption, and endpoint-level security based on roles.

## Features
- Secure login with BCrypt password encoding.
- Role-based access: ADMIN and USER.
- In-memory or database-backed authentication.
- ADMIN can perform full CRUD on employees.
- USER can only view their profile info.
- JWT-based stateless authentication (Bonus).
- Graceful handling of unauthorized/forbidden access.

## Endpoints & Access
- `POST /login` – Authenticates user (JWT if enabled)
- `GET /api/employees` – ADMIN only
- `POST /api/employees` – ADMIN only
- `GET /api/employees/{id}` – ADMIN only
- `PUT /api/employees/{id}` – ADMIN only
- `DELETE /api/employees/{id}` – ADMIN only
- `GET /api/profile` – USER & ADMIN

## Credentials
- **ADMIN**: `admin / admin123`
- **USER**: `user / user123`

## Getting Started
1. Clone repo or unzip project.
2. Configure DB (H2/MySQL) in `application.properties`.
3. Run with `mvn spring-boot:run`.
4. Test endpoints via Postman or Swagger (if added).

## Extras
- Includes Postman collection for quick testing.
- Built with Spring Boot 3.x and Java 17.
