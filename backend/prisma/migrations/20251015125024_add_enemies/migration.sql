-- CreateTable
CREATE TABLE "enemies" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "str" INTEGER NOT NULL,
    "agi" INTEGER NOT NULL,
    "def" INTEGER NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "gold_reward" INTEGER NOT NULL,
    "drop_table" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enemies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enemies_code_key" ON "enemies"("code");

-- CreateIndex
CREATE INDEX "enemies_level_idx" ON "enemies"("level");
