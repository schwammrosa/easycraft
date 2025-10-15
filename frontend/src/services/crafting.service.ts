import { api } from './api';
import { ApiResponse } from '../types';

export interface CraftingRecipe {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: string;
  resultItemCode: string;
  resultQuantity: number;
  ingredients: { itemCode: string; quantity: number }[];
  requiredLevel: number;
  craftTime: number;
  goldCost: number;
  xpReward: number;
  successRate: number;
}

export interface CraftResult {
  success: boolean;
  resultItem?: {
    itemCode: string;
    quantity: number;
  };
  xpGained: number;
  message: string;
}

export const craftingService = {
  async getRecipes(characterId: number): Promise<CraftingRecipe[]> {
    const response = await api.get<ApiResponse<{ recipes: CraftingRecipe[] }>>(
      `/crafting/${characterId}/recipes`
    );
    return response.data.data!.recipes;
  },

  async getAllRecipes(): Promise<CraftingRecipe[]> {
    const response = await api.get<ApiResponse<{ recipes: CraftingRecipe[] }>>(
      `/crafting/recipes`
    );
    return response.data.data!.recipes;
  },

  async craftItem(characterId: number, recipeCode: string): Promise<CraftResult> {
    const response = await api.post<ApiResponse<{ result: CraftResult }>>(
      `/crafting/${characterId}/craft`,
      { recipeCode }
    );
    return response.data.data!.result;
  },
};
