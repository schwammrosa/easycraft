import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCraftPotion() {
  try {
    const characterId = 2; // BonecoTeste
    const recipeCode = 'craft_potion_hp_small'; // Poção Pequena

    console.log(`🧪 Testing craft: ${recipeCode} for character ${characterId}\n`);

    // Get recipe
    const recipe = await prisma.craftingRecipe.findUnique({
      where: { code: recipeCode }
    });

    if (!recipe) {
      console.log('❌ Recipe not found!');
      return;
    }

    console.log('📋 Recipe:', recipe.name);
    console.log('Ingredients type:', typeof recipe.ingredients);
    console.log('Ingredients raw:', recipe.ingredients);
    console.log('Is array?:', Array.isArray(recipe.ingredients));

    // Cast ingredients
    const ingredients = recipe.ingredients as any;
    console.log('\nIngredients after cast:', ingredients);
    console.log('Length:', ingredients.length);

    // Check each ingredient
    console.log('\n🔍 Checking ingredients:');
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      console.log(`  ${i + 1}. itemCode: ${ing?.itemCode}, quantity: ${ing?.quantity}`);
      console.log(`     Type: ${typeof ing}, Keys:`, Object.keys(ing || {}));
    }

    // Get inventory
    const inventory = await prisma.inventory.findMany({
      where: { characterId },
      include: { item: true }
    });

    console.log('\n🎒 Inventory:');
    for (const ing of ingredients) {
      if (!ing || !ing.itemCode) {
        console.log(`  ❌ Invalid ingredient:`, ing);
        continue;
      }
      
      const invItem = inventory.find(inv => inv.item.code === ing.itemCode);
      const available = invItem?.quantity || 0;
      const needed = ing.quantity;
      const hasEnough = available >= needed;
      
      console.log(`  ${hasEnough ? '✅' : '❌'} ${ing.itemCode}: ${available} / ${needed}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCraftPotion();
