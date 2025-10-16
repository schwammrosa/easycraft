import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMissingPotionItems() {
  try {
    console.log('🔍 Checking potion recipes and their result items...\n');

    const potionRecipes = await prisma.craftingRecipe.findMany({
      where: {
        OR: [
          { code: { contains: 'potion' } },
          { name: { contains: 'Poção' } }
        ]
      },
      orderBy: { requiredLevel: 'asc' }
    });

    for (const recipe of potionRecipes) {
      console.log(`📋 Recipe: ${recipe.name}`);
      console.log(`   Code: ${recipe.code}`);
      console.log(`   Result Item Code: ${recipe.resultItemCode}`);
      
      // Check if result item exists
      const resultItem = await prisma.item.findFirst({
        where: { code: recipe.resultItemCode }
      });

      if (resultItem) {
        console.log(`   ✅ Item EXISTS: ${resultItem.name} (ID: ${resultItem.id})`);
      } else {
        console.log(`   ❌ Item MISSING: ${recipe.resultItemCode}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMissingPotionItems();
