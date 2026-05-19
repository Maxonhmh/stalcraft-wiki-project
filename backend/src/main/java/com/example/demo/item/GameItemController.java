package com.example.demo.item;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class GameItemController {

    private final GameItemRepository gameItemRepository;
    private final GameItemImportService gameItemImportService;

    public GameItemController(
            GameItemRepository gameItemRepository,
            GameItemImportService gameItemImportService
    ) {
        this.gameItemRepository = gameItemRepository;
        this.gameItemImportService = gameItemImportService;
    }

    @GetMapping
    public List<GameItem> getItems(
            @RequestParam(required = false) String category
    ) {
        if (category == null || category.isBlank()) {
            return gameItemRepository.findAllByOrderByNameRuAsc();
        }

        return gameItemRepository.findAllByCategoryStartingWithOrderByNameRuAsc(category);
    }

    @GetMapping("/game/{gameId}")
    public GameItem getItemByGameId(@PathVariable String gameId) {
        return gameItemRepository.findByGameId(gameId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @GetMapping("/{id}")
    public GameItem getItemById(@PathVariable UUID id) {
        return gameItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }


}