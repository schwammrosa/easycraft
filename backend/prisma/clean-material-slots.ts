import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanMaterialSlots() {
  console.log('🧹 Cleaning slots from non-equipable items...');

  // Materials and consumables should NOT have slots
  const result = await prisma.item.updateMany({
    where: {
      type: {
        in: ['material', 'consumable'],
      },
      slot: {
        not: null,
      },
    },
    data: {
      slot: null,
    },
  });

  console.log(`✅ Cleaned ${result.count} items (removed slot from materials/consumables)`);

  // Show items that should be equipable (weapon/armor with slot)
  const equipable = await prisma.item.findMany({
    where: {
      type: {
        in: ['weapon', 'armor'],
      },
    },
    select: {
      code: true,
      name: true,
      type: true,
      slot: true,
    },
  });

  console.log('\n📋 Equipable items:');
  equipable.forEach(item => {
    console.log(`  - ${item.name} (${item.type}) -> slot: ${item.slot || 'NO SLOT!'}`);
  });

  // Check if any weapon/armor is missing slot
  const missingSlot = equipable.filter(item => !item.slot);
  if (missingSlot.length > 0) {
    console.log('\n⚠️  WARNING: These items are missing slots:');
    missingSlot.forEach(item => {
      console.log(`  - ${item.name} (${item.type})`);
    });
  }
}

cleanMaterialSlots()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
