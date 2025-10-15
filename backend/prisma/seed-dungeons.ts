import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDungeons() {
  console.log('🏰 Seeding dungeons...');

  // Get enemies by code (using existing enemies from database)
  const slime = await prisma.enemy.findUnique({ where: { code: 'slime_green' } });
  const wolf = await prisma.enemy.findUnique({ where: { code: 'wolf_gray' } });
  const goblin = await prisma.enemy.findUnique({ where: { code: 'goblin_scout' } });
  const skeleton = await prisma.enemy.findUnique({ where: { code: 'skeleton_warrior' } });
  const orc = await prisma.enemy.findUnique({ where: { code: 'orc_brute' } });
  const bandit = await prisma.enemy.findUnique({ where: { code: 'bandit_leader' } });
  const mage = await prisma.enemy.findUnique({ where: { code: 'dark_mage' } });
  const golem = await prisma.enemy.findUnique({ where: { code: 'golem_stone' } });
  const vampire = await prisma.enemy.findUnique({ where: { code: 'vampire_noble' } });
  const dragon = await prisma.enemy.findUnique({ where: { code: 'dragon_ancient' } });

  if (!slime || !wolf || !goblin || !skeleton || !orc || !bandit || !mage || !golem || !vampire || !dragon) {
    console.error('❌ Some enemies not found!');
    return;
  }

  // DUNGEON 1: Caverna dos Goblins
  console.log('Creating Caverna dos Goblins...');
  const dungeon1 = await prisma.dungeon.upsert({
    where: { code: 'goblin_cave' },
    update: {},
    create: {
      code: 'goblin_cave',
      name: 'Caverna dos Goblins',
      description: 'Uma caverna escura infestada de goblins. Dizem que seu líder possui um tesouro valioso.',
      recommendedLevel: 5,
      maxFloors: 5,
      cooldownHours: 24,
    },
  });

  await prisma.dungeonFloor.createMany({
    data: [
      {
        dungeonId: dungeon1.id,
        floorNumber: 1,
        isBoss: false,
        enemyId: goblin.id,
        enemyCount: 3,
        goldReward: 50,
        expReward: 100,
        itemDrops: [
          { itemId: 1, quantity: 1 }, // Iron Ore
        ],
      },
      {
        dungeonId: dungeon1.id,
        floorNumber: 2,
        isBoss: false,
        enemyId: goblin.id,
        enemyCount: 4,
        goldReward: 75,
        expReward: 150,
        itemDrops: [
          { itemId: 2, quantity: 2 }, // Wood
        ],
      },
      {
        dungeonId: dungeon1.id,
        floorNumber: 3,
        isBoss: false,
        enemyId: goblin.id,
        enemyCount: 5,
        goldReward: 100,
        expReward: 200,
        itemDrops: [
          { itemId: 3, quantity: 1 }, // Leather
        ],
      },
      {
        dungeonId: dungeon1.id,
        floorNumber: 4,
        isBoss: false,
        enemyId: goblin.id,
        enemyCount: 6,
        goldReward: 125,
        expReward: 250,
        itemDrops: [
          { itemId: 7, quantity: 2 }, // Crystal
        ],
      },
      {
        dungeonId: dungeon1.id,
        floorNumber: 5,
        isBoss: true,
        enemyId: goblin.id, // Goblin King (represented by stronger goblin)
        enemyCount: 1,
        goldReward: 500,
        expReward: 1000,
        itemDrops: [
          { itemId: 10, quantity: 1 }, // Iron Sword
        ],
      },
    ],
    skipDuplicates: true,
  });

  // DUNGEON 2: Floresta Amaldiçoada
  console.log('Creating Floresta Amaldiçoada...');
  const dungeon2 = await prisma.dungeon.upsert({
    where: { code: 'cursed_forest' },
    update: {},
    create: {
      code: 'cursed_forest',
      name: 'Floresta Amaldiçoada',
      description: 'Uma floresta sombria onde criaturas selvagens e mortos-vivos vagam livremente.',
      recommendedLevel: 10,
      maxFloors: 7,
      cooldownHours: 24,
    },
  });

  await prisma.dungeonFloor.createMany({
    data: [
      {
        dungeonId: dungeon2.id,
        floorNumber: 1,
        isBoss: false,
        enemyId: wolf.id,
        enemyCount: 2,
        goldReward: 75,
        expReward: 150,
        itemDrops: [
          { itemId: 3, quantity: 2 }, // Leather
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 2,
        isBoss: false,
        enemyId: wolf.id,
        enemyCount: 3,
        goldReward: 100,
        expReward: 200,
        itemDrops: [
          { itemId: 5, quantity: 1 }, // Herb
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 3,
        isBoss: false,
        enemyId: orc.id,
        enemyCount: 1,
        goldReward: 125,
        expReward: 250,
        itemDrops: [
          { itemId: 3, quantity: 3 }, // Leather
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 4,
        isBoss: false,
        enemyId: wolf.id,
        enemyCount: 2,
        goldReward: 150,
        expReward: 300,
        itemDrops: [
          { itemId: 8, quantity: 1 }, // Magic Essence
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 5,
        isBoss: false,
        enemyId: skeleton.id,
        enemyCount: 3,
        goldReward: 175,
        expReward: 350,
        itemDrops: [
          { itemId: 9, quantity: 1 }, // Dragon Scale
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 6,
        isBoss: false,
        enemyId: bandit.id,
        enemyCount: 2,
        goldReward: 200,
        expReward: 400,
        itemDrops: [
          { itemId: 11, quantity: 1 }, // Steel Sword
        ],
      },
      {
        dungeonId: dungeon2.id,
        floorNumber: 7,
        isBoss: true,
        enemyId: mage.id, // Cursed Treant (represented by Dark Mage)
        enemyCount: 1,
        goldReward: 750,
        expReward: 1500,
        itemDrops: [
          { itemId: 17, quantity: 1 }, // Legendary Blade
        ],
      },
    ],
    skipDuplicates: true,
  });

  // DUNGEON 3: Cripta Esquecida
  console.log('Creating Cripta Esquecida...');
  const dungeon3 = await prisma.dungeon.upsert({
    where: { code: 'forgotten_crypt' },
    update: {},
    create: {
      code: 'forgotten_crypt',
      name: 'Cripta Esquecida',
      description: 'Uma antiga cripta repleta de mortos-vivos. O Lich Lord aguarda no final.',
      recommendedLevel: 15,
      maxFloors: 8,
      cooldownHours: 24,
    },
  });

  await prisma.dungeonFloor.createMany({
    data: [
      {
        dungeonId: dungeon3.id,
        floorNumber: 1,
        isBoss: false,
        enemyId: skeleton.id,
        enemyCount: 3,
        goldReward: 100,
        expReward: 200,
        itemDrops: [
          { itemId: 1, quantity: 3 }, // Iron Ore
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 2,
        isBoss: false,
        enemyId: orc.id,
        enemyCount: 2,
        goldReward: 125,
        expReward: 250,
        itemDrops: [
          { itemId: 6, quantity: 2 }, // Cloth
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 3,
        isBoss: false,
        enemyId: skeleton.id,
        enemyCount: 4,
        goldReward: 150,
        expReward: 300,
        itemDrops: [
          { itemId: 7, quantity: 2 }, // Crystal
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 4,
        isBoss: false,
        enemyId: golem.id,
        enemyCount: 2,
        goldReward: 175,
        expReward: 350,
        itemDrops: [
          { itemId: 8, quantity: 2 }, // Magic Essence
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 5,
        isBoss: false,
        enemyId: skeleton.id,
        enemyCount: 5,
        goldReward: 200,
        expReward: 400,
        itemDrops: [
          { itemId: 13, quantity: 1 }, // Magic Staff
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 6,
        isBoss: false,
        enemyId: mage.id,
        enemyCount: 2,
        goldReward: 225,
        expReward: 450,
        itemDrops: [
          { itemId: 12, quantity: 1 }, // Mithril Armor
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 7,
        isBoss: false,
        enemyId: vampire.id,
        enemyCount: 2,
        goldReward: 250,
        expReward: 500,
        itemDrops: [
          { itemId: 14, quantity: 1 }, // Elven Bow
        ],
      },
      {
        dungeonId: dungeon3.id,
        floorNumber: 8,
        isBoss: true,
        enemyId: dragon.id, // Lich Lord (represented by Dragon)
        enemyCount: 1,
        goldReward: 1000,
        expReward: 2000,
        itemDrops: [
          { itemId: 19, quantity: 1 }, // Mythic Armor
        ],
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Dungeons seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('- Caverna dos Goblins (Lv 5, 5 floors)');
  console.log('- Floresta Amaldiçoada (Lv 10, 7 floors)');
  console.log('- Cripta Esquecida (Lv 15, 8 floors)');
  console.log('');
}

seedDungeons()
  .catch((e) => {
    console.error('Error seeding dungeons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
