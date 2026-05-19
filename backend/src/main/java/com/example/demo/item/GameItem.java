package com.example.demo.item;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "game_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String gameId;

    @Column(nullable = false, length = 500)
    private String nameRu;

    @Column(nullable = false, length = 255)
    private String category;

    @Column(length = 100)
    private String rankOrColor;

    @Column(length = 1000)
    private String iconUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rawJson;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onSave() {
        updatedAt = LocalDateTime.now();
    }
}