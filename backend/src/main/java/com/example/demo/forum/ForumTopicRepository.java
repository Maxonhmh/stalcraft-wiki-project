package com.example.demo.forum;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumTopicRepository extends JpaRepository<ForumTopic, UUID> {

    List<ForumTopic> findAllByActiveTrueOrderByCreatedAtAsc();

    Optional<ForumTopic> findBySlug(String slug);

    boolean existsBySlug(String slug);
}