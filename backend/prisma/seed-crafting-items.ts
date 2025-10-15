import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCraftingItems() {
  console.log('🎨 Seeding crafting-related items...');

  const items = [
    // Materials
    {
      code: 'thread',
      name: 'Linha',
      description: 'Linha resistente para costura',
      type: 'material' as any,
      baseValue: 1,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'cloth',
      name: 'Tecido',
      description: 'Tecido bruto',
      type: 'material' as any,
      baseValue: 2,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: false,
    },
    {
      code: 'iron_bar',
      name: 'Barra de Ferro',
      description: 'Ferro fundido',
      type: 'material' as any,
      baseValue: 15,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'leather_refined',
      name: 'Couro Refinado',
      description: 'Couro de qualidade',
      type: 'material' as any,
      baseValue: 20,
      maxStack: 999,
      attributes: { rarity: 'common' },
      isTradeable: true,
      isCraftable: true,
    },
    // Enhancement
    {
      code: 'enhancement_weapon',
      name: 'Cristal de Arma',
      description: '+5 STR permanente',
      type: 'consumable' as any,
      baseValue: 500,
      maxStack: 99,
      attributes: { rarity: 'epic' },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'enhancement_armor',
      name: 'Cristal de Armadura',
      description: '+5 DEF permanente',
      type: 'consumable' as any,
      baseValue: 500,
      maxStack: 99,
      attributes: { rarity: 'epic' },
      isTradeable: true,
      isCraftable: true,
    },
    // Legendary
    {
      code: 'sword_legendary',
      name: 'Espada Lendária',
      description: 'Poder incomparável',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 5000,
      maxStack: 1,
      attributes: { rarity: 'legendary', str: 50, agi: 20, def: 5 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'armor_dragon',
      name: 'Armadura de Dragão',
      description: 'Escamas de dragão',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 7500,
      maxStack: 1,
      attributes: { rarity: 'legendary', str: 10, agi: -5, vit: 30, def: 80 },
      isTradeable: true,
      isCraftable: true,
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { code: item.code },
      update: item as any,
      create: item as any,
    });
  }

  const count = await prisma.item.count();
  console.log(`✅ Crafting items added! Total items in database: ${count}`);
}

seedCraftingItems()
  .catch((e) => {
    console.error('❌ Error seeding crafting items:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
