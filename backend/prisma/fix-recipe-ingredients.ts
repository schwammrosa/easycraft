import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRecipeIngredients() {
  console.log('🔧 Fixing recipe ingredients format...\n');

  const recipes = await prisma.craftingRecipe.findMany();

  let fixed = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    // Check if ingredients is a string
    if (typeof recipe.ingredients === 'string') {
      console.log(`📝 Fixing: ${recipe.name} (${recipe.code})`);
      console.log(`   Current (string): ${recipe.ingredients}`);
      
      try {
        const parsed = JSON.parse(recipe.ingredients);
        console.log(`   Parsed (object):`, parsed);
        
        // Update to JSON object (Prisma will handle conversion)
        await prisma.craftingRecipe.update({
          where: { id: recipe.id },
          data: {
            ingredients: parsed as any
          }
        });
        
        console.log(`   ✅ Fixed!\n`);
        fixed++;
      } catch (e) {
        console.log(`   ❌ Error parsing: ${e}\n`);
      }
    } else {
      console.log(`✓ Skipping: ${recipe.name} (already object)`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${recipes.length}`);

  await prisma.$disconnect();
}

fixRecipeIngredients();
