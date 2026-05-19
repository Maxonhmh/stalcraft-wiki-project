package com.example.demo.article;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.article.dto.ArticleCreateRequest;
import com.example.demo.article.dto.ArticleUpdateRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }
    
    @GetMapping("/slug/{slug}")
    public Article getArticleBySlug(@PathVariable String slug) {
        return articleService.getArticleBySlug(slug);
    }

    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable UUID id) {
        return articleService.getArticleById(id);
    }

    @PostMapping
    public Article createArticle(@Valid @RequestBody ArticleCreateRequest request) {
        return articleService.createArticle(request);
    }

    @PutMapping("/{id}")
    public Article updateArticle(
            @PathVariable UUID id,
            @Valid @RequestBody ArticleUpdateRequest request
    ) {
        return articleService.updateArticle(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable UUID id) {
        articleService.deleteArticle(id);
    }


}