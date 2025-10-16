import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestMaterials() {
  console.log('🎒 Giving test materials for crafting...\n');

  const characterId = 2; // BonecoTeste

  const materials = [
    // Basic materials
    { code: 'iron_ore', quantity: 100 },
    { code: 'wood', quantity: 50 },
    { code: 'leather', quantity: 50 },
    { code: 'thread', quantity: 50 },
    { code: 'coal', quantity: 30 },
    { code: 'herb', quantity: 50 },
    { code: 'cloth', quantity: 30 },
    
    // Intermediate materials
    { code: 'magic_essence', quantity: 30 },
    { code: 'crystal', quantity: 20 },
    
    // Advanced materials
    { code: 'mythril_ore', quantity: 20 },
    { code: 'dragon_scale', quantity: 15 },
  ];

  for (const material of materials) {
    const item = await prisma.item.findFirst({
      where: { code: material.code }
    });

    if (!item) {
      console.log(`⚠️  Item not found: ${material.code}`);
      continue;
    }

    await prisma.inventory.upsert({
      where: {
        characterId_itemId: {
          characterId,
          itemId: item.id
        }
      },
      update: {
        quantity: material.quantity
      },
      create: {
        characterId,
        itemId: item.id,
        quantity: material.quantity
      }
    });

    console.log(`✅ ${item.name.padEnd(25)} x${material.quantity}`);
  }

  // Give some gold for crafting costs
  await prisma.character.update({
    where: { id: characterId },
    data: { gold: 5000 }
  });

  console.log('\n💰 Gold updated: 5000');
  console.log('\n🎉 Test materials ready! You can now test all crafting recipes.');
}

seedTestMaterials()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
