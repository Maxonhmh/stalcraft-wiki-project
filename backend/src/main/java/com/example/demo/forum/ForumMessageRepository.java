package com.example.demo.forum;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ForumMessageRepository extends JpaRepository<ForumMessage, UUID> {

    List<ForumMessage> findAllByDeletedFalseOrderByCreatedAtAsc();

    List<ForumMessage> findAllByTopic_IdAndDeletedFalseOrderByCreatedAtAsc(UUID topicId);

    void deleteAllByTopic_Id(UUID topicId);
}