package com.example.demo.security.dto;

public record LoginResponse(
        String token,
        String username,
        String role
) {
}