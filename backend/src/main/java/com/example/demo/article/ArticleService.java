package com.example.demo.article;

import com.example.demo.article.dto.ArticleCreateRequest;
import com.example.demo.article.dto.ArticleUpdateRequest;
import com.example.demo.common.exception.ConflictException;
import com.example.demo.common.exception.NotFoundException;
import org.springframework.stereotype.Service;
import com.example.demo.common.SlugUtils;

import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article getArticleById(UUID id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Article not found"));
    }

    public Article createArticle(ArticleCreateRequest request) {
        if (articleRepository.existsBySlug(request.slug())) {
            throw new ConflictException("Article with this slug already exists");
        }

        Article article = Article.builder()
                .title(request.title())
                .content(request.content())
                .slug(
                    request.slug() != null && !request.slug().isBlank()
                            ? request.slug()
                            : generateUniqueSlug(request.title())
                )
                .published(request.published() != null ? request.published() : false)
                .build();

        return articleRepository.save(article);
    }

    public Article updateArticle(UUID id, ArticleUpdateRequest request) {
        Article article = getArticleById(id);

        articleRepository.findBySlug(request.slug())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new ConflictException("Article with this slug already exists");
                    }
                });

        article.setTitle(request.title());
        article.setContent(request.content());
        article.setPublished(request.published() != null ? request.published() : article.getPublished());

        return articleRepository.save(article);
    }

    public void deleteArticle(UUID id) {
        if (!articleRepository.existsById(id)) {
            throw new NotFoundException("Article not found");
        }

        articleRepository.deleteById(id);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = SlugUtils.createSlug(title);
        String slug = baseSlug;
        int counter = 2;

        while (articleRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }


    public Article getArticleBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Article not found"));
    }
}