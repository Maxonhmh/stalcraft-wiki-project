package com.example.demo.forum;

import com.example.demo.forum.dto.ForumSocketMessageRequest;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ForumWebSocketController {

    private final ForumMessageService forumMessageService;

    public ForumWebSocketController(ForumMessageService forumMessageService) {
        this.forumMessageService = forumMessageService;
    }

    @MessageMapping("/forum.send")
    @SendTo("/topic/forum")
    public ForumMessage sendMessage(@Valid @Payload ForumSocketMessageRequest request) {
        return forumMessageService.createSocketMessage(
                request.topicId(),
                request.content(),
                request.anonKey()
        );
    }
}