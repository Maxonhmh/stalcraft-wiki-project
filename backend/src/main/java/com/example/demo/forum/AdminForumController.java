package com.example.demo.forum;

import com.example.demo.forum.dto.AdminForumMessageRequest;
import com.example.demo.forum.dto.ForumBanCreateRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/forum")
public class AdminForumController {

    private final ForumMessageService forumMessageService;
    private final ForumBanService forumBanService;
    private final ForumTopicService forumTopicService;

    public AdminForumController(
            ForumMessageService forumMessageService,
            ForumBanService forumBanService,
            ForumTopicService forumTopicService
    ) {
        this.forumMessageService = forumMessageService;
        this.forumBanService = forumBanService;
        this.forumTopicService = forumTopicService;
    }

    @GetMapping("/bans")
    public List<ForumBan> getBans() {
        return forumBanService.getAllBans();
    }

    @PostMapping("/bans")
    public ForumBan banUser(@Valid @RequestBody ForumBanCreateRequest request) {
        return forumBanService.banUser(request);
    }

    @DeleteMapping("/bans/{id}")
    public void unbanUser(@PathVariable UUID id) {
        forumBanService.unbanUser(id);
    }

    @GetMapping("/topics")
    public List<ForumTopic> getAllTopics() {
        return forumTopicService.getAllTopics();
    }

    @PostMapping("/messages")
    public List<ForumMessage> createAdminMessage(
            @Valid @RequestBody AdminForumMessageRequest request
    ) {
        return forumMessageService.createAdminMessage(request);
    }
}