import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCharacter() {
  try {
    const character = await prisma.character.findUnique({
      where: { id: 2 },
      include: {
        inventory: {
          include: {
            item: true
          }
        }
      }
    });

    if (!character) {
      console.log('❌ Character ID 2 not found!');
      return;
    }

    console.log('\n📊 Character Info:');
    console.log(`- ID: ${character.id}`);
    console.log(`- Name: ${character.name}`);
    console.log(`- Level: ${character.level}`);
    console.log(`- Gold: ${character.gold}`);
    console.log(`- XP: ${character.xp}`);

    console.log('\n🎒 Inventory (' + character.inventory.length + ' items):');
    character.inventory.forEach(inv => {
      console.log(`  ✓ ${inv.item.name.padEnd(25)} (${inv.item.code.padEnd(15)}) x${inv.quantity}`);
    });

    console.log('\n✅ Ready to craft!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCharacter();
