package com.example.demo.item;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.node.ObjectNode;


import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URI;
import java.nio.file.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class GameItemImportService {

    private static final String ZIP_URL =
            "https://github.com/EXBO-Studio/stalcraft-database/archive/refs/heads/main.zip";

    private final GameItemRepository gameItemRepository;
    private final ObjectMapper objectMapper;
    private int importedVariantsCount = 0;

    public GameItemImportService(
            GameItemRepository gameItemRepository,
            ObjectMapper objectMapper
    ) {
        this.gameItemRepository = gameItemRepository;
        this.objectMapper = objectMapper;
    }

@Transactional
public ItemImportResult importItems() {
    try {
        importedVariantsCount = 0;
        Path tempDir = Files.createTempDirectory("stalcraft-db-");
        Path zipPath = tempDir.resolve("stalcraft-database.zip");
        Path extractDir = tempDir.resolve("extract");

        downloadZip(zipPath);
        unzip(zipPath, extractDir);

        Path repoRoot = extractDir.resolve("stalcraft-database-main");
        Path itemsRoot = repoRoot.resolve("ru").resolve("items");

        if (!Files.exists(itemsRoot)) {
            throw new RuntimeException("ru/items directory not found in downloaded database");
        }

        Map<String, GameItem> importedItemsByGameId = new LinkedHashMap<>();

        try (var paths = Files.walk(itemsRoot)) {
            paths
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".json"))
                .filter(path -> !path.toString().contains("_variants"))
                .forEach(path -> {
                    try {
                        GameItem item = parseItem(path, itemsRoot);

                        if (item.getGameId() == null || item.getGameId().isBlank()) {
                            return;
                        }

                        importedItemsByGameId.put(item.getGameId(), item);
                    } catch (Exception exception) {
                        System.out.println("Could not parse item file: " + path);
                        exception.printStackTrace();
                    }
                });
        }

        List<GameItem> importedItems = new ArrayList<>(importedItemsByGameId.values());
        System.out.println("Imported items with variants: " + importedVariantsCount);

        gameItemRepository.deleteAllInBatch();
        gameItemRepository.saveAll(importedItems);

        deleteDirectory(tempDir);

        return new ItemImportResult(
                importedItems.size(),
                "Items imported successfully"
        );
    } catch (Exception exception) {
        throw new RuntimeException("Could not import STALCRAFT items: " + exception.getMessage());
    }
}
    private void downloadZip(Path zipPath) throws IOException, InterruptedException {
        try (InputStream inputStream = URI.create(ZIP_URL).toURL().openStream()) {
            Files.copy(inputStream, zipPath, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private void unzip(Path zipPath, Path extractDir) throws IOException {
        Files.createDirectories(extractDir);

        try (ZipInputStream zipInputStream = new ZipInputStream(Files.newInputStream(zipPath))) {
            ZipEntry entry;

            while ((entry = zipInputStream.getNextEntry()) != null) {
                Path filePath = extractDir.resolve(entry.getName()).normalize();

                if (!filePath.startsWith(extractDir)) {
                    throw new IOException("Bad zip entry: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    Files.createDirectories(filePath);
                } else {
                    Files.createDirectories(filePath.getParent());
                    Files.copy(zipInputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                }

                zipInputStream.closeEntry();
            }
        }
    }

    private String extractRank(JsonNode root) {
        String color = getText(root, "color");

        if (color != null && !color.isBlank()) {
            return color;
        }

        String rank = getText(root, "rank");

        if (rank != null && !rank.isBlank()) {
            return rank;
        }

        String quality = getText(root, "quality");

        if (quality != null && !quality.isBlank()) {
            return quality;
        }

        return "DEFAULT";
    }






private JsonNode enrichWithVariants(JsonNode root, Path jsonPath) throws IOException {
    Path parentDir = jsonPath.getParent();

    if (parentDir == null) {
        return root;
    }

    String gameId = getText(root, "id");

    if (gameId == null || gameId.isBlank()) {
        gameId = removeExtension(jsonPath.getFileName().toString());
    }

    Path variantsDir = parentDir
            .resolve("_variants")
            .resolve(gameId);

    if (!Files.exists(variantsDir) || !Files.isDirectory(variantsDir)) {
        return root;
    }

    ObjectNode variantsByLevel = objectMapper.createObjectNode();

    try (var paths = Files.walk(variantsDir)) {
        paths
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".json"))
                .forEach(path -> {
                    try {
                        String level = removeExtension(path.getFileName().toString());
                        JsonNode variantJson = objectMapper.readTree(path.toFile());

                        variantsByLevel.set(level, variantJson);
                    } catch (Exception exception) {
                        System.out.println("Could not parse variant file: " + path);
                        exception.printStackTrace();
                    }
                });
    }

    if (variantsByLevel.isEmpty()) {
        return root;
    }

    ObjectNode enrichedRoot = root.deepCopy();
    enrichedRoot.set("_variants", variantsByLevel);

    importedVariantsCount++;

    if ("y3q1o".equals(gameId)) {
        System.out.println("===== DEBUG y3q1o VARIANTS FOUND =====");
        System.out.println("ITEM PATH: " + jsonPath);
        System.out.println("VARIANTS DIR: " + variantsDir);
        System.out.println("VARIANTS LEVELS: " + variantsByLevel.fieldNames().toString());
        System.out.println("======================================");
    }

    return enrichedRoot;
}









private GameItem parseItem(Path jsonPath, Path itemsRoot) throws IOException {
    JsonNode root = objectMapper.readTree(jsonPath.toFile());

    String gameId = getText(root, "id");

    if (gameId == null || gameId.isBlank()) {
        gameId = removeExtension(jsonPath.getFileName().toString());
    }

    String category = getText(root, "category");

    if (category == null || category.isBlank()) {
        category = extractCategory(jsonPath, itemsRoot);
    }

    String nameRu = extractRuName(root);

    if (nameRu == null || nameRu.isBlank()) {
        nameRu = gameId;
    }

    String rankOrColor = extractRank(root);

    JsonNode enrichedRoot = enrichWithVariants(root, jsonPath);

    String iconUrl = buildIconUrl(category, gameId);

    return GameItem.builder()
            .gameId(gameId)
            .nameRu(nameRu)
            .category(category)
            .rankOrColor(rankOrColor)
            .iconUrl(iconUrl)
            .rawJson(objectMapper.writeValueAsString(enrichedRoot))
            .build();
}

    private String extractRuName(JsonNode root) {
        JsonNode name = root.get("name");

        if (name == null) {
            return null;
        }

        JsonNode lines = name.get("lines");

        if (lines != null && lines.has("ru")) {
            return lines.get("ru").asText();
        }

        if (name.has("text")) {
            return name.get("text").asText();
        }

        return null;
    }

    private String buildIconUrl(String category, String gameId) {
        return "https://github.com/EXBO-Studio/stalcraft-database/raw/main/ru/icons/"
                + category
                + "/"
                + gameId
                + ".png";
    }

    private String extractCategory(Path jsonPath, Path itemsRoot) {
        Path relative = itemsRoot.relativize(jsonPath);
        Path parent = relative.getParent();

        if (parent == null) {
            return "unknown";
        }

        return parent.toString().replace("\\", "/");
    }

    private String getText(JsonNode node, String field) {
        JsonNode value = node.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }

    private String removeExtension(String filename) {
        int index = filename.lastIndexOf(".");

        if (index == -1) {
            return filename;
        }

        return filename.substring(0, index);
    }

    private void deleteDirectory(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            return;
        }

        try (var paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });
        }
    }
}