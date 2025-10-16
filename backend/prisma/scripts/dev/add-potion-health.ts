import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addPotionHealth() {
  console.log('Adding potion_health item...');

  const potion = await prisma.item.upsert({
    where: { code: 'potion_health' },
    update: {},
    create: {
      code: 'potion_health',
      name: 'Poção de Vida',
      description: 'Restaura 30 HP',
      type: 'consumable',
      baseValue: 15,
      maxStack: 99,
      attributes: {
        healAmount: 30,
        usableInCombat: true
      },
      isTradeable: true,
      isCraftable: true
    }
  });

  console.log('✅ Potion created:', potion);

  await prisma.$disconnect();
}

addPotionHealth();
