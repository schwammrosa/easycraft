import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestResources() {
  console.log('🧪 Adding test resources for crafting...');

  // Get the first character (change this ID if needed)
  const character = await prisma.character.findFirst({
    orderBy: { id: 'asc' },
  });

  if (!character) {
    console.error('❌ No character found! Create a character first.');
    return;
  }

  console.log(`📦 Adding resources to character: ${character.name} (ID: ${character.id})`);

  // List of materials to add
  const materials = [
    // Basic materials
    { code: 'iron_ore', quantity: 50 },
    { code: 'wood', quantity: 50 },
    { code: 'leather', quantity: 50 },
    { code: 'coal', quantity: 30 },
    { code: 'herb', quantity: 40 },
    { code: 'cloth', quantity: 30 },
    
    // Uncommon materials
    { code: 'crystal', quantity: 20 },
    { code: 'magic_essence', quantity: 25 },
    
    // Rare materials
    { code: 'mythril_ore', quantity: 15 },
    { code: 'dragon_scale', quantity: 10 },
  ];

  let addedCount = 0;
  let updatedCount = 0;

  for (const material of materials) {
    // Find item
    const item = await prisma.item.findUnique({
      where: { code: material.code },
    });

    if (!item) {
      console.log(`⚠️  Item not found: ${material.code}`);
      continue;
    }

    // Check if already in inventory
    const existing = await prisma.inventory.findUnique({
      where: {
        characterId_itemId: {
          characterId: character.id,
          itemId: item.id,
        },
      },
    });

    if (existing) {
      // Update quantity
      await prisma.inventory.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + material.quantity },
      });
      console.log(`✅ Updated ${material.code}: +${material.quantity} (total: ${existing.quantity + material.quantity})`);
      updatedCount++;
    } else {
      // Create new
      await prisma.inventory.create({
        data: {
          characterId: character.id,
          itemId: item.id,
          quantity: material.quantity,
        },
      });
      console.log(`✅ Added ${material.code}: ${material.quantity}`);
      addedCount++;
    }
  }

  // Give gold for crafting costs
  const goldToAdd = 5000;
  await prisma.character.update({
    where: { id: character.id },
    data: {
      gold: Number(character.gold) + goldToAdd,
    },
  });

  console.log(`\n💰 Added ${goldToAdd} gold`);
  console.log(`\n📊 Summary:`);
  console.log(`   - New items added: ${addedCount}`);
  console.log(`   - Items updated: ${updatedCount}`);
  console.log(`   - Total materials: ${addedCount + updatedCount}`);
  console.log(`\n🎮 Ready to test crafting! Go to /crafting`);
}

seedTestResources()
  .catch((e) => {
    console.error('❌ Error seeding test resources:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
