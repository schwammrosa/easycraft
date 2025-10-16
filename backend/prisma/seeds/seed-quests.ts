import { PrismaClient, QuestType, QuestRarity } from '@prisma/client';

const prisma = new PrismaClient();

const quests = [
  // COMMON QUESTS - Iniciante
  {
    code: 'first_blood',
    name: 'Primeiro Sangue',
    description: 'Derrote seu primeiro inimigo',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.common,
    targetAmount: 1,
    xpReward: 50,
    goldReward: 25,
    itemRewards: JSON.stringify([{ itemCode: 'potion_hp_small', quantity: 2 }]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'slime_hunter',
    name: 'Caçador de Slimes',
    description: 'Derrote 5 Slimes Verdes',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.common,
    targetAmount: 5,
    targetData: JSON.stringify({ enemyCode: 'slime_green' }),
    xpReward: 100,
    goldReward: 50,
    itemRewards: JSON.stringify([{ itemCode: 'leather', quantity: 3 }]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'novice_warrior',
    name: 'Guerreiro Novato',
    description: 'Complete 3 batalhas',
    type: QuestType.complete_battles,
    rarity: QuestRarity.common,
    targetAmount: 3,
    xpReward: 75,
    goldReward: 40,
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'gear_up',
    name: 'Equipar-se',
    description: 'Equipe 3 itens diferentes',
    type: QuestType.equip_items,
    rarity: QuestRarity.common,
    targetAmount: 3,
    xpReward: 60,
    goldReward: 30,
    itemRewards: JSON.stringify([{ itemCode: 'potion_hp_small', quantity: 1 }]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  
  // RARE QUESTS - Intermediário
  {
    code: 'wolf_pack',
    name: 'Matilha de Lobos',
    description: 'Derrote 10 Lobos Cinzas',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.rare,
    targetAmount: 10,
    targetData: JSON.stringify({ enemyCode: 'wolf_gray' }),
    xpReward: 200,
    goldReward: 100,
    itemRewards: JSON.stringify([
      { itemCode: 'leather', quantity: 5 },
      { itemCode: 'potion_hp_medium', quantity: 2 },
    ]),
    isRepeatable: true,
    cooldownHours: 24,
    requiredLevel: 3,
  },
  {
    code: 'goblin_slayer',
    name: 'Exterminador de Goblins',
    description: 'Derrote 15 Goblins Batedores',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.rare,
    targetAmount: 15,
    targetData: JSON.stringify({ enemyCode: 'goblin_scout' }),
    xpReward: 250,
    goldReward: 125,
    itemRewards: JSON.stringify([{ itemCode: 'iron_ore', quantity: 8 }]),
    isRepeatable: true,
    cooldownHours: 24,
    requiredLevel: 5,
  },
  {
    code: 'level_5',
    name: 'Ascensão',
    description: 'Alcance o nível 5',
    type: QuestType.reach_level,
    rarity: QuestRarity.rare,
    targetAmount: 5,
    xpReward: 150,
    goldReward: 100,
    itemRewards: JSON.stringify([{ itemCode: 'sword_iron', quantity: 1 }]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'gold_rush',
    name: 'Corrida do Ouro',
    description: 'Acumule 500 de Gold',
    type: QuestType.earn_gold,
    rarity: QuestRarity.rare,
    targetAmount: 500,
    xpReward: 100,
    goldReward: 200,
    isRepeatable: false,
    requiredLevel: 3,
  },
  {
    code: 'battle_veteran',
    name: 'Veterano de Batalha',
    description: 'Complete 20 batalhas',
    type: QuestType.complete_battles,
    rarity: QuestRarity.rare,
    targetAmount: 20,
    xpReward: 300,
    goldReward: 150,
    itemRewards: JSON.stringify([{ itemCode: 'potion_hp_large', quantity: 3 }]),
    isRepeatable: false,
    requiredLevel: 5,
  },
  
  // EPIC QUESTS - Avançado
  {
    code: 'skeleton_war',
    name: 'Guerra dos Esqueletos',
    description: 'Derrote 25 Esqueletos',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.epic,
    targetAmount: 25,
    targetData: JSON.stringify({ enemyCode: 'skeleton_warrior' }),
    xpReward: 500,
    goldReward: 250,
    itemRewards: JSON.stringify([
      { itemCode: 'steel_ingot', quantity: 5 },
      { itemCode: 'crystal_shard', quantity: 3 },
    ]),
    isRepeatable: true,
    cooldownHours: 48,
    requiredLevel: 8,
  },
  {
    code: 'orc_invasion',
    name: 'Invasão Orc',
    description: 'Derrote 20 Orcs Guerreiros',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.epic,
    targetAmount: 20,
    targetData: JSON.stringify({ enemyCode: 'orc_warrior' }),
    xpReward: 600,
    goldReward: 300,
    itemRewards: JSON.stringify([{ itemCode: 'axe_steel', quantity: 1 }]),
    isRepeatable: true,
    cooldownHours: 48,
    requiredLevel: 10,
  },
  {
    code: 'level_10',
    name: 'Poder Superior',
    description: 'Alcance o nível 10',
    type: QuestType.reach_level,
    rarity: QuestRarity.epic,
    targetAmount: 10,
    xpReward: 400,
    goldReward: 300,
    itemRewards: JSON.stringify([
      { itemCode: 'armor_steel_chest', quantity: 1 },
      { itemCode: 'potion_hp_large', quantity: 5 },
    ]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'master_warrior',
    name: 'Mestre Guerreiro',
    description: 'Complete 50 batalhas',
    type: QuestType.complete_battles,
    rarity: QuestRarity.epic,
    targetAmount: 50,
    xpReward: 750,
    goldReward: 500,
    itemRewards: JSON.stringify([{ itemCode: 'elixir_hp_mega', quantity: 3 }]),
    isRepeatable: false,
    requiredLevel: 8,
  },
  {
    code: 'fully_equipped',
    name: 'Totalmente Equipado',
    description: 'Equipe um item em cada slot',
    type: QuestType.equip_items,
    rarity: QuestRarity.epic,
    targetAmount: 5,
    xpReward: 300,
    goldReward: 200,
    itemRewards: JSON.stringify([{ itemCode: 'crystal_shard', quantity: 5 }]),
    isRepeatable: false,
    requiredLevel: 5,
  },
  
  // LEGENDARY QUESTS - Endgame
  {
    code: 'bandit_king',
    name: 'Rei dos Bandidos',
    description: 'Derrote 30 Líderes dos Bandidos',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.legendary,
    targetAmount: 30,
    targetData: JSON.stringify({ enemyCode: 'bandit_leader' }),
    xpReward: 1000,
    goldReward: 500,
    itemRewards: JSON.stringify([
      { itemCode: 'sword_steel', quantity: 1 },
      { itemCode: 'crystal_shard', quantity: 10 },
    ]),
    isRepeatable: true,
    cooldownHours: 72,
    requiredLevel: 12,
  },
  {
    code: 'dark_mage_hunt',
    name: 'Caça ao Mago Sombrio',
    description: 'Derrote 15 Magos Sombrios',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.legendary,
    targetAmount: 15,
    targetData: JSON.stringify({ enemyCode: 'dark_mage' }),
    xpReward: 1200,
    goldReward: 600,
    itemRewards: JSON.stringify([{ itemCode: 'wand_arcane', quantity: 1 }]),
    isRepeatable: true,
    cooldownHours: 72,
    requiredLevel: 14,
  },
  {
    code: 'level_15',
    name: 'Lendário',
    description: 'Alcance o nível 15',
    type: QuestType.reach_level,
    rarity: QuestRarity.legendary,
    targetAmount: 15,
    xpReward: 800,
    goldReward: 600,
    itemRewards: JSON.stringify([
      { itemCode: 'helmet_wisdom', quantity: 1 },
      { itemCode: 'elixir_hp_mega', quantity: 10 },
    ]),
    isRepeatable: false,
    requiredLevel: 1,
  },
  {
    code: 'dragon_slayer',
    name: 'Matador de Dragões',
    description: 'Derrote 5 Dragões Ancestrais',
    type: QuestType.kill_enemies,
    rarity: QuestRarity.legendary,
    targetAmount: 5,
    targetData: JSON.stringify({ enemyCode: 'dragon_ancient' }),
    xpReward: 2000,
    goldReward: 1000,
    itemRewards: JSON.stringify([
      { itemCode: 'sword_steel', quantity: 1 },
      { itemCode: 'armor_steel_chest', quantity: 1 },
      { itemCode: 'crystal_shard', quantity: 20 },
    ]),
    isRepeatable: true,
    cooldownHours: 168, // 1 semana
    requiredLevel: 18,
  },
  {
    code: 'champion',
    name: 'Campeão Supremo',
    description: 'Complete 100 batalhas',
    type: QuestType.complete_battles,
    rarity: QuestRarity.legendary,
    targetAmount: 100,
    xpReward: 2500,
    goldReward: 1500,
    itemRewards: JSON.stringify([
      { itemCode: 'armor_mystic_robe', quantity: 1 },
      { itemCode: 'elixir_hp_mega', quantity: 10 },
    ]),
    isRepeatable: false,
    requiredLevel: 15,
  },
];

async function main() {
  console.log('🎯 Seeding quests...');

  // Clear existing quests
  await prisma.characterQuest.deleteMany({});
  await prisma.quest.deleteMany({});
  console.log('✅ Cleared existing quests');

  // Create quests
  for (const quest of quests) {
    await prisma.quest.create({ data: quest });
  }
  console.log(`✅ Created ${quests.length} quests`);

  console.log('🎯 Quests seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
