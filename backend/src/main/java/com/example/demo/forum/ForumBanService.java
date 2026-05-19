package com.example.demo.forum;

import com.example.demo.forum.dto.ForumBanCheckResponse;
import com.example.demo.common.exception.ConflictException;
import com.example.demo.common.exception.NotFoundException;
import com.example.demo.common.util.AnonymousNameGenerator;
import com.example.demo.forum.dto.ForumBanCreateRequest;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ForumBanService {

    private final ForumBanRepository forumBanRepository;

    public ForumBanService(ForumBanRepository forumBanRepository) {
        this.forumBanRepository = forumBanRepository;
    }

    public List<ForumBan> getAllBans() {
        return forumBanRepository.findAllByOrderByCreatedAtDesc();
    }

    public ForumBan checkBan(String anonKey) {
        return forumBanRepository.findByAnonKeyAndActiveTrue(anonKey)
                .orElse(null);
    }

    public ForumBan banUser(ForumBanCreateRequest request) {
        forumBanRepository.findByAnonKeyAndActiveTrue(request.anonKey())
                .ifPresent(existing -> {
                    throw new ConflictException("This anonymous user is already banned");
                });

        String nickname = AnonymousNameGenerator.generate(request.anonKey());

        ForumBan ban = ForumBan.builder()
                .anonKey(request.anonKey())
                .nickname(nickname)
                .reason(request.reason())
                .appealEmail(request.appealEmail())
                .active(true)
                .build();

        return forumBanRepository.save(ban);
    }

    public void unbanUser(UUID id) {
        ForumBan ban = forumBanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Forum ban not found"));

        ban.setActive(false);
        ban.setUnbannedAt(LocalDateTime.now());

        forumBanRepository.save(ban);
    }

    public ForumBanCheckResponse checkBanResponse(String anonKey) {
        ForumBan ban = checkBan(anonKey);

        if (ban == null) {
            return new ForumBanCheckResponse(false, null, null);
        }

        return new ForumBanCheckResponse(
                true,
                ban.getReason(),
                ban.getAppealEmail()
        );
    }


}