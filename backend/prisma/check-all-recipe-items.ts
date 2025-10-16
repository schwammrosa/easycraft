import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllRecipeItems() {
  try {
    console.log('🔍 Checking ALL recipe result items...\n');

    const recipes = await prisma.craftingRecipe.findMany({
      orderBy: { requiredLevel: 'asc' }
    });

    let missing = 0;
    let found = 0;
    const missingItems: string[] = [];

    for (const recipe of recipes) {
      const resultItem = await prisma.item.findFirst({
        where: { code: recipe.resultItemCode }
      });

      if (resultItem) {
        found++;
      } else {
        missing++;
        console.log(`❌ ${recipe.name}`);
        console.log(`   Code: ${recipe.code}`);
        console.log(`   Missing item: ${recipe.resultItemCode}\n`);
        missingItems.push(recipe.resultItemCode);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Found: ${found}`);
    console.log(`   ❌ Missing: ${missing}`);
    console.log(`   Total recipes: ${recipes.length}`);

    if (missingItems.length > 0) {
      console.log(`\n⚠️  Missing items:`);
      missingItems.forEach(item => console.log(`   - ${item}`));
    } else {
      console.log(`\n🎉 All recipe items exist!`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllRecipeItems();
