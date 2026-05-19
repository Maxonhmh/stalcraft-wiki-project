package com.example.demo.forum;

import com.example.demo.forum.dto.ForumBanCheckResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum/bans")
public class ForumBanController {

    private final ForumBanService forumBanService;

    public ForumBanController(ForumBanService forumBanService) {
        this.forumBanService = forumBanService;
    }

    @GetMapping("/check")
    public ForumBanCheckResponse checkBan(@RequestParam String anonKey) {
        return forumBanService.checkBanResponse(anonKey);
    }
}