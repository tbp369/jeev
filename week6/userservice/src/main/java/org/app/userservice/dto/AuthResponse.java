package org.app.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for JWT authentication response.
 */
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private String email;
}
