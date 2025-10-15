-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('weapon', 'armor', 'material', 'consumable');

-- CreateEnum
CREATE TYPE "EquipmentSlot" AS ENUM ('weapon', 'head', 'torso', 'legs', 'feet');

-- CreateEnum
CREATE TYPE "BattleResult" AS ENUM ('victory', 'defeat', 'flee');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" BIGINT NOT NULL DEFAULT 0,
    "gold" BIGINT NOT NULL DEFAULT 100,
    "hp" INTEGER NOT NULL DEFAULT 50,
    "max_hp" INTEGER NOT NULL DEFAULT 50,
    "head_variant" TEXT NOT NULL,
    "arms_variant" TEXT NOT NULL,
    "legs_variant" TEXT NOT NULL,
    "feet_variant" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_stats" (
    "character_id" INTEGER NOT NULL,
    "str" INTEGER NOT NULL DEFAULT 5,
    "agi" INTEGER NOT NULL DEFAULT 5,
    "vit" INTEGER NOT NULL DEFAULT 5,
    "int" INTEGER NOT NULL DEFAULT 5,
    "def" INTEGER NOT NULL DEFAULT 2,
    "total_str" INTEGER NOT NULL DEFAULT 5,
    "total_agi" INTEGER NOT NULL DEFAULT 5,
    "total_vit" INTEGER NOT NULL DEFAULT 5,
    "total_int" INTEGER NOT NULL DEFAULT 5,
    "total_def" INTEGER NOT NULL DEFAULT 2,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_stats_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ItemType" NOT NULL,
    "slot" "EquipmentSlot",
    "base_value" INTEGER NOT NULL DEFAULT 0,
    "max_stack" INTEGER NOT NULL DEFAULT 1,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "image_path" TEXT,
    "is_tradeable" BOOLEAN NOT NULL DEFAULT true,
    "is_craftable" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "acquired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "character_id" INTEGER NOT NULL,
    "slot" "EquipmentSlot" NOT NULL,
    "inventory_id" INTEGER,
    "equipped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("character_id","slot")
);

-- CreateTable
CREATE TABLE "battles" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "enemy_code" TEXT NOT NULL,
    "enemy_name" TEXT,
    "enemy_level" INTEGER,
    "result" "BattleResult" NOT NULL,
    "turns_count" INTEGER NOT NULL DEFAULT 0,
    "battle_log" JSONB,
    "xp_gained" INTEGER NOT NULL DEFAULT 0,
    "gold_gained" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_ms" INTEGER,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_config" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_config_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "characters"("name");

-- CreateIndex
CREATE INDEX "characters_user_id_idx" ON "characters"("user_id");

-- CreateIndex
CREATE INDEX "characters_name_idx" ON "characters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "items_code_key" ON "items"("code");

-- CreateIndex
CREATE INDEX "items_code_idx" ON "items"("code");

-- CreateIndex
CREATE INDEX "items_type_idx" ON "items"("type");

-- CreateIndex
CREATE INDEX "inventory_character_id_idx" ON "inventory"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_character_id_item_id_key" ON "inventory"("character_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_inventory_id_key" ON "equipment"("inventory_id");

-- CreateIndex
CREATE INDEX "battles_character_id_idx" ON "battles"("character_id");

-- CreateIndex
CREATE INDEX "battles_started_at_idx" ON "battles"("started_at");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_stats" ADD CONSTRAINT "character_stats_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
