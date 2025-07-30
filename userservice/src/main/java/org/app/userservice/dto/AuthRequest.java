package org.app.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for user login input.
 */
@Data
public class AuthRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
