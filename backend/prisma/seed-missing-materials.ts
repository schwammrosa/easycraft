import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMissingMaterials() {
  console.log('🔨 Adding missing crafting materials...');

  const materials = [
    {
      code: 'coal',
      name: 'Carvão',
      description: 'Combustível para fundição',
      type: 'material' as any,
      baseValue: 5,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'herb',
      name: 'Erva',
      description: 'Erva medicinal básica',
      type: 'material' as any,
      baseValue: 3,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'crystal',
      name: 'Cristal',
      description: 'Cristal mágico energizado',
      type: 'material' as any,
      baseValue: 50,
      maxStack: 999,
      attributes: { rarity: 'uncommon' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'magic_essence',
      name: 'Essência Mágica',
      description: 'Essência pura de magia',
      type: 'material' as any,
      baseValue: 40,
      maxStack: 999,
      attributes: { rarity: 'uncommon' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'mythril_ore',
      name: 'Minério de Mithril',
      description: 'Raro minério lendário',
      type: 'material' as any,
      baseValue: 200,
      maxStack: 999,
      attributes: { rarity: 'rare' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'dragon_scale',
      name: 'Escama de Dragão',
      description: 'Escama de dragão ancião',
      type: 'material' as any,
      baseValue: 500,
      maxStack: 999,
      attributes: { rarity: 'epic' },
      isTradeable: true,
      isCraftable: false,
    },
  ];

  for (const material of materials) {
    await prisma.item.upsert({
      where: { code: material.code },
      update: material as any,
      create: material as any,
    });
    console.log(`✅ Added/Updated: ${material.name}`);
  }

  const count = await prisma.item.count();
  console.log(`\n📦 Total items in database: ${count}`);
  console.log('✅ All crafting materials ready!');
}

seedMissingMaterials()
  .catch((e) => {
    console.error('❌ Error seeding materials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
