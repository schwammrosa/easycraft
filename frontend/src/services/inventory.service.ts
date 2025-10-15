import { api } from './api';
import { ApiResponse } from '../types';

export interface Item {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: string;
  slot: string | null;
  baseValue: number;
  maxStack: number;
  attributes: any;
  imagePath: string | null;
  isTradeable: boolean;
  isCraftable: boolean;
}

export interface InventoryItem {
  id: number;
  characterId: number;
  itemId: number;
  quantity: number;
  acquiredAt: string;
  item: Item;
}

export interface Equipment {
  characterId: number;
  slot: string;
  inventoryId: number | null;
  equippedAt: string;
  inventory: InventoryItem | null;
}

export const inventoryService = {
  async getInventory(characterId: number): Promise<InventoryItem[]> {
    const response = await api.get<ApiResponse<{ inventory: InventoryItem[] }>>(
      `/inventory/${characterId}`
    );
    return response.data.data!.inventory;
  },

  async getEquipment(characterId: number): Promise<Equipment[]> {
    const response = await api.get<ApiResponse<{ equipment: Equipment[] }>>(
      `/inventory/${characterId}/equipment`
    );
    return response.data.data!.equipment;
  },

  async equipItem(characterId: number, inventoryId: number, slot: string): Promise<void> {
    await api.post(`/inventory/${characterId}/equip`, {
      inventoryId,
      slot,
    });
  },

  async unequipItem(characterId: number, slot: string): Promise<void> {
    await api.post(`/inventory/${characterId}/unequip`, {
      slot,
    });
  },

  async getAllItems(): Promise<Item[]> {
    const response = await api.get<ApiResponse<{ items: Item[] }>>('/items');
    return response.data.data!.items;
  },
};
