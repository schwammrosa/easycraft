import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Ingredient {
  itemCode: string;
  quantity: number;
}

async function main() {
  console.log('🔍 Verificando receitas de crafting...\n');

  const recipes = await prisma.craftingRecipe.findMany();

  console.log(`📋 Total de receitas: ${recipes.length}\n`);

  const allItemCodesInRecipes = new Set<string>();

  for (const recipe of recipes) {
    console.log(`\n🔨 Receita ID: ${recipe.id} - ${recipe.name}`);
    console.log(`   Resultado: ${recipe.resultItemCode} (${recipe.resultQuantity}x)`);
    
    allItemCodesInRecipes.add(recipe.resultItemCode);
    
    // Verificar se o item resultado existe
    const resultItem = await prisma.item.findUnique({
      where: { code: recipe.resultItemCode },
    });

    if (!resultItem) {
      console.log(`   ❌ ERRO: Item resultado "${recipe.resultItemCode}" NÃO EXISTE!`);
    } else {
      console.log(`   ✅ Item resultado: ${resultItem.name}`);
    }

    // Verificar ingredientes (JSON)
    const ingredients = recipe.ingredients as any as Ingredient[];
    console.log(`   Ingredientes:`);
    
    for (const ing of ingredients) {
      allItemCodesInRecipes.add(ing.itemCode);
      
      const item = await prisma.item.findUnique({
        where: { code: ing.itemCode },
      });

      if (!item) {
        console.log(`     ❌ ${ing.quantity}x ${ing.itemCode} - NÃO EXISTE!`);
      } else {
        console.log(`     ✓ ${ing.quantity}x ${item.name} (${ing.itemCode})`);
      }
    }
  }

  // Verificar items órfãos nas receitas
  console.log('\n\n🔍 Verificando items que as receitas precisam...\n');

  const itemCodesArray = Array.from(allItemCodesInRecipes);
  const existingItems = await prisma.item.findMany({
    where: {
      code: {
        in: itemCodesArray,
      },
    },
    select: {
      code: true,
      name: true,
    },
  });

  const existingCodes = existingItems.map(i => i.code);
  const missingCodes = itemCodesArray.filter(code => !existingCodes.includes(code));

  if (missingCodes.length > 0) {
    console.log(`❌ Items FALTANDO no banco (${missingCodes.length}):`);
    missingCodes.forEach(code => {
      console.log(`  ✗ ${code}`);
    });
  } else {
    console.log('✅ Todos os items necessários para crafting existem!\n');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
