import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixItemSlots() {
  console.log('🔧 Fixing item slots...');

  const fixes = [
    // Shields - torso slot (they compete with armor)
    { code: 'shield_wooden', slot: 'torso' },
    { code: 'shield_iron', slot: 'torso' },
    
    // Gloves/Hands - using legs slot temporarily (no hands slot exists)
    { code: 'gloves_leather', slot: 'legs' },
    { code: 'gloves_steel', slot: 'legs' },
  ];

  for (const fix of fixes) {
    const item = await prisma.item.findUnique({
      where: { code: fix.code },
    });

    if (item) {
      await prisma.item.update({
        where: { code: fix.code },
        data: { slot: fix.slot as any },
      });
      console.log(`✅ Fixed ${fix.code} -> slot: ${fix.slot}`);
    } else {
      console.log(`⚠️  Item not found: ${fix.code}`);
    }
  }

  console.log('\n✅ All item slots fixed!');
  console.log('\nℹ️  Note: Some items share slots:');
  console.log('   - Shields and Armor both use "torso" slot');
  console.log('   - Gloves use "legs" slot (no hands slot available)');
}

fixItemSlots()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
