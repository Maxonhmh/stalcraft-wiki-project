package com.example.demo.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForumTopicCreateRequest(

    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title must be less than 120 characters")
    String title,


    @Size(max = 120, message = "Slug must be less than 120 characters")
    String slug,

    @Size(max = 2000, message = "Description must be less than 2000 characters")
    String description
) {
}