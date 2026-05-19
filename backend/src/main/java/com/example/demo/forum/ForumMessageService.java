package com.example.demo.forum;

import com.example.demo.common.exception.ForbiddenException;
import com.example.demo.common.exception.NotFoundException;
import com.example.demo.common.util.AnonymousNameGenerator;
import com.example.demo.forum.dto.ForumMessageCreateRequest;
import org.springframework.stereotype.Service;

import com.example.demo.forum.dto.AdminForumMessageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.ArrayList;


import java.util.List;
import java.util.UUID;

@Service
public class ForumMessageService {

    private final ForumMessageRepository forumMessageRepository;
    private final ForumTopicService forumTopicService;
    private final ForumBanService forumBanService;
    private final ForumTopicRepository forumTopicRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ForumMessageService(
            ForumMessageRepository forumMessageRepository,
            ForumTopicService forumTopicService,
            ForumBanService forumBanService,
            ForumTopicRepository forumTopicRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.forumMessageRepository = forumMessageRepository;
        this.forumTopicService = forumTopicService;
        this.forumBanService = forumBanService;
        this.forumTopicRepository = forumTopicRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ForumMessage> getAllVisibleMessages() {
        return forumMessageRepository.findAllByDeletedFalseOrderByCreatedAtAsc();
    }

    public List<ForumMessage> getVisibleMessagesByTopic(UUID topicId) {
        if (topicId == null) {
            return getAllVisibleMessages();
        }

        return forumMessageRepository.findAllByTopic_IdAndDeletedFalseOrderByCreatedAtAsc(topicId);
    }


    

    public ForumMessage createMessage(ForumMessageCreateRequest request) {
        ForumBan ban = forumBanService.checkBan(request.anonKey());

        if (ban != null) {
            throw new ForbiddenException(
                    "You are banned from the forum. Reason: "
                            + ban.getReason()
                            + ". Appeal email: "
                            + ban.getAppealEmail()
            );
        }

        ForumTopic topic = forumTopicService.getTopicOrNull(request.topicId());
        String nickname = AnonymousNameGenerator.generate(request.anonKey());

        ForumMessage message = ForumMessage.builder()
                .topic(topic)
                .nickname(nickname)
                .content(request.content())
                .anonKey(request.anonKey())
                .deleted(false)
                .adminMessage(false)
                .build();

        return forumMessageRepository.save(message);
    }

    public ForumMessage createSocketMessage(UUID topicId, String content, String anonKey) {
        ForumBan ban = forumBanService.checkBan(anonKey);

        if (ban != null) {
            throw new ForbiddenException(
                    "You are banned from the forum. Reason: "
                            + ban.getReason()
                            + ". Appeal email: "
                            + ban.getAppealEmail()
            );
        }

        ForumTopic topic = forumTopicService.getTopicOrNull(topicId);
        String nickname = AnonymousNameGenerator.generate(anonKey);

        ForumMessage message = ForumMessage.builder()
                .topic(topic)
                .nickname(nickname)
                .content(content)
                .anonKey(anonKey)
                .deleted(false)
                .adminMessage(false)
                .build();

        return forumMessageRepository.save(message);
    }

    public List<ForumMessage> createAdminMessage(AdminForumMessageRequest request) {
        List<ForumTopic> targetTopics;

        if (request.topicId() != null) {
            ForumTopic topic = forumTopicRepository.findById(request.topicId())
                    .orElseThrow(() -> new NotFoundException("Forum topic not found"));

            targetTopics = List.of(topic);
        } else {
            targetTopics = forumTopicRepository.findAll()
                    .stream()
                    .filter(ForumTopic::getActive)
                    .toList();
        }

        List<ForumMessage> createdMessages = new ArrayList<>();

        for (ForumTopic topic : targetTopics) {
            ForumMessage message = ForumMessage.builder()
                    .topic(topic)
                    .nickname("Администратор")
                    .content(request.content())
                    .anonKey("ADMIN")
                    .adminMessage(true)
                    .deleted(false)
                    .build();

            ForumMessage savedMessage = forumMessageRepository.save(message);
            createdMessages.add(savedMessage);

            messagingTemplate.convertAndSend("/topic/forum", savedMessage);
        }

        return createdMessages;
    }

    public void deleteMessage(UUID id) {
        ForumMessage message = forumMessageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Forum message not found"));

        message.setDeleted(true);
        forumMessageRepository.save(message);
    }
}