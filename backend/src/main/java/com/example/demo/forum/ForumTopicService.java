package com.example.demo.forum;

import com.example.demo.common.exception.ConflictException;
import com.example.demo.common.exception.NotFoundException;
import com.example.demo.forum.dto.ForumTopicCreateRequest;
import org.springframework.stereotype.Service;

import com.example.demo.common.SlugUtils;

import java.util.List;
import java.util.UUID;

@Service
public class ForumTopicService {

    private final ForumTopicRepository forumTopicRepository;
    private final ForumMessageRepository forumMessageRepository;

    public ForumTopicService(
            ForumTopicRepository forumTopicRepository,
            ForumMessageRepository forumMessageRepository
    ) {
        this.forumTopicRepository = forumTopicRepository;
        this.forumMessageRepository = forumMessageRepository;
    }

    public void deleteTopic(UUID id) {
        if (!forumTopicRepository.existsById(id)) {
            throw new NotFoundException("Forum topic not found");
        }

        forumMessageRepository.deleteAllByTopic_Id(id);
        forumTopicRepository.deleteById(id);
    }


    public List<ForumTopic> getActiveTopics() {
        return forumTopicRepository.findAllByActiveTrueOrderByCreatedAtAsc();
    }

    public List<ForumTopic> getAllTopics() {
        return forumTopicRepository.findAll();
    }

    public ForumTopic getTopicOrNull(UUID topicId) {
        if (topicId == null) {
            return null;
        }

        return forumTopicRepository.findById(topicId)
                .orElseThrow(() -> new NotFoundException("Forum topic not found"));
    }

    public ForumTopic createTopic(ForumTopicCreateRequest request) {
        String slug = request.slug() != null && !request.slug().isBlank()
                ? request.slug()
                : generateUniqueSlug(request.title());

        if (forumTopicRepository.existsBySlug(slug)) {
            throw new ConflictException("Forum topic with this slug already exists");
        }

        ForumTopic topic = ForumTopic.builder()
                .title(request.title())
                .slug(slug)
                .description(request.description())
                .active(true)
                .build();

        return forumTopicRepository.save(topic);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = SlugUtils.createSlug(title);
        String slug = baseSlug;
        int counter = 2;

        while (forumTopicRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }

}