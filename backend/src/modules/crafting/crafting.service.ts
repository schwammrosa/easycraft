import { PrismaClient } from '@prisma/client';
import { CraftItemDTO, CraftResult, Ingredient } from './crafting.types';
import { inventoryService } from '../inventory/inventory.service';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

export class CraftingService {
  async getRecipes(characterId: number) {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Get all recipes available for character level
    const recipes = await prisma.craftingRecipe.findMany({
      where: {
        requiredLevel: {
          lte: character.level,
        },
      },
      orderBy: [
        { category: 'asc' },
        { requiredLevel: 'asc' },
      ],
    });

    return recipes;
  }

  async getAllRecipes() {
    return await prisma.craftingRecipe.findMany({
      orderBy: [
        { category: 'asc' },
        { requiredLevel: 'asc' },
      ],
    });
  }

  async craftItem(characterId: number, data: CraftItemDTO): Promise<CraftResult> {
    // Get recipe
    const recipe = await prisma.craftingRecipe.findUnique({
      where: { code: data.recipeCode },
    });

    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    // Get character
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Check level requirement
    if (character.level < recipe.requiredLevel) {
      throw new Error(`Nível ${recipe.requiredLevel} necessário para esta receita`);
    }

    // Check gold cost
    const currentGold = Number(character.gold);
    if (currentGold < recipe.goldCost) {
      throw new Error(`Gold insuficiente. Necessário: ${recipe.goldCost}, Disponível: ${currentGold}`);
    }

    // Get character inventory
    const inventory = await prisma.inventory.findMany({
      where: { characterId },
      include: { item: true },
    });

    // Check ingredients
    const ingredients = recipe.ingredients as unknown as Ingredient[];
    const missingIngredients: string[] = [];

    for (const ingredient of ingredients) {
      const inventoryItem = inventory.find(inv => inv.item.code === ingredient.itemCode);
      
      if (!inventoryItem || inventoryItem.quantity < ingredient.quantity) {
        const available = inventoryItem?.quantity || 0;
        missingIngredients.push(
          `${ingredient.itemCode}: ${ingredient.quantity} necessário, ${available} disponível`
        );
      }
    }

    if (missingIngredients.length > 0) {
      throw new Error(`Ingredientes insuficientes:\n${missingIngredients.join('\n')}`);
    }

    // Calculate success (based on success rate)
    const random = Math.random();
    const success = random <= recipe.successRate;

    // Remove ingredients (even if craft fails)
    for (const ingredient of ingredients) {
      const inventoryItem = inventory.find(inv => inv.item.code === ingredient.itemCode);
      
      if (inventoryItem) {
        const newQuantity = inventoryItem.quantity - ingredient.quantity;
        
        if (newQuantity <= 0) {
          await prisma.inventory.delete({
            where: { id: inventoryItem.id },
          });
        } else {
          await prisma.inventory.update({
            where: { id: inventoryItem.id },
            data: { quantity: newQuantity },
          });
        }
      }
    }

    // Deduct gold cost
    await prisma.character.update({
      where: { id: characterId },
      data: {
        gold: currentGold - recipe.goldCost,
      },
    });

    const result: CraftResult = {
      success,
      xpGained: success ? recipe.xpReward : Math.floor(recipe.xpReward * 0.25),
      message: success 
        ? `Sucesso! Você craftou ${recipe.name}!`
        : 'Falha no crafting! Materiais perdidos mas você ganhou um pouco de XP.',
    };

    // Give result item if success
    if (success) {
      await inventoryService.giveItem(characterId, {
        itemCode: recipe.resultItemCode,
        quantity: recipe.resultQuantity,
      });

      result.resultItem = {
        itemCode: recipe.resultItemCode,
        quantity: recipe.resultQuantity,
      };
    }

    // Give XP
    if (result.xpGained > 0) {
      const currentXp = Number(character.xp);
      const newXp = currentXp + result.xpGained;
      await prisma.character.update({
        where: { id: characterId },
        data: { xp: newXp },
      });
    }

    logger.info(`Character ${characterId} crafted ${recipe.code}: ${success ? 'SUCCESS' : 'FAIL'}`);

    return result;
  }

  async getRecipeByCode(recipeCode: string) {
    return await prisma.craftingRecipe.findUnique({
      where: { code: recipeCode },
    });
  }
}

export const craftingService = new CraftingService();
