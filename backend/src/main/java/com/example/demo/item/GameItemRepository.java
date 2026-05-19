package com.example.demo.item;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GameItemRepository extends JpaRepository<GameItem, UUID> {

    List<GameItem> findAllByOrderByNameRuAsc();

    List<GameItem> findAllByCategoryOrderByNameRuAsc(String category);

    List<GameItem> findAllByCategoryStartingWithOrderByNameRuAsc(String categoryPrefix);

    Optional<GameItem> findByGameId(String gameId);
}