import { Inventory, Equipment, Item } from '@prisma/client';

export interface InventoryWithItem extends Inventory {
  item: Item;
}

export interface EquipmentWithItem extends Equipment {
  inventory: InventoryWithItem | null;
}

export interface EquipItemDTO {
  inventoryId: number;
  slot: string;
}

export interface GiveItemDTO {
  itemCode: string;
  quantity: number;
}
