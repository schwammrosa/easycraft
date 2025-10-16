-- CreateEnum
CREATE TYPE "GatherNodeType" AS ENUM ('wood', 'ore', 'herb', 'crystal', 'leather');

-- CreateEnum
CREATE TYPE "GatherSessionStatus" AS ENUM ('running', 'completed', 'cancelled', 'error');

-- CreateTable
CREATE TABLE "gather_nodes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "GatherNodeType" NOT NULL,
    "required_level" INTEGER NOT NULL DEFAULT 1,
    "gather_time" INTEGER NOT NULL DEFAULT 5,
    "energy_cost" INTEGER NOT NULL DEFAULT 10,
    "xp_reward" INTEGER NOT NULL,
    "drop_table" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gather_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gather_sessions" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "node_code" TEXT NOT NULL,
    "node_name" TEXT NOT NULL,
    "max_gathers" INTEGER NOT NULL,
    "status" "GatherSessionStatus" NOT NULL DEFAULT 'running',
    "current_gather" INTEGER NOT NULL DEFAULT 0,
    "total_gathers" INTEGER NOT NULL DEFAULT 0,
    "successful_gathers" INTEGER NOT NULL DEFAULT 0,
    "total_xp_gained" INTEGER NOT NULL DEFAULT 0,
    "total_items_gathered" JSONB NOT NULL DEFAULT '[]',
    "levels_gained" INTEGER NOT NULL DEFAULT 0,
    "start_level" INTEGER NOT NULL,
    "end_level" INTEGER NOT NULL,
    "energy_used" INTEGER NOT NULL DEFAULT 0,
    "stopped_reason" TEXT,
    "stopped_message" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_gather_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "gather_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gather_nodes_code_key" ON "gather_nodes"("code");

-- CreateIndex
CREATE INDEX "gather_nodes_type_idx" ON "gather_nodes"("type");

-- CreateIndex
CREATE INDEX "gather_nodes_required_level_idx" ON "gather_nodes"("required_level");

-- CreateIndex
CREATE INDEX "gather_sessions_character_id_idx" ON "gather_sessions"("character_id");

-- CreateIndex
CREATE INDEX "gather_sessions_status_idx" ON "gather_sessions"("status");

-- CreateIndex
CREATE INDEX "gather_sessions_started_at_idx" ON "gather_sessions"("started_at");

-- AddForeignKey
ALTER TABLE "gather_sessions" ADD CONSTRAINT "gather_sessions_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
