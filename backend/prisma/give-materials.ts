import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function giveMaterials() {
  try {
    const characterId = 2; // BonecoTeste

    // Get items
    const ironOre = await prisma.item.findFirst({ where: { code: 'iron_ore' } });
    const wood = await prisma.item.findFirst({ where: { code: 'wood' } });

    if (!ironOre || !wood) {
      console.log('❌ Items not found!');
      return;
    }

    // Give iron ore
    await prisma.inventory.upsert({
      where: {
        characterId_itemId: {
          characterId,
          itemId: ironOre.id
        }
      },
      update: {
        quantity: 20
      },
      create: {
        characterId,
        itemId: ironOre.id,
        quantity: 20
      }
    });

    // Give wood
    await prisma.inventory.upsert({
      where: {
        characterId_itemId: {
          characterId,
          itemId: wood.id
        }
      },
      update: {
        quantity: 10
      },
      create: {
        characterId,
        itemId: wood.id,
        quantity: 10
      }
    });

    console.log('✅ Materials given:');
    console.log('  - Iron Ore x20');
    console.log('  - Wood x10');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

giveMaterials();
