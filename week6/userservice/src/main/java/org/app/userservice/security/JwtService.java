package org.app.userservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Service for generating and validating JWT tokens.
 */
@Service
public class JwtService {

    // ✅ Hardcoded secret key — must be at least 32 characters for HS256
    private static final String SECRET_KEY = "mySuperSecretKey12345678901234567890";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    /**
     * Generates a JWT token for the given username.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the username from the JWT token.
     */
    public String extractUsername(String token) {
        return parseToken(token).getBody().getSubject();
    }

    /**
     * Validates the given JWT token.
     */
    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
}
