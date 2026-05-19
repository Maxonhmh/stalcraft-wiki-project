package com.example.demo.forum;

import com.example.demo.forum.dto.ForumTopicCreateRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum/topics")
public class ForumTopicController {

    private final ForumTopicService forumTopicService;

    public ForumTopicController(ForumTopicService forumTopicService) {
        this.forumTopicService = forumTopicService;
    }

    @GetMapping
    public List<ForumTopic> getActiveTopics() {
        return forumTopicService.getActiveTopics();
    }

    @PostMapping
    public ForumTopic createTopic(@Valid @RequestBody ForumTopicCreateRequest request) {
        return forumTopicService.createTopic(request);
    }


    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable UUID id) {
        forumTopicService.deleteTopic(id);
    }
}