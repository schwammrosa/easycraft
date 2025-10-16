import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecipeFormat() {
  try {
    const recipe = await prisma.craftingRecipe.findFirst({
      where: { code: 'craft_sword_iron' }
    });

    if (!recipe) {
      console.log('❌ Recipe not found!');
      return;
    }

    console.log('\n📋 Raw Recipe from DB:');
    console.log(JSON.stringify(recipe, null, 2));

    console.log('\n🔍 Ingredients type:', typeof recipe.ingredients);
    console.log('🔍 Ingredients value:', recipe.ingredients);

    // Simulate what the service does
    const parsed = typeof recipe.ingredients === 'string' 
      ? JSON.parse(recipe.ingredients as string)
      : recipe.ingredients;

    console.log('\n✅ Parsed ingredients:', parsed);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecipeFormat();
