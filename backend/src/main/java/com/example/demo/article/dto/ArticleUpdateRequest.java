package com.example.demo.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArticleUpdateRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be less than 200 characters")
        String title,

        @NotBlank(message = "Content is required")
        String content,

        @Size(max = 100, message = "Slug must be less than 100 characters")
        String slug,

        Boolean published
) {
}