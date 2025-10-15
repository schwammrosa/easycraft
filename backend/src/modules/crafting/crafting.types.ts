export interface CraftItemDTO {
  recipeCode: string;
}

export interface Ingredient {
  itemCode: string;
  quantity: number;
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
