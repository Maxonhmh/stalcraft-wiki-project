package com.example.demo.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ForumMessageCreateRequest(

        UUID topicId,

        @NotBlank(message = "Content is required")
        @Size(max = 2000, message = "Content must be less than 2000 characters")
        String content,

        @NotBlank(message = "Anon key is required")
        @Size(max = 255, message = "Anon key must be less than 255 characters")
        String anonKey
) {
}