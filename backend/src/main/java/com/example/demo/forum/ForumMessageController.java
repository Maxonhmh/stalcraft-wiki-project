package com.example.demo.forum;

import com.example.demo.forum.dto.ForumMessageCreateRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum/messages")
public class ForumMessageController {

    private final ForumMessageService forumMessageService;

    public ForumMessageController(ForumMessageService forumMessageService) {
        this.forumMessageService = forumMessageService;
    }

    @GetMapping
    public List<ForumMessage> getAllMessages(@RequestParam(required = false) UUID topicId) {
        return forumMessageService.getVisibleMessagesByTopic(topicId);
    }

    @PostMapping
    public ForumMessage createMessage(@Valid @RequestBody ForumMessageCreateRequest request) {
        return forumMessageService.createMessage(request);
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable UUID id) {
        forumMessageService.deleteMessage(id);
    }
}