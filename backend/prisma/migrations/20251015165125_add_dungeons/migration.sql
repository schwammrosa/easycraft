-- CreateEnum
CREATE TYPE "DungeonDifficulty" AS ENUM ('easy', 'normal', 'hard');

-- CreateEnum
CREATE TYPE "DungeonRunStatus" AS ENUM ('in_progress', 'completed', 'failed');

-- CreateTable
CREATE TABLE "dungeons" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommended_level" INTEGER NOT NULL,
    "max_floors" INTEGER NOT NULL,
    "cooldown_hours" INTEGER NOT NULL DEFAULT 24,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dungeons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dungeon_floors" (
    "id" SERIAL NOT NULL,
    "dungeon_id" INTEGER NOT NULL,
    "floor_number" INTEGER NOT NULL,
    "is_boss" BOOLEAN NOT NULL DEFAULT false,
    "enemy_id" INTEGER NOT NULL,
    "enemy_count" INTEGER NOT NULL DEFAULT 1,
    "gold_reward" INTEGER NOT NULL DEFAULT 0,
    "exp_reward" INTEGER NOT NULL DEFAULT 0,
    "item_drops" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "dungeon_floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dungeon_runs" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "dungeon_id" INTEGER NOT NULL,
    "difficulty" "DungeonDifficulty" NOT NULL DEFAULT 'normal',
    "current_floor" INTEGER NOT NULL DEFAULT 1,
    "status" "DungeonRunStatus" NOT NULL DEFAULT 'in_progress',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "time_elapsed" INTEGER NOT NULL DEFAULT 0,
    "total_damage_dealt" INTEGER NOT NULL DEFAULT 0,
    "total_damage_taken" INTEGER NOT NULL DEFAULT 0,
    "gold_earned" INTEGER NOT NULL DEFAULT 0,
    "exp_earned" INTEGER NOT NULL DEFAULT 0,
    "items_obtained" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "dungeon_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dungeons_code_key" ON "dungeons"("code");

-- CreateIndex
CREATE INDEX "dungeons_recommended_level_idx" ON "dungeons"("recommended_level");

-- CreateIndex
CREATE INDEX "dungeon_floors_dungeon_id_idx" ON "dungeon_floors"("dungeon_id");

-- CreateIndex
CREATE INDEX "dungeon_floors_is_boss_idx" ON "dungeon_floors"("is_boss");

-- CreateIndex
CREATE UNIQUE INDEX "dungeon_floors_dungeon_id_floor_number_key" ON "dungeon_floors"("dungeon_id", "floor_number");

-- CreateIndex
CREATE INDEX "dungeon_runs_character_id_idx" ON "dungeon_runs"("character_id");

-- CreateIndex
CREATE INDEX "dungeon_runs_dungeon_id_idx" ON "dungeon_runs"("dungeon_id");

-- CreateIndex
CREATE INDEX "dungeon_runs_status_idx" ON "dungeon_runs"("status");

-- CreateIndex
CREATE INDEX "dungeon_runs_completed_at_idx" ON "dungeon_runs"("completed_at");

-- AddForeignKey
ALTER TABLE "dungeon_floors" ADD CONSTRAINT "dungeon_floors_dungeon_id_fkey" FOREIGN KEY ("dungeon_id") REFERENCES "dungeons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dungeon_floors" ADD CONSTRAINT "dungeon_floors_enemy_id_fkey" FOREIGN KEY ("enemy_id") REFERENCES "enemies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dungeon_runs" ADD CONSTRAINT "dungeon_runs_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dungeon_runs" ADD CONSTRAINT "dungeon_runs_dungeon_id_fkey" FOREIGN KEY ("dungeon_id") REFERENCES "dungeons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
