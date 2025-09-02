# 📁 Document Management System (DMS)

A robust microservices-based Document Management System built with Spring Boot, Angular, and MySQL. Designed to handle large file uploads and downloads efficiently through chunked streaming technology.

## 🚀 Services Architecture

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| **Gateway** | `10.184.204.175:8080` | API Gateway - Routes all client requests | ✅ Running |
| **Auth Service** | `10.184.204.175:8081` | JWT-based authentication service | ✅ Running |
| **Metadata Service** | `10.184.204.175:8082` | Document CRUD operations and metadata management | ✅ Running |
| **File Service** | `10.184.204.175:8083` | Chunked file upload/download handling | ✅ Running |
| **Eureka Server** | - | Service discovery and registration | ✅ All services UP |

## ⚡ Technology Stack

### Backend
- **Language**: Java 11
- **Framework**: Spring Boot 3.5.5
- **Architecture**: Spring Cloud Microservices
- **Database**: MySQL 
- **Service Discovery**:  Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: Angular 20
- **Language**: TypeScript
- **UI Components**: Angular Material
- **HTTP Client**: Angular HttpClient
- **Styling**: css

## 🛠️ Quick Start Guide

### Prerequisites
- Java 
- Node.js  and npm
- MySQL 
- Maven 3.6+
- Angular CLI

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/document-management-system.git
   cd document-management-system
   ```

2. **Setup MySQL Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE dms_db;
   ```

3. **Start Backend Services**
   ```bash
   # Start each microservice
   cd backend/gateway-service
   mvn spring-boot:run
   
   cd ../auth-service
   mvn spring-boot:run
   
   cd ../metadata-service
   mvn spring-boot:run
   
   cd ../file-service
   mvn spring-boot:run
   ```

4. **Start Frontend Application**
   ```bash
   cd frontend
   npm install
   ng serve
   ```

5. **Access the Application**
   - Frontend UI: `http://localhost:4200`
   - API Gateway: `http://10.184.204.175:8080`

## ✨ Key Features

### Document Management
- ✅ **CRUD Operations**: Create, Read, Update, Delete documents
- ✅ **Search & Filter**: Advanced search capabilities with multiple filters
- ✅ **Metadata Management**: Comprehensive document metadata tracking
- ✅ **Version Control**: Document versioning support

### File Handling
- ✅ **Chunked Upload**: Large file uploads split into 1MB chunks
- ✅ **Progress Tracking**: Real-time upload progress bar
- ✅ **Chunked Download**: Efficient streaming for large file downloads
- ✅ **Resume Support**: Resume interrupted uploads/downloads

### Security
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Endpoint Protection**: All API endpoints secured
- ✅ **Role-based Access**: User role management
- ✅ **Session Management**: Secure session handling

## 📤 File Operations

### Upload Process
Files are automatically split into configurable chunks (default: 1MB) for efficient upload:

1. **Client-side chunking**: File divided into 1MB chunks
2. **Progress tracking**: Real-time progress bar updates
3. **Server reconstruction**: Chunks reassembled on server
4. **Storage**: Files stored at `/app/storage` directory

### Download Process
Large files are streamed in chunks to prevent memory overflow:

1. **Chunked streaming**: Files sent in manageable chunks
2. **Browser handling**: Automatic file reconstruction
3. **Resume capability**: Support for partial downloads

### Configuration
```properties
# application.properties
file.storage.path=/app/storage
file.chunk.size=1048576  # 1MB in bytes
file.max.size=5368709120  # 5GB max file size
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Document Endpoints
- `GET /api/documents` - List all documents
- `GET /api/documents/{id}` - Get document by ID
- `POST /api/documents` - Create new document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

### File Endpoints
- `POST /api/files/upload` - Upload file (chunked)
- `GET /api/files/download/{id}` - Download file (chunked)
- `GET /api/files/info/{id}` - Get file information

## 🔧 Configuration

### Backend Configuration
Each microservice has its own `application.yml`:

```yaml
server:
  port: ${SERVICE_PORT}

spring:
  application:
    name: ${SERVICE_NAME}
  datasource:
    url: jdbc:mysql://localhost:3306/dms_db
    username: root
    password: ${DB_PASSWORD}

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### Frontend Configuration
Update `environment.ts` for API endpoints:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://10.184.204.175:8080/api'
};
```

## 📈 Performance Optimizations and future development

- **Chunked Processing**: Handles files of any size without memory overflow
- **Async Operations**: Non-blocking file operations
- **Connection Pooling**: Optimized database connections
- **Caching**: Redis caching for frequently accessed data
- **Load Balancing**: Ribbon load balancer for service calls



