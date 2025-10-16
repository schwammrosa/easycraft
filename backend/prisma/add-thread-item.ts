import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addThreadItem() {
  console.log('Adding Thread item...');

  const thread = await prisma.item.upsert({
    where: { code: 'thread' },
    update: {},
    create: {
      code: 'thread',
      name: 'Linha',
      description: 'Linha resistente para costura',
      type: 'material',
      baseValue: 2,
      maxStack: 999,
      isTradeable: true,
      isCraftable: true
    }
  });

  console.log('✅ Thread item created:', thread);

  // Now give it to character 2
  await prisma.inventory.upsert({
    where: {
      characterId_itemId: {
        characterId: 2,
        itemId: thread.id
      }
    },
    update: {
      quantity: 50
    },
    create: {
      characterId: 2,
      itemId: thread.id,
      quantity: 50
    }
  });

  console.log('✅ Thread x50 given to character 2');

  await prisma.$disconnect();
}

addThreadItem();
