package com.example.demo.forum.dto;

public record ForumBanCheckResponse(
        boolean banned,
        String reason,
        String appealEmail
) {
}