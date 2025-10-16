import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGatherNodes() {
  console.log('🌲 Seeding gather nodes...');

  const nodes = [
    // =====================================================
    // WOOD - Madeira
    // =====================================================
    {
      code: 'oak_tree',
      name: 'Carvalho Comum',
      description: 'Uma árvore robusta de madeira comum',
      type: 'wood' as any,
      requiredLevel: 1,
      gatherTime: 3,
      energyCost: 5,
      xpReward: 5,
      dropTable: {
        wood: { chance: 1.0, quantity: [2, 4] },
      },
    },
    {
      code: 'pine_tree',
      name: 'Pinheiro',
      description: 'Árvore alta com madeira leve',
      type: 'wood' as any,
      requiredLevel: 3,
      gatherTime: 4,
      energyCost: 6,
      xpReward: 8,
      dropTable: {
        wood: { chance: 1.0, quantity: [3, 5] },
        cloth: { chance: 0.15, quantity: [1, 2] },
      },
    },
    {
      code: 'ancient_tree',
      name: 'Árvore Ancestral',
      description: 'Uma árvore antiga com madeira mágica',
      type: 'wood' as any,
      requiredLevel: 8,
      gatherTime: 6,
      energyCost: 10,
      xpReward: 20,
      dropTable: {
        wood: { chance: 1.0, quantity: [4, 7] },
        magic_essence: { chance: 0.25, quantity: [1, 2] },
      },
    },

    // =====================================================
    // ORE - Minérios
    // =====================================================
    {
      code: 'iron_deposit',
      name: 'Depósito de Ferro',
      description: 'Veio rico em minério de ferro',
      type: 'ore' as any,
      requiredLevel: 2,
      gatherTime: 5,
      energyCost: 8,
      xpReward: 10,
      dropTable: {
        iron_ore: { chance: 1.0, quantity: [2, 4] },
        coal: { chance: 0.3, quantity: [1, 2] },
      },
    },
    {
      code: 'copper_vein',
      name: 'Veio de Cobre',
      description: 'Minério de cobre brilhante',
      type: 'ore' as any,
      requiredLevel: 1,
      gatherTime: 4,
      energyCost: 6,
      xpReward: 6,
      dropTable: {
        copper_ore: { chance: 1.0, quantity: [3, 5] },
      },
    },
    {
      code: 'mythril_deposit',
      name: 'Depósito de Mithril',
      description: 'Raro minério mágico prateado',
      type: 'ore' as any,
      requiredLevel: 10,
      gatherTime: 8,
      energyCost: 15,
      xpReward: 35,
      dropTable: {
        mythril_ore: { chance: 0.9, quantity: [1, 3] },
        crystal: { chance: 0.2, quantity: [1, 1] },
      },
    },
    {
      code: 'coal_deposit',
      name: 'Depósito de Carvão',
      description: 'Carvão mineral para fundição',
      type: 'ore' as any,
      requiredLevel: 3,
      gatherTime: 4,
      energyCost: 6,
      xpReward: 8,
      dropTable: {
        coal: { chance: 1.0, quantity: [3, 6] },
      },
    },

    // =====================================================
    // HERB - Ervas e Plantas
    // =====================================================
    {
      code: 'healing_herb',
      name: 'Erva Curativa',
      description: 'Planta medicinal comum',
      type: 'herb' as any,
      requiredLevel: 1,
      gatherTime: 2,
      energyCost: 4,
      xpReward: 4,
      dropTable: {
        herb: { chance: 1.0, quantity: [3, 6] },
      },
    },
    {
      code: 'magic_flower',
      name: 'Flor Mágica',
      description: 'Flor rara com propriedades mágicas',
      type: 'herb' as any,
      requiredLevel: 5,
      gatherTime: 4,
      energyCost: 8,
      xpReward: 15,
      dropTable: {
        herb: { chance: 1.0, quantity: [2, 4] },
        magic_essence: { chance: 0.4, quantity: [1, 2] },
      },
    },
    {
      code: 'ancient_root',
      name: 'Raiz Ancestral',
      description: 'Raiz de planta milenar',
      type: 'herb' as any,
      requiredLevel: 9,
      gatherTime: 6,
      energyCost: 12,
      xpReward: 25,
      dropTable: {
        herb: { chance: 1.0, quantity: [4, 7] },
        magic_essence: { chance: 0.5, quantity: [2, 3] },
        crystal: { chance: 0.1, quantity: [1, 1] },
      },
    },

    // =====================================================
    // CRYSTAL - Cristais Mágicos
    // =====================================================
    {
      code: 'mana_crystal',
      name: 'Cristal de Mana',
      description: 'Cristal pulsante com energia mágica',
      type: 'crystal' as any,
      requiredLevel: 6,
      gatherTime: 6,
      energyCost: 12,
      xpReward: 20,
      dropTable: {
        crystal: { chance: 1.0, quantity: [1, 3] },
        magic_essence: { chance: 0.6, quantity: [1, 2] },
      },
    },
    {
      code: 'void_crystal',
      name: 'Cristal do Vazio',
      description: 'Cristal negro com poder sombrio',
      type: 'crystal' as any,
      requiredLevel: 12,
      gatherTime: 10,
      energyCost: 20,
      xpReward: 50,
      dropTable: {
        crystal: { chance: 1.0, quantity: [2, 4] },
        magic_essence: { chance: 0.8, quantity: [2, 4] },
        mythril_ore: { chance: 0.15, quantity: [1, 2] },
      },
    },

    // =====================================================
    // LEATHER - Caça para Couro
    // =====================================================
    {
      code: 'wild_game',
      name: 'Caça Selvagem',
      description: 'Animais selvagens para couro',
      type: 'leather' as any,
      requiredLevel: 2,
      gatherTime: 5,
      energyCost: 8,
      xpReward: 10,
      dropTable: {
        leather: { chance: 1.0, quantity: [2, 4] },
        cloth: { chance: 0.2, quantity: [1, 2] },
      },
    },
    {
      code: 'exotic_beast',
      name: 'Fera Exótica',
      description: 'Criaturas raras com couro de qualidade',
      type: 'leather' as any,
      requiredLevel: 7,
      gatherTime: 7,
      energyCost: 14,
      xpReward: 25,
      dropTable: {
        leather: { chance: 1.0, quantity: [3, 6] },
        dragon_scale: { chance: 0.1, quantity: [1, 1] },
        cloth: { chance: 0.3, quantity: [2, 3] },
      },
    },
    {
      code: 'dragon_nest',
      name: 'Ninho de Dragão',
      description: 'Local perigoso com escamas de dragão',
      type: 'leather' as any,
      requiredLevel: 15,
      gatherTime: 12,
      energyCost: 25,
      xpReward: 60,
      dropTable: {
        dragon_scale: { chance: 0.8, quantity: [1, 3] },
        leather: { chance: 1.0, quantity: [4, 8] },
        crystal: { chance: 0.3, quantity: [1, 2] },
      },
    },
  ];

  for (const node of nodes) {
    await prisma.gatherNode.upsert({
      where: { code: node.code },
      update: node,
      create: node,
    });
  }

  console.log(`✅ ${nodes.length} gather nodes seeded`);
}

seedGatherNodes()
  .catch((e) => {
    console.error('❌ Error seeding gather nodes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
