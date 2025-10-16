import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding quests and crafting...');

  // Clear and seed quests
  await prisma.quest.deleteMany({});
  const quests = await prisma.quest.createMany({
    data: [
      {
        code: 'tutorial_combat',
        name: 'Primeiro Combate',
        description: 'Derrote 3 Slimes para ganhar experiência',
        type: 'kill_enemies',
        targetAmount: 3,
        targetData: JSON.stringify({ enemyCode: 'slime' }),
        xpReward: 50,
        goldReward: 25,
        requiredLevel: 1,
        isRepeatable: false,
      },
      {
        code: 'goblin_threat',
        name: 'Ameaça Goblin',
        description: 'Elimine 5 Goblins que ameaçam a vila',
        type: 'kill_enemies',
        targetAmount: 5,
        targetData: JSON.stringify({ enemyCode: 'goblin' }),
        xpReward: 150,
        goldReward: 75,
        requiredLevel: 3,
        isRepeatable: true,
      },
      {
        code: 'collect_herbs',
        name: 'Coleta de Ervas',
        description: 'Colete 10 ervas medicinais',
        type: 'collect_items',
        targetAmount: 10,
        targetData: JSON.stringify({ itemCode: 'herb' }),
        xpReward: 75,
        goldReward: 50,
        itemRewards: JSON.stringify([{ itemCode: 'potion_health', quantity: 2 }]),
        requiredLevel: 1,
        isRepeatable: true,
      },
    ],
  });
  console.log(`✅ Created ${quests.count} quests`);

  // Clear and seed crafting recipes
  await prisma.craftingRecipe.deleteMany({});
  const recipes = await prisma.craftingRecipe.createMany({
    data: [
      {
        code: 'craft_iron_sword',
        name: 'Forjar Espada de Ferro',
        category: 'weapon',
        resultItemCode: 'sword_iron',
        resultQuantity: 1,
        ingredients: JSON.stringify([{ itemCode: 'iron_ore', quantity: 5 }, { itemCode: 'wood', quantity: 2 }]),
        requiredLevel: 5,
        xpReward: 50,
      },
      {
        code: 'craft_health_potion',
        name: 'Preparar Poção de Vida',
        category: 'consumable',
        resultItemCode: 'potion_health',
        resultQuantity: 3,
        ingredients: JSON.stringify([{ itemCode: 'herb', quantity: 5 }]),
        requiredLevel: 1,
        xpReward: 20,
      },
      {
        code: 'craft_leather_armor',
        name: 'Criar Armadura de Couro',
        category: 'armor',
        resultItemCode: 'armor_leather',
        resultQuantity: 1,
        ingredients: JSON.stringify([{ itemCode: 'leather', quantity: 8 }]),
        requiredLevel: 3,
        xpReward: 40,
      },
    ],
  });
  console.log(`✅ Created ${recipes.count} crafting recipes`);

  console.log('✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
