import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCharacter() {
  try {
    // Get first character
    const character = await prisma.character.findFirst({
      include: {
        inventory: {
          include: {
            item: true
          }
        }
      }
    });

    if (!character) {
      console.log('❌ No character found!');
      return;
    }

    console.log('\n📊 Character Info:');
    console.log(`- ID: ${character.id}`);
    console.log(`- Name: ${character.name}`);
    console.log(`- Level: ${character.level}`);
    console.log(`- Gold: ${character.gold}`);
    console.log(`- XP: ${character.xp}`);

    console.log('\n🎒 Inventory:');
    if (character.inventory.length === 0) {
      console.log('  Empty inventory!');
    } else {
      character.inventory.forEach(inv => {
        console.log(`  - ${inv.item.name} (${inv.item.code}) x${inv.quantity}`);
      });
    }

    // Check first recipe
    const recipe = await prisma.craftingRecipe.findFirst({
      where: { code: 'craft_sword_iron' }
    });

    if (recipe) {
      console.log('\n🔨 Recipe: Forjar Espada de Ferro');
      console.log(`- Required Level: ${recipe.requiredLevel}`);
      console.log(`- Gold Cost: ${recipe.goldCost}`);
      console.log(`- Ingredients:`, recipe.ingredients);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCharacter();
