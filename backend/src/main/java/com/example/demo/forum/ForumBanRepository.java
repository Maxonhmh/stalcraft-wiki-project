package com.example.demo.forum;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumBanRepository extends JpaRepository<ForumBan, UUID> {

    Optional<ForumBan> findByAnonKeyAndActiveTrue(String anonKey);

    List<ForumBan> findAllByOrderByCreatedAtDesc();
}