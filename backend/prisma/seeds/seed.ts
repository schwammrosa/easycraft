import { PrismaClient, ItemType, EquipmentSlot } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing items
  await prisma.item.deleteMany({});
  console.log('✅ Cleared existing items');

  // Seed items
  const items = await prisma.item.createMany({
    data: [
      // Weapons (10 items)
      {
        code: 'sword_basic',
        name: 'Espada de Madeira',
        description: 'Uma espada simples de madeira para iniciantes',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 50,
        maxStack: 1,
        attributes: JSON.stringify({ str: 2, agi: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'sword_iron',
        name: 'Espada de Ferro',
        description: 'Uma espada resistente de ferro',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 150,
        maxStack: 1,
        attributes: JSON.stringify({ str: 5, agi: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'sword_steel',
        name: 'Espada de Aço',
        description: 'Uma espada afiada de aço de alta qualidade',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 300,
        maxStack: 1,
        attributes: JSON.stringify({ str: 8, agi: 3 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'staff_basic',
        name: 'Cajado de Madeira',
        description: 'Um cajado simples para magos iniciantes',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 50,
        maxStack: 1,
        attributes: JSON.stringify({ int: 3 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'staff_mystic',
        name: 'Cajado Místico',
        description: 'Um cajado imbuído com energia mágica',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 200,
        maxStack: 1,
        attributes: JSON.stringify({ int: 7, vit: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'bow_basic',
        name: 'Arco Curto',
        description: 'Um arco simples para caça',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 80,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 4, str: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'bow_long',
        name: 'Arco Longo',
        description: 'Um arco poderoso de longo alcance',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 250,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 7, str: 3 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'dagger_iron',
        name: 'Adaga de Ferro',
        description: 'Uma adaga rápida e letal',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 100,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 5, str: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'axe_battle',
        name: 'Machado de Batalha',
        description: 'Um machado pesado e devastador',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 180,
        maxStack: 1,
        attributes: JSON.stringify({ str: 7, def: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'wand_crystal',
        name: 'Varinha de Cristal',
        description: 'Uma varinha delicada mas poderosa',
        type: ItemType.weapon,
        slot: EquipmentSlot.weapon,
        baseValue: 150,
        maxStack: 1,
        attributes: JSON.stringify({ int: 6, agi: 2 }),
        isTradeable: true,
        isCraftable: true,
      },

      // Head Armor (5 items)
      {
        code: 'helmet_leather',
        name: 'Capacete de Couro',
        description: 'Proteção básica para a cabeça',
        type: ItemType.armor,
        slot: EquipmentSlot.head,
        baseValue: 40,
        maxStack: 1,
        attributes: JSON.stringify({ def: 2, vit: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'helmet_iron',
        name: 'Capacete de Ferro',
        description: 'Capacete resistente de ferro',
        type: ItemType.armor,
        slot: EquipmentSlot.head,
        baseValue: 120,
        maxStack: 1,
        attributes: JSON.stringify({ def: 4, vit: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'helmet_steel',
        name: 'Elmo de Aço',
        description: 'Proteção superior de aço',
        type: ItemType.armor,
        slot: EquipmentSlot.head,
        baseValue: 250,
        maxStack: 1,
        attributes: JSON.stringify({ def: 6, vit: 3, str: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'hood_mage',
        name: 'Capuz do Mago',
        description: 'Capuz místico que aumenta poder mágico',
        type: ItemType.armor,
        slot: EquipmentSlot.head,
        baseValue: 100,
        maxStack: 1,
        attributes: JSON.stringify({ int: 4, def: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'circlet_wisdom',
        name: 'Diadema da Sabedoria',
        description: 'Aumenta significativamente a inteligência',
        type: ItemType.armor,
        slot: EquipmentSlot.head,
        baseValue: 300,
        maxStack: 1,
        attributes: JSON.stringify({ int: 7, vit: 2 }),
        isTradeable: true,
        isCraftable: true,
      },

      // Torso Armor (5 items)
      {
        code: 'armor_leather',
        name: 'Armadura de Couro',
        description: 'Proteção leve e flexível',
        type: ItemType.armor,
        slot: EquipmentSlot.torso,
        baseValue: 60,
        maxStack: 1,
        attributes: JSON.stringify({ def: 3, agi: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'armor_chainmail',
        name: 'Cota de Malha',
        description: 'Armadura de anéis entrelaçados',
        type: ItemType.armor,
        slot: EquipmentSlot.torso,
        baseValue: 180,
        maxStack: 1,
        attributes: JSON.stringify({ def: 6, vit: 3 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'armor_plate',
        name: 'Armadura de Placas',
        description: 'Proteção máxima de placas de aço',
        type: ItemType.armor,
        slot: EquipmentSlot.torso,
        baseValue: 400,
        maxStack: 1,
        attributes: JSON.stringify({ def: 10, vit: 5, str: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'robe_mage',
        name: 'Robe do Mago',
        description: 'Vestes místicas que amplificam magia',
        type: ItemType.armor,
        slot: EquipmentSlot.torso,
        baseValue: 150,
        maxStack: 1,
        attributes: JSON.stringify({ int: 5, def: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'tunic_ranger',
        name: 'Túnica do Patrulheiro',
        description: 'Leve e perfeita para movimento',
        type: ItemType.armor,
        slot: EquipmentSlot.torso,
        baseValue: 200,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 6, def: 3, vit: 2 }),
        isTradeable: true,
        isCraftable: true,
      },

      // Legs Armor (5 items)
      {
        code: 'pants_leather',
        name: 'Calças de Couro',
        description: 'Proteção básica para as pernas',
        type: ItemType.armor,
        slot: EquipmentSlot.legs,
        baseValue: 50,
        maxStack: 1,
        attributes: JSON.stringify({ def: 2, agi: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'pants_iron',
        name: 'Calças de Ferro',
        description: 'Proteção reforçada de ferro',
        type: ItemType.armor,
        slot: EquipmentSlot.legs,
        baseValue: 150,
        maxStack: 1,
        attributes: JSON.stringify({ def: 5, vit: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'greaves_steel',
        name: 'Grevas de Aço',
        description: 'Proteção pesada de aço para pernas',
        type: ItemType.armor,
        slot: EquipmentSlot.legs,
        baseValue: 300,
        maxStack: 1,
        attributes: JSON.stringify({ def: 8, vit: 4, str: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'pants_mage',
        name: 'Calças Místicas',
        description: 'Calças encantadas para magos',
        type: ItemType.armor,
        slot: EquipmentSlot.legs,
        baseValue: 120,
        maxStack: 1,
        attributes: JSON.stringify({ int: 4, def: 2 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'leggings_swift',
        name: 'Perneiras Velozes',
        description: 'Aumentam significativamente a agilidade',
        type: ItemType.armor,
        slot: EquipmentSlot.legs,
        baseValue: 250,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 7, def: 3 }),
        isTradeable: true,
        isCraftable: true,
      },

      // Feet Armor (5 items)
      {
        code: 'boots_leather',
        name: 'Botas de Couro',
        description: 'Botas simples e confortáveis',
        type: ItemType.armor,
        slot: EquipmentSlot.feet,
        baseValue: 30,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 1, def: 1 }),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'boots_iron',
        name: 'Botas de Ferro',
        description: 'Botas pesadas e resistentes',
        type: ItemType.armor,
        slot: EquipmentSlot.feet,
        baseValue: 100,
        maxStack: 1,
        attributes: JSON.stringify({ def: 3, vit: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'boots_steel',
        name: 'Botas de Aço',
        description: 'Máxima proteção para os pés',
        type: ItemType.armor,
        slot: EquipmentSlot.feet,
        baseValue: 200,
        maxStack: 1,
        attributes: JSON.stringify({ def: 5, vit: 2, str: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'shoes_mage',
        name: 'Sapatos Místicos',
        description: 'Sapatos leves encantados',
        type: ItemType.armor,
        slot: EquipmentSlot.feet,
        baseValue: 80,
        maxStack: 1,
        attributes: JSON.stringify({ int: 3, agi: 1 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'boots_speed',
        name: 'Botas da Velocidade',
        description: 'Botas encantadas com velocidade',
        type: ItemType.armor,
        slot: EquipmentSlot.feet,
        baseValue: 180,
        maxStack: 1,
        attributes: JSON.stringify({ agi: 5, def: 2 }),
        isTradeable: true,
        isCraftable: true,
      },

      // Materials (5 items)
      {
        code: 'wood',
        name: 'Madeira',
        description: 'Madeira comum para construção',
        type: ItemType.material,
        slot: null,
        baseValue: 5,
        maxStack: 99,
        attributes: JSON.stringify({}),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'iron_ore',
        name: 'Minério de Ferro',
        description: 'Minério bruto de ferro',
        type: ItemType.material,
        slot: null,
        baseValue: 10,
        maxStack: 99,
        attributes: JSON.stringify({}),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'leather',
        name: 'Couro',
        description: 'Couro curtido de animal',
        type: ItemType.material,
        slot: null,
        baseValue: 8,
        maxStack: 99,
        attributes: JSON.stringify({}),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'magic_crystal',
        name: 'Cristal Mágico',
        description: 'Cristal imbuído com energia mágica',
        type: ItemType.material,
        slot: null,
        baseValue: 25,
        maxStack: 99,
        attributes: JSON.stringify({}),
        isTradeable: true,
        isCraftable: false,
      },
      {
        code: 'steel_ingot',
        name: 'Barra de Aço',
        description: 'Aço refinado pronto para uso',
        type: ItemType.material,
        slot: null,
        baseValue: 20,
        maxStack: 99,
        attributes: JSON.stringify({}),
        isTradeable: true,
        isCraftable: true,
      },

      // Consumables (5 items)
      {
        code: 'potion_hp_small',
        name: 'Poção de Vida Pequena',
        description: 'Restaura 50 HP',
        type: ItemType.consumable,
        slot: null,
        baseValue: 20,
        maxStack: 20,
        attributes: JSON.stringify({ hpRestore: 50 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'potion_hp_medium',
        name: 'Poção de Vida Média',
        description: 'Restaura 150 HP',
        type: ItemType.consumable,
        slot: null,
        baseValue: 50,
        maxStack: 20,
        attributes: JSON.stringify({ hpRestore: 150 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'potion_hp_large',
        name: 'Poção de Vida Grande',
        description: 'Restaura 300 HP',
        type: ItemType.consumable,
        slot: null,
        baseValue: 100,
        maxStack: 20,
        attributes: JSON.stringify({ hpRestore: 300 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'elixir_str',
        name: 'Elixir de Força',
        description: 'Aumenta STR temporariamente (+5 por 30 min)',
        type: ItemType.consumable,
        slot: null,
        baseValue: 75,
        maxStack: 10,
        attributes: JSON.stringify({ strBonus: 5, duration: 1800 }),
        isTradeable: true,
        isCraftable: true,
      },
      {
        code: 'elixir_agi',
        name: 'Elixir de Agilidade',
        description: 'Aumenta AGI temporariamente (+5 por 30 min)',
        type: ItemType.consumable,
        slot: null,
        baseValue: 75,
        maxStack: 10,
        attributes: JSON.stringify({ agiBonus: 5, duration: 1800 }),
        isTradeable: true,
        isCraftable: true,
      },
    ],
  });

  console.log(`✅ Created ${items.count} items`);

  // Clear and seed monsters
  await prisma.enemy.deleteMany({});
  const enemies = await prisma.enemy.createMany({
    data: [
      { code: 'slime', name: 'Slime', level: 1, hp: 20, str: 3, agi: 2, def: 1, xpReward: 10, goldReward: 5 },
      { code: 'goblin', name: 'Goblin', level: 3, hp: 40, str: 8, agi: 5, def: 3, xpReward: 25, goldReward: 15 },
      { code: 'wolf', name: 'Lobo', level: 5, hp: 60, str: 12, agi: 10, def: 5, xpReward: 40, goldReward: 25 },
      { code: 'orc', name: 'Orc', level: 7, hp: 90, str: 18, agi: 8, def: 8, xpReward: 60, goldReward: 40 },
      { code: 'troll', name: 'Troll', level: 10, hp: 150, str: 25, agi: 10, def: 12, xpReward: 100, goldReward: 75 },
      { code: 'dark_knight', name: 'Cavaleiro Sombrio', level: 15, hp: 250, str: 40, agi: 25, def: 20, xpReward: 200, goldReward: 150 },
      { code: 'dragon', name: 'Dragão', level: 20, hp: 500, str: 60, agi: 40, def: 30, xpReward: 500, goldReward: 300 },
    ],
  });
  console.log(`✅ Created ${enemies.count} enemies`);

  // Clear and seed dungeons
  await prisma.dungeon.deleteMany({});
  const dungeons = await prisma.dungeon.createMany({
    data: [
      {
        code: 'goblin_cave',
        name: 'Caverna dos Goblins',
        description: 'Uma caverna infestada de goblins',
        recommendedLevel: 3,
        maxFloors: 3,
      },
      {
        code: 'dark_forest',
        name: 'Floresta Sombria',
        description: 'Uma floresta cheia de criaturas perigosas',
        recommendedLevel: 7,
        maxFloors: 5,
      },
      {
        code: 'ancient_ruins',
        name: 'Ruínas Antigas',
        description: 'Ruínas de uma civilização perdida',
        recommendedLevel: 12,
        maxFloors: 7,
      },
    ],
  });
  console.log(`✅ Created ${dungeons.count} dungeons`);

  // Clear and seed dungeon floors
  await prisma.dungeonFloor.deleteMany({});
  
  // Get the created dungeons to link floors
  const goblinCave = await prisma.dungeon.findUnique({ where: { code: 'goblin_cave' } });
  const darkForest = await prisma.dungeon.findUnique({ where: { code: 'dark_forest' } });
  const ancientRuins = await prisma.dungeon.findUnique({ where: { code: 'ancient_ruins' } });

  console.log(`🔍 Found dungeons: goblinCave=${!!goblinCave}, darkForest=${!!darkForest}, ancientRuins=${!!ancientRuins}`);

  if (!goblinCave || !darkForest || !ancientRuins) {
    throw new Error('Failed to find dungeons for floor creation');
  }

  const floors: any[] = [];
  
  // Goblin Cave floors (3 floors)
  floors.push(
    { dungeonId: goblinCave.id, floorNumber: 1, enemyCode: 'goblin', isBoss: false },
    { dungeonId: goblinCave.id, floorNumber: 2, enemyCode: 'goblin', isBoss: false },
    { dungeonId: goblinCave.id, floorNumber: 3, enemyCode: 'orc', isBoss: true }
  );

  // Dark Forest floors (5 floors)
  floors.push(
    { dungeonId: darkForest.id, floorNumber: 1, enemyCode: 'wolf', isBoss: false },
    { dungeonId: darkForest.id, floorNumber: 2, enemyCode: 'wolf', isBoss: false },
    { dungeonId: darkForest.id, floorNumber: 3, enemyCode: 'orc', isBoss: false },
    { dungeonId: darkForest.id, floorNumber: 4, enemyCode: 'troll', isBoss: false },
    { dungeonId: darkForest.id, floorNumber: 5, enemyCode: 'troll', isBoss: true }
  );

  // Ancient Ruins floors (7 floors)
  floors.push(
    { dungeonId: ancientRuins.id, floorNumber: 1, enemyCode: 'dark_knight', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 2, enemyCode: 'dark_knight', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 3, enemyCode: 'dark_knight', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 4, enemyCode: 'troll', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 5, enemyCode: 'dark_knight', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 6, enemyCode: 'dark_knight', isBoss: false },
    { dungeonId: ancientRuins.id, floorNumber: 7, enemyCode: 'dragon', isBoss: true }
  );

  console.log(`🏗️ Creating ${floors.length} dungeon floors...`);
  await prisma.dungeonFloor.createMany({ data: floors });
  console.log(`✅ Created ${floors.length} dungeon floors`);

  // Clear and seed quests
  await prisma.quest.deleteMany({});
  const quests = await prisma.quest.createMany({
    data: [
      {
        code: 'tutorial_combat',
        name: 'Primeiro Combate',
        description: 'Derrote 3 Slimes para ganhar experiência',
        type: 'kill_enemies',
        targetAmount: 3,
        targetData: JSON.stringify({ enemyCode: 'slime' }),
        xpReward: 50,
        goldReward: 25,
        requiredLevel: 1,
        isRepeatable: false,
      },
      {
        code: 'goblin_threat',
        name: 'Ameaça Goblin',
        description: 'Elimine 5 Goblins que ameaçam a vila',
        type: 'kill_enemies',
        targetAmount: 5,
        targetData: JSON.stringify({ enemyCode: 'goblin' }),
        xpReward: 150,
        goldReward: 75,
        requiredLevel: 3,
        isRepeatable: true,
      },
      {
        code: 'collect_herbs',
        name: 'Coleta de Ervas',
        description: 'Colete 10 ervas medicinais',
        type: 'collect_items',
        targetAmount: 10,
        targetData: JSON.stringify({ itemCode: 'herb' }),
        xpReward: 75,
        goldReward: 50,
        itemRewards: JSON.stringify([{ itemCode: 'potion_health', quantity: 2 }]),
        requiredLevel: 1,
        isRepeatable: true,
      },
    ],
  });
  console.log(`✅ Created ${quests.count} quests`);

  // Clear and seed crafting recipes
  await prisma.craftingRecipe.deleteMany({});
  const recipes = await prisma.craftingRecipe.createMany({
    data: [
      {
        code: 'craft_iron_sword',
        name: 'Forjar Espada de Ferro',
        category: 'weapon',
        resultItemCode: 'sword_iron',
        resultQuantity: 1,
        ingredients: JSON.stringify([{ itemCode: 'iron_ore', quantity: 5 }, { itemCode: 'wood', quantity: 2 }]),
        requiredLevel: 5,
        xpReward: 50,
      },
      {
        code: 'craft_health_potion',
        name: 'Preparar Poção de Vida',
        category: 'consumable',
        resultItemCode: 'potion_health',
        resultQuantity: 3,
        ingredients: JSON.stringify([{ itemCode: 'herb', quantity: 5 }]),
        requiredLevel: 1,
        xpReward: 20,
      },
      {
        code: 'craft_leather_armor',
        name: 'Criar Armadura de Couro',
        category: 'armor',
        resultItemCode: 'armor_leather',
        resultQuantity: 1,
        ingredients: JSON.stringify([{ itemCode: 'leather', quantity: 8 }]),
        requiredLevel: 3,
        xpReward: 40,
      },
    ],
  });
  console.log(`✅ Created ${recipes.count} crafting recipes`);

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
