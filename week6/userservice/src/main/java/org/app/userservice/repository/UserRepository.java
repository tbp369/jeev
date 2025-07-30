package org.app.userservice.repository;

import org.app.userservice.model.User;

import java.util.Optional;

/**
 * Repository interface for user operations.
 */
public interface UserRepository {
    void save(User user);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
