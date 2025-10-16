import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing gathering items...');

  // Items needed by gathering system
  const gatheringItems = [
    // Woods
    {
      code: 'wood',
      name: 'Madeira',
      description: 'Madeira comum para construção',
      type: 'material' as any,
      baseValue: 2,
      maxStack: 999,
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
      isTradeable: true,
      isCraftable: false,
    },
    
    // Ores
    {
      code: 'iron_ore',
      name: 'Minério de Ferro',
      description: 'Minério bruto de ferro',
      type: 'material' as any,
      baseValue: 5,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'copper_ore',
      name: 'Minério de Cobre',
      description: 'Minério bruto de cobre',
      type: 'material' as any,
      baseValue: 3,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'coal',
      name: 'Carvão',
      description: 'Carvão mineral para combustível',
      type: 'material' as any,
      baseValue: 4,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'mythril_ore',
      name: 'Minério de Mithril',
      description: 'Minério raro e precioso',
      type: 'material' as any,
      baseValue: 20,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    
    // Cloth
    {
      code: 'cloth',
      name: 'Tecido',
      description: 'Tecido básico para confecção',
      type: 'material' as any,
      baseValue: 3,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    
    // Leather
    {
      code: 'leather',
      name: 'Couro',
      description: 'Couro de animal para armaduras',
      type: 'material' as any,
      baseValue: 4,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    
    // Magic Items
    {
      code: 'magic_essence',
      name: 'Essência Mágica',
      description: 'Essência pura de magia',
      type: 'material' as any,
      baseValue: 10,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'crystal',
      name: 'Cristal',
      description: 'Cristal mágico raro',
      type: 'material' as any,
      baseValue: 15,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
    
    // Dragon Items
    {
      code: 'dragon_scale',
      name: 'Escama de Dragão',
      description: 'Escama resistente de dragão',
      type: 'material' as any,
      baseValue: 50,
      maxStack: 999,
      isTradeable: true,
      isCraftable: false,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const itemData of gatheringItems) {
    const existing = await prisma.item.findUnique({
      where: { code: itemData.code },
    });

    if (existing) {
      console.log(`  ⏩ Item já existe: ${itemData.code}`);
      skipped++;
    } else {
      await prisma.item.create({
        data: itemData as any,
      });
      console.log(`  ✅ Criado: ${itemData.code} - ${itemData.name}`);
      created++;
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`  ✅ Criados: ${created}`);
  console.log(`  ⏩ Já existiam: ${skipped}`);
  console.log(`  📦 Total: ${gatheringItems.length}`);
  console.log('\n✅ Items de gathering prontos!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
