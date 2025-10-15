-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('kill_enemies', 'collect_items', 'reach_level', 'equip_items', 'earn_gold', 'complete_battles');

-- CreateEnum
CREATE TYPE "QuestRarity" AS ENUM ('common', 'rare', 'epic', 'legendary');

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "rarity" "QuestRarity" NOT NULL DEFAULT 'common',
    "target_amount" INTEGER NOT NULL,
    "target_data" JSONB,
    "xp_reward" INTEGER NOT NULL,
    "gold_reward" INTEGER NOT NULL,
    "item_rewards" JSONB,
    "is_repeatable" BOOLEAN NOT NULL DEFAULT false,
    "cooldown_hours" INTEGER,
    "required_level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_quests" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "quest_id" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "claimed_at" TIMESTAMP(3),

    CONSTRAINT "character_quests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quests_code_key" ON "quests"("code");

-- CreateIndex
CREATE INDEX "quests_type_idx" ON "quests"("type");

-- CreateIndex
CREATE INDEX "quests_rarity_idx" ON "quests"("rarity");

-- CreateIndex
CREATE INDEX "character_quests_character_id_idx" ON "character_quests"("character_id");

-- CreateIndex
CREATE INDEX "character_quests_completed_idx" ON "character_quests"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "character_quests_character_id_quest_id_key" ON "character_quests"("character_id", "quest_id");

-- AddForeignKey
ALTER TABLE "character_quests" ADD CONSTRAINT "character_quests_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_quests" ADD CONSTRAINT "character_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
