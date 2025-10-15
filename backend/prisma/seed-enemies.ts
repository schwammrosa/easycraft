import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEnemies() {
  console.log('🐉 Seeding enemies...');

  // Clear existing enemies
  await prisma.enemy.deleteMany({});
  console.log('✅ Cleared existing enemies');

  // Create 10 enemies with progressive difficulty
  const enemies = await prisma.enemy.createMany({
    data: [
      // Level 1-5 (Iniciante)
      {
        code: 'slime_green',
        name: 'Slime Verde',
        description: 'Uma gosma verde inofensiva',
        level: 1,
        hp: 30,
        str: 3,
        agi: 2,
        def: 1,
        xpReward: 10,
        goldReward: 5,
        dropTable: JSON.stringify({
          'wood': { chance: 0.5, quantity: [1, 3] },
          'leather': { chance: 0.3, quantity: [1, 2] },
        }),
      },
      {
        code: 'wolf_gray',
        name: 'Lobo Cinza',
        description: 'Um lobo selvagem faminto',
        level: 3,
        hp: 50,
        str: 8,
        agi: 10,
        def: 3,
        xpReward: 25,
        goldReward: 12,
        dropTable: JSON.stringify({
          'leather': { chance: 0.7, quantity: [2, 4] },
          'potion_hp_small': { chance: 0.2, quantity: [1, 1] },
        }),
      },
      {
        code: 'goblin_scout',
        name: 'Goblin Batedor',
        description: 'Um goblin armado com adaga',
        level: 5,
        hp: 70,
        str: 12,
        agi: 15,
        def: 5,
        xpReward: 40,
        goldReward: 20,
        dropTable: JSON.stringify({
          'dagger_iron': { chance: 0.1, quantity: [1, 1] },
          'iron_ore': { chance: 0.5, quantity: [1, 3] },
          'potion_hp_small': { chance: 0.3, quantity: [1, 2] },
        }),
      },

      // Level 6-10 (Intermediário)
      {
        code: 'skeleton_warrior',
        name: 'Esqueleto Guerreiro',
        description: 'Ossos reanimados com espada enferrujada',
        level: 7,
        hp: 100,
        str: 18,
        agi: 8,
        def: 10,
        xpReward: 65,
        goldReward: 35,
        dropTable: JSON.stringify({
          'sword_iron': { chance: 0.15, quantity: [1, 1] },
          'helmet_iron': { chance: 0.2, quantity: [1, 1] },
          'potion_hp_medium': { chance: 0.25, quantity: [1, 1] },
        }),
      },
      {
        code: 'orc_brute',
        name: 'Orc Brutamontes',
        description: 'Um orc forte e agressivo',
        level: 9,
        hp: 140,
        str: 25,
        agi: 6,
        def: 15,
        xpReward: 90,
        goldReward: 50,
        dropTable: JSON.stringify({
          'axe_battle': { chance: 0.12, quantity: [1, 1] },
          'armor_chainmail': { chance: 0.15, quantity: [1, 1] },
          'steel_ingot': { chance: 0.4, quantity: [1, 2] },
        }),
      },
      {
        code: 'bandit_leader',
        name: 'Líder dos Bandidos',
        description: 'Um bandido experiente e perigoso',
        level: 10,
        hp: 160,
        str: 22,
        agi: 20,
        def: 12,
        xpReward: 110,
        goldReward: 70,
        dropTable: JSON.stringify({
          'bow_long': { chance: 0.18, quantity: [1, 1] },
          'tunic_ranger': { chance: 0.15, quantity: [1, 1] },
          'potion_hp_medium': { chance: 0.4, quantity: [2, 3] },
        }),
      },

      // Level 11-15 (Avançado)
      {
        code: 'dark_mage',
        name: 'Mago Sombrio',
        description: 'Um feiticeiro das trevas',
        level: 12,
        hp: 120,
        str: 10,
        agi: 18,
        def: 8,
        xpReward: 140,
        goldReward: 90,
        dropTable: JSON.stringify({
          'staff_mystic': { chance: 0.2, quantity: [1, 1] },
          'robe_mage': { chance: 0.18, quantity: [1, 1] },
          'magic_crystal': { chance: 0.5, quantity: [2, 4] },
          'elixir_agi': { chance: 0.2, quantity: [1, 1] },
        }),
      },
      {
        code: 'golem_stone',
        name: 'Golem de Pedra',
        description: 'Uma criatura maciça de pedra',
        level: 14,
        hp: 250,
        str: 30,
        agi: 3,
        def: 25,
        xpReward: 180,
        goldReward: 110,
        dropTable: JSON.stringify({
          'armor_plate': { chance: 0.12, quantity: [1, 1] },
          'greaves_steel': { chance: 0.15, quantity: [1, 1] },
          'steel_ingot': { chance: 0.6, quantity: [3, 5] },
        }),
      },
      {
        code: 'vampire_noble',
        name: 'Vampiro Nobre',
        description: 'Um vampiro aristocrata sedento por sangue',
        level: 15,
        hp: 200,
        str: 28,
        agi: 25,
        def: 18,
        xpReward: 220,
        goldReward: 150,
        dropTable: JSON.stringify({
          'sword_steel': { chance: 0.25, quantity: [1, 1] },
          'circlet_wisdom': { chance: 0.15, quantity: [1, 1] },
          'potion_hp_large': { chance: 0.3, quantity: [1, 2] },
          'elixir_str': { chance: 0.2, quantity: [1, 1] },
        }),
      },

      // Level 20 (Boss)
      {
        code: 'dragon_ancient',
        name: 'Dragão Ancestral',
        description: 'Um dragão lendário guardião de tesouros',
        level: 20,
        hp: 500,
        str: 45,
        agi: 30,
        def: 35,
        xpReward: 500,
        goldReward: 500,
        dropTable: JSON.stringify({
          'sword_steel': { chance: 0.8, quantity: [1, 1] },
          'armor_plate': { chance: 0.7, quantity: [1, 1] },
          'helmet_steel': { chance: 0.7, quantity: [1, 1] },
          'potion_hp_large': { chance: 0.9, quantity: [3, 5] },
          'magic_crystal': { chance: 0.8, quantity: [5, 10] },
          'steel_ingot': { chance: 0.9, quantity: [10, 15] },
        }),
      },
    ],
  });

  console.log(`✅ Created ${enemies.count} enemies`);
  console.log('🐉 Enemies seeded successfully!');
}

seedEnemies()
  .catch((e) => {
    console.error('❌ Error seeding enemies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
