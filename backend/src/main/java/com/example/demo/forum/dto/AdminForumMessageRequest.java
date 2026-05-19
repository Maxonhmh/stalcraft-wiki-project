package com.example.demo.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record AdminForumMessageRequest(

        UUID topicId,

        @NotBlank(message = "Content is required")
        @Size(max = 2000, message = "Content must be less than 2000 characters")
        String content
) {
}