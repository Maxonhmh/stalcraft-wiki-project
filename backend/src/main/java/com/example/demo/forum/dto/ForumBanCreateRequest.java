package com.example.demo.forum.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForumBanCreateRequest(

        @NotBlank(message = "Anon key is required")
        @Size(max = 255, message = "Anon key must be less than 255 characters")
        String anonKey,

        @NotBlank(message = "Reason is required")
        @Size(max = 2000, message = "Reason must be less than 2000 characters")
        String reason,

        @NotBlank(message = "Appeal email is required")
        @Email(message = "Appeal email must be valid")
        String appealEmail
) {
}