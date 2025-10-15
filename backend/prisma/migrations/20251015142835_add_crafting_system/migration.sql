-- CreateEnum
CREATE TYPE "CraftingCategory" AS ENUM ('weapon', 'armor', 'consumable', 'material', 'enhancement');

-- CreateTable
CREATE TABLE "crafting_recipes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "CraftingCategory" NOT NULL,
    "result_item_code" TEXT NOT NULL,
    "result_quantity" INTEGER NOT NULL DEFAULT 1,
    "ingredients" JSONB NOT NULL,
    "required_level" INTEGER NOT NULL DEFAULT 1,
    "craft_time" INTEGER NOT NULL DEFAULT 0,
    "gold_cost" INTEGER NOT NULL DEFAULT 0,
    "xp_reward" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crafting_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crafting_recipes_code_key" ON "crafting_recipes"("code");

-- CreateIndex
CREATE INDEX "crafting_recipes_category_idx" ON "crafting_recipes"("category");

-- CreateIndex
CREATE INDEX "crafting_recipes_required_level_idx" ON "crafting_recipes"("required_level");
