package com.example.demo.item;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/items")
public class AdminGameItemController {

    private final GameItemImportService gameItemImportService;

    public AdminGameItemController(GameItemImportService gameItemImportService) {
        this.gameItemImportService = gameItemImportService;
    }

    @PostMapping("/import")
    public ItemImportResult importItems() {
        return gameItemImportService.importItems();
    }
}