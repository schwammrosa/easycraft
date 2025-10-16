import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAllMissingItems() {
  console.log('📦 Adding all missing craftable items...\n');

  const items = [
    // Shields (weapon slot alternativo)
    {
      code: 'shield_wooden',
      name: 'Escudo de Madeira',
      description: 'Escudo básico feito de madeira reforçada',
      type: 'armor' as any,
      slot: 'weapon' as any,
      baseValue: 25,
      maxStack: 1,
      attributes: { defense: 3 },
      isTradeable: true,
      isCraftable: true
    },
    {
      code: 'shield_iron',
      name: 'Escudo de Ferro',
      description: 'Escudo sólido de ferro puro',
      type: 'armor' as any,
      slot: 'weapon' as any,
      baseValue: 80,
      maxStack: 1,
      attributes: { defense: 8 },
      isTradeable: true,
      isCraftable: true
    },
    
    // Gloves (feet slot alternativo)
    {
      code: 'gloves_leather',
      name: 'Luvas de Couro',
      description: 'Luvas flexíveis de couro',
      type: 'armor' as any,
      slot: 'feet' as any,
      baseValue: 15,
      maxStack: 1,
      attributes: { defense: 2 },
      isTradeable: true,
      isCraftable: true
    },
    {
      code: 'gloves_steel',
      name: 'Manoplas de Aço',
      description: 'Luvas blindadas de aço',
      type: 'armor' as any,
      slot: 'feet' as any,
      baseValue: 70,
      maxStack: 1,
      attributes: { defense: 6 },
      isTradeable: true,
      isCraftable: true
    },
    
    // Materials
    {
      code: 'iron_bar',
      name: 'Barra de Ferro',
      description: 'Ferro puro fundido em barra',
      type: 'material' as any,
      baseValue: 12,
      maxStack: 999,
      attributes: {},
      isTradeable: true,
      isCraftable: true
    },
    {
      code: 'leather_refined',
      name: 'Couro Refinado',
      description: 'Couro de alta qualidade curtido',
      type: 'material' as any,
      baseValue: 15,
      maxStack: 999,
      attributes: {},
      isTradeable: true,
      isCraftable: true
    },
    
    // Enhancements (material type)
    {
      code: 'enhancement_weapon',
      name: 'Cristal de Aprimoramento de Arma',
      description: 'Melhora permanentemente os atributos de uma arma',
      type: 'material' as any,
      baseValue: 250,
      maxStack: 99,
      attributes: { attackBonus: 5 },
      isTradeable: true,
      isCraftable: true
    },
    {
      code: 'enhancement_armor',
      name: 'Cristal de Aprimoramento de Armadura',
      description: 'Melhora permanentemente os atributos de uma armadura',
      type: 'material' as any,
      baseValue: 250,
      maxStack: 99,
      attributes: { defenseBonus: 5 },
      isTradeable: true,
      isCraftable: true
    },
    
    // Legendary Weapons
    {
      code: 'sword_mythril',
      name: 'Espada de Mithril',
      description: 'Uma espada leve e poderosa feita do lendário mithril',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 600,
      maxStack: 1,
      attributes: { attack: 35, critChance: 0.15 },
      isTradeable: true,
      isCraftable: true
    },
    {
      code: 'sword_legendary',
      name: 'Espada Lendária',
      description: 'Uma arma de poder incomparável',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 1200,
      maxStack: 1,
      attributes: { attack: 50, critChance: 0.25, critDamage: 2.0 },
      isTradeable: true,
      isCraftable: true
    },
    
    // Legendary Armor
    {
      code: 'armor_dragon',
      name: 'Armadura de Dragão',
      description: 'Armadura forjada com escamas de dragão',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 1800,
      maxStack: 1,
      attributes: { defense: 40, fireResist: 0.5 },
      isTradeable: true,
      isCraftable: true
    }
  ];

  for (const item of items) {
    const created = await prisma.item.upsert({
      where: { code: item.code },
      update: {},
      create: item
    });
    
    console.log(`✅ ${created.name} (${created.code})`);
  }

  console.log(`\n🎉 All ${items.length} missing items created!`);
  
  await prisma.$disconnect();
}

addAllMissingItems();
