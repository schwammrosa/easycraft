-- CreateEnum
CREATE TYPE "FarmSessionStatus" AS ENUM ('running', 'completed', 'cancelled', 'error');

-- CreateTable
CREATE TABLE "farm_sessions" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "enemy_code" TEXT NOT NULL,
    "enemy_name" TEXT NOT NULL,
    "potion_item_code" TEXT,
    "use_potion_at_hp_percent" INTEGER NOT NULL DEFAULT 50,
    "max_battles" INTEGER NOT NULL,
    "status" "FarmSessionStatus" NOT NULL DEFAULT 'running',
    "current_battle" INTEGER NOT NULL DEFAULT 0,
    "total_battles" INTEGER NOT NULL DEFAULT 0,
    "victories" INTEGER NOT NULL DEFAULT 0,
    "defeats" INTEGER NOT NULL DEFAULT 0,
    "total_xp_gained" INTEGER NOT NULL DEFAULT 0,
    "total_gold_gained" INTEGER NOT NULL DEFAULT 0,
    "total_items_dropped" JSONB NOT NULL DEFAULT '[]',
    "levels_gained" INTEGER NOT NULL DEFAULT 0,
    "start_level" INTEGER NOT NULL,
    "end_level" INTEGER NOT NULL,
    "potions_used" INTEGER NOT NULL DEFAULT 0,
    "stopped_reason" TEXT,
    "stopped_message" TEXT,
    "final_hp" INTEGER,
    "final_max_hp" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_battle_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "farm_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "farm_sessions_character_id_idx" ON "farm_sessions"("character_id");

-- CreateIndex
CREATE INDEX "farm_sessions_status_idx" ON "farm_sessions"("status");

-- CreateIndex
CREATE INDEX "farm_sessions_started_at_idx" ON "farm_sessions"("started_at");

-- AddForeignKey
ALTER TABLE "farm_sessions" ADD CONSTRAINT "farm_sessions_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
