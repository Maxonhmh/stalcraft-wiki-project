package com.example.demo.quest;

import com.example.demo.common.exception.ConflictException;
import com.example.demo.common.exception.NotFoundException;
import com.example.demo.quest.dto.QuestCreateRequest;
import com.example.demo.quest.dto.QuestUpdateRequest;
import org.springframework.stereotype.Service;
import com.example.demo.common.SlugUtils;

import java.util.List;
import java.util.UUID;

@Service
public class QuestService {

    private final QuestRepository questRepository;

    public QuestService(QuestRepository questRepository) {
        this.questRepository = questRepository;
    }

    public List<Quest> getAllQuests() {
        return questRepository.findAll();
    }

    public Quest getQuestById(UUID id) {
        return questRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Quest not found"));
    }

    public Quest createQuest(QuestCreateRequest request) {
        if (questRepository.existsBySlug(request.slug())) {
            throw new ConflictException("Quest with this slug already exists");
        }

        Quest quest = Quest.builder()
                .title(request.title())
                .slug(
                    request.slug() != null && !request.slug().isBlank()
                            ? request.slug()
                            : generateUniqueSlug(request.title())
                )
                .content(request.content())
                .published(request.published() != null ? request.published() : false)
                .build();

        return questRepository.save(quest);
    }

    public Quest updateQuest(UUID id, QuestUpdateRequest request) {
        Quest quest = getQuestById(id);

        questRepository.findBySlug(request.slug())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new ConflictException("Quest with this slug already exists");
                    }
                });

        quest.setTitle(request.title());
        quest.setContent(request.content());
        quest.setPublished(request.published() != null ? request.published() : quest.getPublished());

        return questRepository.save(quest);
    }

    public Quest getQuestBySlug(String slug) {
        return questRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Quest not found"));
    }

    public void deleteQuest(UUID id) {
        if (!questRepository.existsById(id)) {
            throw new NotFoundException("Quest not found");
        }

        questRepository.deleteById(id);
    }


    private String generateUniqueSlug(String title) {
        String baseSlug = SlugUtils.createSlug(title);
        String slug = baseSlug;
        int counter = 2;

        while (questRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }
}