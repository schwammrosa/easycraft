-- Script SQL para criar dungeon floors manualmente
-- Execute isso no console SQL do Render se o seed continuar falhando

-- Primeiro, veja os IDs das dungeons:
-- SELECT id, code FROM dungeons;

-- Caverna dos Goblins (assumindo id=1)
INSERT INTO dungeon_floors (dungeon_id, floor_number, enemy_code, is_boss) VALUES
(1, 1, 'goblin', false),
(1, 2, 'goblin', false),
(1, 3, 'orc', true);

-- Floresta Sombria (assumindo id=2)
INSERT INTO dungeon_floors (dungeon_id, floor_number, enemy_code, is_boss) VALUES
(2, 1, 'wolf', false),
(2, 2, 'wolf', false),
(2, 3, 'orc', false),
(2, 4, 'troll', false),
(2, 5, 'troll', true);

-- Ruínas Antigas (assumindo id=3)
INSERT INTO dungeon_floors (dungeon_id, floor_number, enemy_code, is_boss) VALUES
(3, 1, 'dark_knight', false),
(3, 2, 'dark_knight', false),
(3, 3, 'dark_knight', false),
(3, 4, 'troll', false),
(3, 5, 'dark_knight', false),
(3, 6, 'dark_knight', false),
(3, 7, 'dragon', true);

-- Verificar se funcionou:
-- SELECT * FROM dungeon_floors ORDER BY dungeon_id, floor_number;
