package com.example.demo.article;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {

    boolean existsBySlug(String slug);

    Optional<Article> findBySlug(String slug);
}