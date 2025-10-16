import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPotionRecipe() {
  try {
    const recipe = await prisma.craftingRecipe.findFirst({
      where: { 
        OR: [
          { code: { contains: 'potion' } },
          { name: { contains: 'Poção' } }
        ]
      }
    });

    if (!recipe) {
      console.log('❌ Potion recipe not found!');
      return;
    }

    console.log('\n📋 Recipe Info:');
    console.log(`- Code: ${recipe.code}`);
    console.log(`- Name: ${recipe.name}`);
    console.log(`- Category: ${recipe.category}`);
    
    console.log('\n🔍 Raw ingredients from DB:');
    console.log(recipe.ingredients);
    console.log('\nType:', typeof recipe.ingredients);
    console.log('Is Array:', Array.isArray(recipe.ingredients));
    
    if (Array.isArray(recipe.ingredients)) {
      console.log('\n📦 Ingredients breakdown:');
      recipe.ingredients.forEach((ing: any, i: number) => {
        console.log(`  ${i + 1}. ${JSON.stringify(ing)}`);
        console.log(`     - itemCode: ${ing.itemCode} (${typeof ing.itemCode})`);
        console.log(`     - quantity: ${ing.quantity} (${typeof ing.quantity})`);
      });
    }

    // Simulate what service does
    const parsed = typeof recipe.ingredients === 'string' 
      ? JSON.parse(recipe.ingredients as string)
      : recipe.ingredients;

    console.log('\n✅ After parsing:', parsed);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPotionRecipe();
