package com.example.demo.quest;

import com.example.demo.quest.dto.QuestCreateRequest;
import com.example.demo.quest.dto.QuestUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public List<Quest> getAllQuests() {
        return questService.getAllQuests();
    }

    @GetMapping("/slug/{slug}")
    public Quest getQuestBySlug(@PathVariable String slug) {
        return questService.getQuestBySlug(slug);
    }

    @GetMapping("/{id}")
    public Quest getQuestById(@PathVariable UUID id) {
        return questService.getQuestById(id);
    }

    @PostMapping
    public Quest createQuest(@Valid @RequestBody QuestCreateRequest request) {
        return questService.createQuest(request);
    }

    @PutMapping("/{id}")
    public Quest updateQuest(
            @PathVariable UUID id,
            @Valid @RequestBody QuestUpdateRequest request
    ) {
        return questService.updateQuest(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteQuest(@PathVariable UUID id) {
        questService.deleteQuest(id);
    }
}