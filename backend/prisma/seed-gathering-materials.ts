import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGatheringMaterials() {
  console.log('🌲 Adding gathering materials to item database...');

  const materials = [
    // Ores
    {
      code: 'copper_ore',
      name: 'Minério de Cobre',
      description: 'Minério de cobre bruto, útil para fundição',
      type: 'material' as any,
      baseValue: 8,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
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
      code: 'mythril_ore',
      name: 'Minério de Mithril',
      description: 'Raro minério lendário de cor prateada',
      type: 'material' as any,
      baseValue: 200,
      maxStack: 999,
      attributes: { rarity: 'rare' },
      isTradeable: true,
      isCraftable: false,
    },
    
    // Herbs
    {
      code: 'herb',
      name: 'Erva',
      description: 'Erva medicinal básica para poções',
      type: 'material' as any,
      baseValue: 3,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
    
    // Crystals & Magic
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
      description: 'Essência pura de magia concentrada',
      type: 'material' as any,
      baseValue: 40,
      maxStack: 999,
      attributes: { rarity: 'uncommon' },
      isTradeable: true,
      isCraftable: false,
    },
    
    // Leather & Rare
    {
      code: 'cloth',
      name: 'Tecido',
      description: 'Tecido básico de fibras naturais',
      type: 'material' as any,
      baseValue: 6,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'dragon_scale',
      name: 'Escama de Dragão',
      description: 'Escama extremamente rara de dragão ancião',
      type: 'material' as any,
      baseValue: 500,
      maxStack: 999,
      attributes: { rarity: 'epic' },
      isTradeable: true,
      isCraftable: false,
    },
  ];

  let created = 0;
  let updated = 0;

  for (const material of materials) {
    const existing = await prisma.item.findUnique({
      where: { code: material.code },
    });

    if (existing) {
      await prisma.item.update({
        where: { code: material.code },
        data: material as any,
      });
      updated++;
      console.log(`🔄 Updated: ${material.name}`);
    } else {
      await prisma.item.create({
        data: material as any,
      });
      created++;
      console.log(`✅ Created: ${material.name}`);
    }
  }

  const count = await prisma.item.count();
  console.log(`\n📦 Summary:`);
  console.log(`  - Created: ${created} new items`);
  console.log(`  - Updated: ${updated} existing items`);
  console.log(`  - Total items in database: ${count}`);
  console.log('\n✅ All gathering materials ready!');
}

seedGatheringMaterials()
  .catch((e) => {
    console.error('❌ Error seeding gathering materials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
