import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllCraftableItems() {
  console.log('🔨 Adding ALL craftable result items...');

  const items = [
    // WEAPONS
    {
      code: 'sword_iron',
      name: 'Espada de Ferro',
      description: 'Espada básica de ferro',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 50,
      maxStack: 1,
      attributes: { rarity: 'common', str: 10, agi: 0, def: 0 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'sword_steel',
      name: 'Espada de Aço',
      description: 'Espada refinada de aço',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 200,
      maxStack: 1,
      attributes: { rarity: 'uncommon', str: 20, agi: 5, def: 0 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'sword_mythril',
      name: 'Espada de Mithril',
      description: 'Espada lendária de mithril',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 1000,
      maxStack: 1,
      attributes: { rarity: 'rare', str: 35, agi: 10, def: 3 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // ARMORS
    {
      code: 'armor_leather',
      name: 'Armadura de Couro',
      description: 'Armadura básica de couro',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 40,
      maxStack: 1,
      attributes: { rarity: 'common', str: 0, agi: 2, vit: 5, def: 8 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'armor_chainmail',
      name: 'Cota de Malha',
      description: 'Armadura de anéis de ferro',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 150,
      maxStack: 1,
      attributes: { rarity: 'uncommon', str: 2, agi: -2, vit: 8, def: 15 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'armor_plate',
      name: 'Armadura de Placas',
      description: 'Armadura pesada de aço',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 600,
      maxStack: 1,
      attributes: { rarity: 'rare', str: 5, agi: -5, vit: 15, def: 30 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // HELMETS
    {
      code: 'helmet_iron',
      name: 'Elmo de Ferro',
      description: 'Proteção básica para cabeça',
      type: 'armor' as any,
      slot: 'head' as any,
      baseValue: 50,
      maxStack: 1,
      attributes: { rarity: 'common', str: 0, def: 5 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'helmet_steel',
      name: 'Elmo de Aço',
      description: 'Elmo reforçado de aço',
      type: 'armor' as any,
      slot: 'head' as any,
      baseValue: 200,
      maxStack: 1,
      attributes: { rarity: 'uncommon', str: 2, def: 10 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // SHIELDS
    {
      code: 'shield_wooden',
      name: 'Escudo de Madeira',
      description: 'Escudo básico de madeira',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 30,
      maxStack: 1,
      attributes: { rarity: 'common', def: 5, vit: 2 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'shield_iron',
      name: 'Escudo de Ferro',
      description: 'Escudo sólido de ferro',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 120,
      maxStack: 1,
      attributes: { rarity: 'uncommon', def: 12, vit: 5 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // BOOTS
    {
      code: 'boots_leather',
      name: 'Botas de Couro',
      description: 'Botas confortáveis',
      type: 'armor' as any,
      slot: 'feet' as any,
      baseValue: 25,
      maxStack: 1,
      attributes: { rarity: 'common', agi: 3, def: 3 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'boots_iron',
      name: 'Botas de Ferro',
      description: 'Botas pesadas',
      type: 'armor' as any,
      slot: 'feet' as any,
      baseValue: 80,
      maxStack: 1,
      attributes: { rarity: 'uncommon', agi: -1, def: 8, vit: 3 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // GLOVES
    {
      code: 'gloves_leather',
      name: 'Luvas de Couro',
      description: 'Luvas flexíveis',
      type: 'armor' as any,
      slot: 'legs' as any,
      baseValue: 20,
      maxStack: 1,
      attributes: { rarity: 'common', agi: 2, str: 1 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'gloves_steel',
      name: 'Manoplas de Aço',
      description: 'Luvas blindadas',
      type: 'armor' as any,
      slot: 'legs' as any,
      baseValue: 100,
      maxStack: 1,
      attributes: { rarity: 'uncommon', str: 5, def: 5 },
      isTradeable: true,
      isCraftable: true,
    },
    
    // POTIONS
    {
      code: 'potion_hp_small',
      name: 'Poção Pequena de HP',
      description: 'Restaura 20 HP',
      type: 'consumable' as any,
      baseValue: 10,
      maxStack: 99,
      attributes: { rarity: 'common', healAmount: 20 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'potion_hp_medium',
      name: 'Poção Média de HP',
      description: 'Restaura 50 HP',
      type: 'consumable' as any,
      baseValue: 30,
      maxStack: 99,
      attributes: { rarity: 'uncommon', healAmount: 50 },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'potion_hp_large',
      name: 'Poção Grande de HP',
      description: 'Restaura 100 HP',
      type: 'consumable' as any,
      baseValue: 80,
      maxStack: 99,
      attributes: { rarity: 'rare', healAmount: 100 },
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
    console.log(`✅ ${item.name}`);
  }

  const count = await prisma.item.count();
  console.log(`\n📦 Total items in database: ${count}`);
  console.log('✅ All craftable items ready!');
}

seedAllCraftableItems()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
