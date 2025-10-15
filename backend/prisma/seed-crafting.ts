import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCrafting() {
  console.log('🔨 Seeding crafting recipes...');

  const recipes = [
    // =====================================================
    // WEAPONS - Basic Tier
    // =====================================================
    {
      code: 'craft_sword_iron',
      name: 'Forjar Espada de Ferro',
      description: 'Uma espada básica feita de ferro puro',
      category: 'weapon' as any,
      resultItemCode: 'sword_iron',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 5 },
        { itemCode: 'wood', quantity: 2 },
      ],
      requiredLevel: 1,
      goldCost: 20,
      xpReward: 10,
      successRate: 1.0,
    },
    {
      code: 'craft_sword_steel',
      name: 'Forjar Espada de Aço',
      description: 'Uma espada refinada de aço temperado',
      category: 'weapon' as any,
      resultItemCode: 'sword_steel',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 10 },
        { itemCode: 'coal', quantity: 3 },
        { itemCode: 'leather', quantity: 1 },
      ],
      requiredLevel: 5,
      goldCost: 100,
      xpReward: 50,
      successRate: 0.95,
    },
    {
      code: 'craft_sword_mythril',
      name: 'Forjar Espada de Mithril',
      description: 'Uma espada leve e poderosa feita do lendário mithril',
      category: 'weapon' as any,
      resultItemCode: 'sword_mythril',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'mythril_ore', quantity: 8 },
        { itemCode: 'dragon_scale', quantity: 2 },
        { itemCode: 'magic_essence', quantity: 3 },
      ],
      requiredLevel: 10,
      goldCost: 500,
      xpReward: 200,
      successRate: 0.85,
    },

    // =====================================================
    // ARMOR - Basic to Epic
    // =====================================================
    {
      code: 'craft_armor_leather',
      name: 'Costurar Armadura de Couro',
      description: 'Armadura básica feita de couro curtido',
      category: 'armor' as any,
      resultItemCode: 'armor_leather',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'leather', quantity: 8 },
        { itemCode: 'thread', quantity: 5 },
      ],
      requiredLevel: 1,
      goldCost: 15,
      xpReward: 8,
      successRate: 1.0,
    },
    {
      code: 'craft_armor_chainmail',
      name: 'Forjar Cota de Malha',
      description: 'Armadura de anéis de ferro entrelaçados',
      category: 'armor' as any,
      resultItemCode: 'armor_chainmail',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 12 },
        { itemCode: 'leather', quantity: 4 },
        { itemCode: 'thread', quantity: 3 },
      ],
      requiredLevel: 4,
      goldCost: 80,
      xpReward: 40,
      successRate: 0.95,
    },
    {
      code: 'craft_armor_plate',
      name: 'Forjar Armadura de Placas',
      description: 'Armadura pesada de placas de aço',
      category: 'armor' as any,
      resultItemCode: 'armor_plate',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 20 },
        { itemCode: 'coal', quantity: 5 },
        { itemCode: 'leather', quantity: 6 },
      ],
      requiredLevel: 7,
      goldCost: 300,
      xpReward: 120,
      successRate: 0.90,
    },

    // =====================================================
    // HELMETS
    // =====================================================
    {
      code: 'craft_helmet_iron',
      name: 'Forjar Elmo de Ferro',
      description: 'Proteção básica para a cabeça',
      category: 'armor' as any,
      resultItemCode: 'helmet_iron',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 4 },
        { itemCode: 'leather', quantity: 2 },
      ],
      requiredLevel: 2,
      goldCost: 25,
      xpReward: 12,
      successRate: 1.0,
    },
    {
      code: 'craft_helmet_steel',
      name: 'Forjar Elmo de Aço',
      description: 'Elmo reforçado de aço temperado',
      category: 'armor' as any,
      resultItemCode: 'helmet_steel',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 8 },
        { itemCode: 'coal', quantity: 2 },
      ],
      requiredLevel: 6,
      goldCost: 120,
      xpReward: 60,
      successRate: 0.95,
    },

    // =====================================================
    // SHIELDS
    // =====================================================
    {
      code: 'craft_shield_wooden',
      name: 'Craftar Escudo de Madeira',
      description: 'Escudo básico feito de madeira reforçada',
      category: 'armor' as any,
      resultItemCode: 'shield_wooden',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'wood', quantity: 8 },
        { itemCode: 'iron_ore', quantity: 2 },
      ],
      requiredLevel: 1,
      goldCost: 15,
      xpReward: 8,
      successRate: 1.0,
    },
    {
      code: 'craft_shield_iron',
      name: 'Forjar Escudo de Ferro',
      description: 'Escudo sólido de ferro puro',
      category: 'armor' as any,
      resultItemCode: 'shield_iron',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 10 },
        { itemCode: 'wood', quantity: 4 },
        { itemCode: 'leather', quantity: 2 },
      ],
      requiredLevel: 4,
      goldCost: 70,
      xpReward: 35,
      successRate: 0.95,
    },

    // =====================================================
    // BOOTS
    // =====================================================
    {
      code: 'craft_boots_leather',
      name: 'Costurar Botas de Couro',
      description: 'Botas confortáveis de couro',
      category: 'armor' as any,
      resultItemCode: 'boots_leather',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'leather', quantity: 6 },
        { itemCode: 'thread', quantity: 4 },
      ],
      requiredLevel: 1,
      goldCost: 12,
      xpReward: 6,
      successRate: 1.0,
    },
    {
      code: 'craft_boots_iron',
      name: 'Forjar Botas de Ferro',
      description: 'Botas pesadas com reforço de metal',
      category: 'armor' as any,
      resultItemCode: 'boots_iron',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 6 },
        { itemCode: 'leather', quantity: 4 },
      ],
      requiredLevel: 3,
      goldCost: 40,
      xpReward: 20,
      successRate: 0.98,
    },

    // =====================================================
    // GLOVES
    // =====================================================
    {
      code: 'craft_gloves_leather',
      name: 'Costurar Luvas de Couro',
      description: 'Luvas flexíveis de couro',
      category: 'armor' as any,
      resultItemCode: 'gloves_leather',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'leather', quantity: 4 },
        { itemCode: 'thread', quantity: 3 },
      ],
      requiredLevel: 1,
      goldCost: 10,
      xpReward: 5,
      successRate: 1.0,
    },
    {
      code: 'craft_gloves_steel',
      name: 'Forjar Manoplas de Aço',
      description: 'Luvas blindadas de aço',
      category: 'armor' as any,
      resultItemCode: 'gloves_steel',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 5 },
        { itemCode: 'leather', quantity: 3 },
        { itemCode: 'coal', quantity: 1 },
      ],
      requiredLevel: 5,
      goldCost: 60,
      xpReward: 30,
      successRate: 0.95,
    },

    // =====================================================
    // CONSUMABLES - Potions
    // =====================================================
    {
      code: 'craft_potion_hp_small',
      name: 'Preparar Poção Pequena de HP',
      description: 'Poção básica que restaura 20 HP',
      category: 'consumable' as any,
      resultItemCode: 'potion_hp_small',
      resultQuantity: 3,
      ingredients: [
        { itemCode: 'herb', quantity: 5 },
        { itemCode: 'magic_essence', quantity: 1 },
      ],
      requiredLevel: 1,
      goldCost: 5,
      xpReward: 3,
      successRate: 1.0,
    },
    {
      code: 'craft_potion_hp_medium',
      name: 'Preparar Poção Média de HP',
      description: 'Poção que restaura 50 HP',
      category: 'consumable' as any,
      resultItemCode: 'potion_hp_medium',
      resultQuantity: 2,
      ingredients: [
        { itemCode: 'herb', quantity: 8 },
        { itemCode: 'magic_essence', quantity: 2 },
        { itemCode: 'crystal', quantity: 1 },
      ],
      requiredLevel: 4,
      goldCost: 15,
      xpReward: 10,
      successRate: 0.95,
    },
    {
      code: 'craft_potion_hp_large',
      name: 'Preparar Poção Grande de HP',
      description: 'Poção poderosa que restaura 100 HP',
      category: 'consumable' as any,
      resultItemCode: 'potion_hp_large',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'herb', quantity: 12 },
        { itemCode: 'magic_essence', quantity: 4 },
        { itemCode: 'crystal', quantity: 2 },
        { itemCode: 'dragon_scale', quantity: 1 },
      ],
      requiredLevel: 8,
      goldCost: 50,
      xpReward: 40,
      successRate: 0.90,
    },

    // =====================================================
    // MATERIALS - Refinement
    // =====================================================
    {
      code: 'craft_iron_bar',
      name: 'Fundir Barra de Ferro',
      description: 'Transforme minério em barras de ferro puro',
      category: 'material' as any,
      resultItemCode: 'iron_bar',
      resultQuantity: 2,
      ingredients: [
        { itemCode: 'iron_ore', quantity: 5 },
        { itemCode: 'coal', quantity: 1 },
      ],
      requiredLevel: 2,
      goldCost: 8,
      xpReward: 5,
      successRate: 1.0,
    },
    {
      code: 'craft_leather_refined',
      name: 'Curtir Couro Refinado',
      description: 'Processe couro bruto em couro de qualidade',
      category: 'material' as any,
      resultItemCode: 'leather_refined',
      resultQuantity: 2,
      ingredients: [
        { itemCode: 'leather', quantity: 6 },
        { itemCode: 'herb', quantity: 3 },
      ],
      requiredLevel: 3,
      goldCost: 10,
      xpReward: 8,
      successRate: 0.98,
    },
    {
      code: 'craft_thread',
      name: 'Tecer Linha',
      description: 'Crie linha resistente para costura',
      category: 'material' as any,
      resultItemCode: 'thread',
      resultQuantity: 10,
      ingredients: [
        { itemCode: 'cloth', quantity: 3 },
      ],
      requiredLevel: 1,
      goldCost: 2,
      xpReward: 2,
      successRate: 1.0,
    },

    // =====================================================
    // ENHANCEMENT - Upgrade Items
    // =====================================================
    {
      code: 'craft_weapon_enhancement',
      name: 'Cristal de Aprimoramento de Arma',
      description: 'Melhora permanentemente os atributos de uma arma',
      category: 'enhancement' as any,
      resultItemCode: 'enhancement_weapon',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'crystal', quantity: 5 },
        { itemCode: 'magic_essence', quantity: 10 },
        { itemCode: 'mythril_ore', quantity: 3 },
      ],
      requiredLevel: 10,
      goldCost: 200,
      xpReward: 100,
      successRate: 0.80,
    },
    {
      code: 'craft_armor_enhancement',
      name: 'Cristal de Aprimoramento de Armadura',
      description: 'Melhora permanentemente os atributos de uma armadura',
      category: 'enhancement' as any,
      resultItemCode: 'enhancement_armor',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'crystal', quantity: 5 },
        { itemCode: 'magic_essence', quantity: 10 },
        { itemCode: 'dragon_scale', quantity: 2 },
      ],
      requiredLevel: 10,
      goldCost: 200,
      xpReward: 100,
      successRate: 0.80,
    },

    // =====================================================
    // SPECIAL RECIPES - High Level
    // =====================================================
    {
      code: 'craft_legendary_sword',
      name: 'Forjar Espada Lendária',
      description: 'Uma arma de poder incomparável',
      category: 'weapon' as any,
      resultItemCode: 'sword_legendary',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'mythril_ore', quantity: 15 },
        { itemCode: 'dragon_scale', quantity: 5 },
        { itemCode: 'magic_essence', quantity: 20 },
        { itemCode: 'crystal', quantity: 10 },
      ],
      requiredLevel: 15,
      goldCost: 1000,
      xpReward: 500,
      successRate: 0.70,
    },
    {
      code: 'craft_dragon_armor',
      name: 'Forjar Armadura de Dragão',
      description: 'Armadura forjada com escamas de dragão',
      category: 'armor' as any,
      resultItemCode: 'armor_dragon',
      resultQuantity: 1,
      ingredients: [
        { itemCode: 'dragon_scale', quantity: 20 },
        { itemCode: 'mythril_ore', quantity: 10 },
        { itemCode: 'magic_essence', quantity: 15 },
      ],
      requiredLevel: 15,
      goldCost: 1500,
      xpReward: 600,
      successRate: 0.65,
    },
  ];

  for (const recipe of recipes) {
    await prisma.craftingRecipe.upsert({
      where: { code: recipe.code },
      update: recipe,
      create: recipe,
    });
  }

  const count = await prisma.craftingRecipe.count();
  console.log(`✅ ${count} crafting recipes created!`);
}

seedCrafting()
  .catch((e) => {
    console.error('❌ Error seeding crafting:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
