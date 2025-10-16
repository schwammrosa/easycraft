import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listPotionRecipes() {
  try {
    const recipes = await prisma.craftingRecipe.findMany({
      where: {
        OR: [
          { code: { contains: 'potion' } },
          { name: { contains: 'Poção' } }
        ]
      },
      orderBy: { requiredLevel: 'asc' }
    });

    console.log(`\nFound ${recipes.length} potion recipes:\n`);

    recipes.forEach((recipe, i) => {
      console.log(`${i + 1}. ${recipe.name}`);
      console.log(`   Code: ${recipe.code}`);
      console.log(`   Level: ${recipe.requiredLevel}`);
      console.log(`   Ingredients type: ${typeof recipe.ingredients}`);
      console.log(`   Ingredients raw:`, recipe.ingredients);
      
      // Try to parse
      try {
        const parsed = typeof recipe.ingredients === 'string' 
          ? JSON.parse(recipe.ingredients)
          : recipe.ingredients;
        console.log(`   Ingredients parsed:`, parsed);
      } catch (e) {
        console.log(`   ❌ Parse error:`, e);
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listPotionRecipes();
