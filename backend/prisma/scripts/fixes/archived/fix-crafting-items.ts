import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Criando items faltantes de crafting...\n');

  const craftingItems = [
    // Material Intermediário - Thread
    {
      code: 'thread',
      name: 'Linha',
      description: 'Linha resistente para costura',
      type: 'material' as any,
      baseValue: 1,
      maxStack: 999,
      isTradeable: true,
      isCraftable: true,
    },
    
    // Materiais Refinados
    {
      code: 'iron_bar',
      name: 'Barra de Ferro',
      description: 'Ferro fundido em barra',
      type: 'material' as any,
      baseValue: 15,
      maxStack: 999,
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'leather_refined',
      name: 'Couro Refinado',
      description: 'Couro curtido e refinado',
      type: 'material' as any,
      baseValue: 12,
      maxStack: 999,
      isTradeable: true,
      isCraftable: true,
    },
    
    // Armas - Espadas
    {
      code: 'sword_mythril',
      name: 'Espada de Mithril',
      description: 'Espada forjada com mithril lendário',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 500,
      maxStack: 1,
      attributes: {
        attack: 45,
        critChance: 0.15,
        durability: 200,
      },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'sword_legendary',
      name: 'Espada Lendária',
      description: 'Espada de poder incomparável',
      type: 'weapon' as any,
      slot: 'weapon' as any,
      baseValue: 2000,
      maxStack: 1,
      attributes: {
        attack: 80,
        critChance: 0.25,
        durability: 500,
      },
      isTradeable: true,
      isCraftable: true,
    },
    
    // Armas - Escudos (sem slot específico, sistema não tem)
    {
      code: 'shield_wooden',
      name: 'Escudo de Madeira',
      description: 'Escudo simples de madeira',
      type: 'armor' as any,
      baseValue: 50,
      maxStack: 1,
      attributes: {
        defense: 8,
        durability: 80,
      },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'shield_iron',
      name: 'Escudo de Ferro',
      description: 'Escudo resistente de ferro',
      type: 'armor' as any,
      baseValue: 150,
      maxStack: 1,
      attributes: {
        defense: 15,
        durability: 150,
      },
      isTradeable: true,
      isCraftable: true,
    },
    
    // Armaduras - Luvas (sem slot específico, sistema não tem)
    {
      code: 'gloves_leather',
      name: 'Luvas de Couro',
      description: 'Luvas simples de couro',
      type: 'armor' as any,
      baseValue: 80,
      maxStack: 1,
      attributes: {
        defense: 5,
        durability: 100,
      },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'gloves_steel',
      name: 'Manoplas de Aço',
      description: 'Manoplas pesadas de aço',
      type: 'armor' as any,
      baseValue: 200,
      maxStack: 1,
      attributes: {
        defense: 12,
        durability: 180,
      },
      isTradeable: true,
      isCraftable: true,
    },
    
    // Armadura Épica
    {
      code: 'armor_dragon',
      name: 'Armadura de Dragão',
      description: 'Armadura forjada com escamas de dragão',
      type: 'armor' as any,
      slot: 'torso' as any,
      baseValue: 3000,
      maxStack: 1,
      attributes: {
        defense: 60,
        fireResist: 50,
        durability: 500,
      },
      isTradeable: true,
      isCraftable: true,
    },
    
    // Consumível
    {
      code: 'potion_health',
      name: 'Poção de Vida',
      description: 'Restaura HP',
      type: 'consumable' as any,
      baseValue: 25,
      maxStack: 99,
      attributes: {
        healAmount: 50,
      },
      isTradeable: true,
      isCraftable: true,
    },
    
    // Aprimoramentos (tipo material)
    {
      code: 'enhancement_weapon',
      name: 'Cristal de Aprimoramento de Arma',
      description: 'Aumenta o poder de uma arma',
      type: 'material' as any,
      baseValue: 500,
      maxStack: 99,
      attributes: {
        attackBonus: 10,
        successRate: 0.7,
      },
      isTradeable: true,
      isCraftable: true,
    },
    {
      code: 'enhancement_armor',
      name: 'Cristal de Aprimoramento de Armadura',
      description: 'Aumenta a defesa de uma armadura',
      type: 'material' as any,
      baseValue: 500,
      maxStack: 99,
      attributes: {
        defenseBonus: 10,
        successRate: 0.7,
      },
      isTradeable: true,
      isCraftable: true,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const itemData of craftingItems) {
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
  console.log(`  📦 Total: ${craftingItems.length}`);
  console.log('\n✅ Items de crafting prontos!');
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
