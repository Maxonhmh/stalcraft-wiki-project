package com.example.demo.quest;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QuestRepository extends JpaRepository<Quest, UUID> {

    boolean existsBySlug(String slug);

    Optional<Quest> findBySlug(String slug);
}