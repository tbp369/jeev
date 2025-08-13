package com.taskmanager.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Task Manager API")
                        .description("A comprehensive task management system with role-based access control, " +
                                   "real-time notifications, and advanced analytics. This API provides endpoints " +
                                   "for user authentication, task management, team collaboration, and reporting.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Smart Task Manager Team")
                                .email("support@smarttaskmanager.com")
                                .url("https://smarttaskmanager.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url(baseUrl)
                                .description("Development Server"),
                        new Server()
                                .url("https://api.smarttaskmanager.com")
                                .description("Production Server")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token for authentication. " +
                                                   "Obtain this token by calling the /api/auth/login endpoint.")));
    }
}

