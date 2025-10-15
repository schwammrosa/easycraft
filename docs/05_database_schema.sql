-- EasyCraft - Database Schema
-- PostgreSQL 15+
-- Version: 1.0
-- Date: Outubro 2025

-- =====================================================
-- EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE item_type AS ENUM ('weapon', 'armor', 'material', 'consumable');
CREATE TYPE equipment_slot AS ENUM ('weapon', 'head', 'torso', 'legs', 'feet');
CREATE TYPE battle_result AS ENUM ('victory', 'defeat', 'flee');
CREATE TYPE quest_status AS ENUM ('available', 'in_progress', 'completed', 'failed');
CREATE TYPE quest_type AS ENUM ('collect', 'battle', 'craft', 'explore');

-- =====================================================
-- TABLES: AUTHENTICATION & USERS
-- =====================================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TABLES: CHARACTERS
-- =====================================================

CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) UNIQUE NOT NULL,
  level INT DEFAULT 1 CHECK (level > 0),
  xp BIGINT DEFAULT 0 CHECK (xp >= 0),
  gold BIGINT DEFAULT 100 CHECK (gold >= 0),
  hp INT DEFAULT 50 CHECK (hp >= 0),
  max_hp INT DEFAULT 50 CHECK (max_hp > 0),
  
  -- Appearance
  head_variant VARCHAR(50) NOT NULL,
  arms_variant VARCHAR(50) NOT NULL,
  legs_variant VARCHAR(50) NOT NULL,
  feet_variant VARCHAR(50) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT chk_hp_max CHECK (hp <= max_hp)
);

CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_level ON characters(level);

-- =====================================================
-- TABLES: CHARACTER STATS
-- =====================================================

CREATE TABLE character_stats (
  character_id INT PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Base stats
  str INT DEFAULT 5 CHECK (str >= 1),
  agi INT DEFAULT 5 CHECK (agi >= 1),
  vit INT DEFAULT 5 CHECK (vit >= 1),
  int INT DEFAULT 5 CHECK (int >= 1),
  def INT DEFAULT 2 CHECK (def >= 0),
  
  -- Derived stats (cached for performance)
  total_str INT DEFAULT 5,
  total_agi INT DEFAULT 5,
  total_vit INT DEFAULT 5,
  total_int INT DEFAULT 5,
  total_def INT DEFAULT 2,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLES: ITEMS (CATALOG)
-- =====================================================

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type item_type NOT NULL,
  slot equipment_slot,
  base_value INT DEFAULT 0 CHECK (base_value >= 0),
  max_stack INT DEFAULT 1 CHECK (max_stack > 0),
  
  -- Attributes (JSON for flexibility)
  attributes JSONB DEFAULT '{}',
  
  -- Asset
  image_path VARCHAR(500),
  
  -- Flags
  is_tradeable BOOLEAN DEFAULT TRUE,
  is_craftable BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_items_code ON items(code);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_craftable ON items(is_craftable) WHERE is_craftable = TRUE;

-- =====================================================
-- TABLES: INVENTORY
-- =====================================================

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  acquired_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(character_id, item_id)
);

CREATE INDEX idx_inventory_character ON inventory(character_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);

-- =====================================================
-- TABLES: EQUIPMENT
-- =====================================================

CREATE TABLE equipment (
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot equipment_slot NOT NULL,
  inventory_id INT REFERENCES inventory(id) ON DELETE SET NULL,
  equipped_at TIMESTAMP DEFAULT NOW(),
  
  PRIMARY KEY (character_id, slot)
);

CREATE INDEX idx_equipment_character ON equipment(character_id);

-- =====================================================
-- TABLES: CRAFT RECIPES
-- =====================================================

CREATE TABLE craft_recipes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  result_item_id INT NOT NULL REFERENCES items(id),
  result_quantity INT DEFAULT 1 CHECK (result_quantity > 0),
  craft_time INT DEFAULT 0 CHECK (craft_time >= 0), -- seconds
  level_required INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipes_active ON craft_recipes(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_recipes_level ON craft_recipes(level_required);

-- =====================================================
-- TABLES: RECIPE MATERIALS
-- =====================================================

CREATE TABLE recipe_materials (
  recipe_id INT NOT NULL REFERENCES craft_recipes(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  
  PRIMARY KEY (recipe_id, item_id)
);

-- =====================================================
-- TABLES: BATTLES
-- =====================================================

CREATE TABLE battles (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Enemy info
  enemy_code VARCHAR(100) NOT NULL,
  enemy_name VARCHAR(255),
  enemy_level INT,
  
  -- Result
  result battle_result NOT NULL,
  turns_count INT DEFAULT 0,
  battle_log JSONB, -- Array of turn events
  
  -- Rewards
  xp_gained INT DEFAULT 0,
  gold_gained INT DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP DEFAULT NOW(),
  duration_ms INT -- milliseconds
);

CREATE INDEX idx_battles_character ON battles(character_id);
CREATE INDEX idx_battles_result ON battles(result);
CREATE INDEX idx_battles_started ON battles(started_at DESC);

-- =====================================================
-- TABLES: BATTLE LOOT
-- =====================================================

CREATE TABLE battle_loot (
  battle_id INT NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  
  PRIMARY KEY (battle_id, item_id)
);

-- =====================================================
-- TABLES: SHOP LISTINGS (PLAYER MARKET)
-- =====================================================

CREATE TABLE shop_listings (
  id SERIAL PRIMARY KEY,
  seller_character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price_per_unit BIGINT NOT NULL CHECK (price_per_unit > 0),
  total_price BIGINT GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX idx_listings_active ON shop_listings(is_active, created_at DESC) WHERE is_active = TRUE;
CREATE INDEX idx_listings_item ON shop_listings(item_id, is_active);
CREATE INDEX idx_listings_seller ON shop_listings(seller_character_id);
CREATE INDEX idx_listings_price ON shop_listings(price_per_unit);

-- =====================================================
-- TABLES: SHOP TRANSACTIONS
-- =====================================================

CREATE TABLE shop_transactions (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL REFERENCES shop_listings(id),
  seller_character_id INT NOT NULL REFERENCES characters(id),
  buyer_character_id INT NOT NULL REFERENCES characters(id),
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT NOT NULL,
  price_per_unit BIGINT NOT NULL,
  total_price BIGINT NOT NULL,
  market_fee BIGINT NOT NULL,
  seller_received BIGINT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_buyer ON shop_transactions(buyer_character_id);
CREATE INDEX idx_transactions_seller ON shop_transactions(seller_character_id);
CREATE INDEX idx_transactions_date ON shop_transactions(created_at DESC);

-- =====================================================
-- TABLES: NPC BUYERS
-- =====================================================

CREATE TABLE npc_buyers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLES: NPC BUYER PRICES
-- =====================================================

CREATE TABLE npc_buyer_prices (
  npc_buyer_id INT NOT NULL REFERENCES npc_buyers(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  price_per_unit INT NOT NULL CHECK (price_per_unit > 0),
  
  PRIMARY KEY (npc_buyer_id, item_id)
);

-- =====================================================
-- TABLES: NPC TRANSACTIONS
-- =====================================================

CREATE TABLE npc_transactions (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id),
  npc_buyer_id INT NOT NULL REFERENCES npc_buyers(id),
  item_id INT NOT NULL REFERENCES items(id),
  quantity INT NOT NULL,
  price_per_unit INT NOT NULL,
  total_received BIGINT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_npc_transactions_character ON npc_transactions(character_id);

-- =====================================================
-- TABLES: QUESTS (CATALOG)
-- =====================================================

CREATE TABLE quests (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type quest_type NOT NULL,
  level_required INT DEFAULT 1,
  
  -- Prerequisites
  prerequisite_quest_id INT REFERENCES quests(id),
  
  -- Objectives (JSON for flexibility)
  objectives JSONB NOT NULL,
  
  -- Rewards
  reward_xp INT DEFAULT 0,
  reward_gold INT DEFAULT 0,
  reward_items JSONB DEFAULT '[]',
  
  is_active BOOLEAN DEFAULT TRUE,
  is_repeatable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quests_active ON quests(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_quests_level ON quests(level_required);

-- =====================================================
-- TABLES: CHARACTER QUESTS (PROGRESS)
-- =====================================================

CREATE TABLE character_quests (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  quest_id INT NOT NULL REFERENCES quests(id),
  status quest_status DEFAULT 'in_progress',
  
  -- Progress tracking (JSON)
  progress JSONB DEFAULT '{}',
  
  accepted_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  UNIQUE(character_id, quest_id)
);

CREATE INDEX idx_character_quests_character ON character_quests(character_id, status);
CREATE INDEX idx_character_quests_quest ON character_quests(quest_id);

-- =====================================================
-- TABLES: GATHERING AREAS
-- =====================================================

CREATE TABLE gathering_areas (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  area_type VARCHAR(50), -- mining, woodcutting, fishing, etc
  cooldown_seconds INT DEFAULT 10,
  level_required INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gathering_areas_active ON gathering_areas(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TABLES: GATHERING RESOURCES
-- =====================================================

CREATE TABLE gathering_resources (
  id SERIAL PRIMARY KEY,
  area_id INT NOT NULL REFERENCES gathering_areas(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id),
  drop_chance INT DEFAULT 100 CHECK (drop_chance BETWEEN 1 AND 100),
  min_quantity INT DEFAULT 1,
  max_quantity INT DEFAULT 1,
  
  UNIQUE(area_id, item_id)
);

-- =====================================================
-- TABLES: GATHERING LOG
-- =====================================================

CREATE TABLE gathering_log (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  area_id INT NOT NULL REFERENCES gathering_areas(id),
  items_collected JSONB, -- [{itemId, quantity}]
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gathering_log_character ON gathering_log(character_id);
CREATE INDEX idx_gathering_log_date ON gathering_log(created_at DESC);

-- =====================================================
-- TABLES: COOLDOWNS
-- =====================================================

CREATE TABLE cooldowns (
  character_id INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'battle', 'gather_iron_mine', etc
  expires_at TIMESTAMP NOT NULL,
  
  PRIMARY KEY (character_id, action_type)
);

CREATE INDEX idx_cooldowns_expires ON cooldowns(expires_at);

-- =====================================================
-- TABLES: GAME CONFIGURATION
-- =====================================================

CREATE TABLE game_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS: Updated At
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_stats_updated_at BEFORE UPDATE ON character_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS: Recalculate Stats on Equipment Change
-- =====================================================

CREATE OR REPLACE FUNCTION recalculate_character_stats()
RETURNS TRIGGER AS $$
DECLARE
  char_id INT;
  base_stats RECORD;
  equipment_bonuses RECORD;
BEGIN
  -- Determine character_id
  IF TG_OP = 'DELETE' THEN
    char_id := OLD.character_id;
  ELSE
    char_id := NEW.character_id;
  END IF;
  
  -- Get base stats
  SELECT str, agi, vit, int, def INTO base_stats
  FROM character_stats WHERE character_id = char_id;
  
  -- Calculate equipment bonuses
  SELECT 
    COALESCE(SUM((i.attributes->>'str')::INT), 0) AS bonus_str,
    COALESCE(SUM((i.attributes->>'agi')::INT), 0) AS bonus_agi,
    COALESCE(SUM((i.attributes->>'vit')::INT), 0) AS bonus_vit,
    COALESCE(SUM((i.attributes->>'int')::INT), 0) AS bonus_int,
    COALESCE(SUM((i.attributes->>'def')::INT), 0) AS bonus_def
  INTO equipment_bonuses
  FROM equipment e
  JOIN inventory inv ON e.inventory_id = inv.id
  JOIN items i ON inv.item_id = i.id
  WHERE e.character_id = char_id;
  
  -- Update total stats
  UPDATE character_stats SET
    total_str = base_stats.str + equipment_bonuses.bonus_str,
    total_agi = base_stats.agi + equipment_bonuses.bonus_agi,
    total_vit = base_stats.vit + equipment_bonuses.bonus_vit,
    total_int = base_stats.int + equipment_bonuses.bonus_int,
    total_def = base_stats.def + equipment_bonuses.bonus_def,
    updated_at = NOW()
  WHERE character_id = char_id;
  
  -- Update max_hp based on VIT
  UPDATE characters SET
    max_hp = (base_stats.vit + equipment_bonuses.bonus_vit) * 10 + (level * 5),
    updated_at = NOW()
  WHERE id = char_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalc_stats_on_equip AFTER INSERT OR UPDATE OR DELETE ON equipment
  FOR EACH ROW EXECUTE FUNCTION recalculate_character_stats();

-- =====================================================
-- FUNCTIONS: XP for Next Level
-- =====================================================

CREATE OR REPLACE FUNCTION xp_for_level(current_level INT)
RETURNS BIGINT AS $$
BEGIN
  RETURN FLOOR(100 * POWER(current_level, 1.5));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- FUNCTIONS: Check Level Up
-- =====================================================

CREATE OR REPLACE FUNCTION check_level_up(char_id INT)
RETURNS BOOLEAN AS $$
DECLARE
  char_record RECORD;
  xp_needed BIGINT;
  leveled_up BOOLEAN := FALSE;
BEGIN
  SELECT level, xp INTO char_record FROM characters WHERE id = char_id;
  
  LOOP
    xp_needed := xp_for_level(char_record.level);
    
    EXIT WHEN char_record.xp < xp_needed;
    
    -- Level up
    UPDATE characters SET
      level = level + 1,
      xp = xp - xp_needed
    WHERE id = char_id;
    
    -- Increase base stats
    UPDATE character_stats SET
      str = str + 1,
      agi = agi + 1,
      vit = vit + 2,
      int = int + 1,
      def = def + 1
    WHERE character_id = char_id;
    
    char_record.level := char_record.level + 1;
    char_record.xp := char_record.xp - xp_needed;
    leveled_up := TRUE;
  END LOOP;
  
  RETURN leveled_up;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA: Initial Configuration
-- =====================================================

INSERT INTO game_config (key, value, description) VALUES
  ('market_fee_percentage', '5', 'Market transaction fee (%)'),
  ('max_characters_per_user', '3', 'Maximum characters per account'),
  ('starting_gold', '100', 'Gold given to new characters'),
  ('starting_inventory_slots', '50', 'Initial inventory slots'),
  ('battle_cooldown_seconds', '30', 'Cooldown after losing battle')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON TABLE characters IS 'Player characters with appearance and stats';
COMMENT ON TABLE character_stats IS 'Character attributes with base and total values';
COMMENT ON TABLE items IS 'Item catalog with all game items';
COMMENT ON TABLE inventory IS 'Character inventory with item quantities';
COMMENT ON TABLE equipment IS 'Currently equipped items per character';
COMMENT ON TABLE craft_recipes IS 'Crafting recipes available in the game';
COMMENT ON TABLE battles IS 'Battle history with results and rewards';
COMMENT ON TABLE shop_listings IS 'Active player marketplace listings';
COMMENT ON TABLE shop_transactions IS 'Completed marketplace transactions';
COMMENT ON TABLE npc_buyers IS 'NPCs that buy items from players';
COMMENT ON TABLE quests IS 'Quest catalog with objectives and rewards';
COMMENT ON TABLE character_quests IS 'Quest progress for each character';
COMMENT ON TABLE gathering_areas IS 'Resource gathering locations';
COMMENT ON TABLE cooldowns IS 'Action cooldowns per character';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_inventory_character_item ON inventory(character_id, item_id);
CREATE INDEX idx_battles_character_result ON battles(character_id, result);
CREATE INDEX idx_listings_item_active_price ON shop_listings(item_id, is_active, price_per_unit) 
  WHERE is_active = TRUE;

-- =====================================================
-- VACUUM AND ANALYZE
-- =====================================================

-- Run after initial setup
-- VACUUM ANALYZE;

-- =====================================================
-- VERSION INFO
-- =====================================================

CREATE TABLE schema_version (
  version VARCHAR(20) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_version (version, description) VALUES
  ('1.0.0', 'Initial schema for EasyCraft MVP');

-- END OF SCHEMA
