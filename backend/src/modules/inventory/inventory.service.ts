import { PrismaClient, EquipmentSlot, Inventory, Item } from '@prisma/client';
import { GiveItemDTO, EquipItemDTO, UseItemDTO, UseItemResult } from './inventory.types';
import { questService } from '../quest/quest.service';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

type InventoryWithItem = Inventory & {
  item: Item;
};

export class InventoryService {
  async getInventory(characterId: number): Promise<InventoryWithItem[]> {
    const inventory = await prisma.inventory.findMany({
      where: { characterId },
      include: { item: true },
      orderBy: { acquiredAt: 'desc' },
    });

    return inventory;
  }

  async getEquipment(characterId: number) {
    const equipment = await prisma.equipment.findMany({
      where: { characterId },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });

    return equipment;
  }

  async equipItem(characterId: number, data: EquipItemDTO): Promise<void> {
    const { inventoryId, slot } = data;

    logger.info(`Equipping item: characterId=${characterId}, inventoryId=${inventoryId}, slot=${slot}`);

    // Validate slot
    if (!Object.values(EquipmentSlot).includes(slot as EquipmentSlot)) {
      logger.error(`Invalid slot: ${slot}`);
      throw new Error('Slot inválido');
    }

    // Get inventory item
    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        characterId,
      },
      include: { item: true },
    });

    if (!inventoryItem) {
      logger.error(`Item not found: inventoryId=${inventoryId}, characterId=${characterId}`);
      throw new Error('Item não encontrado no inventário');
    }

    logger.info(`Found item: ${inventoryItem.item.name}, slot=${inventoryItem.item.slot}, requiredSlot=${slot}`);

    // Check if item can be equipped in this slot
    if (inventoryItem.item.slot !== slot) {
      logger.error(`Slot mismatch: item.slot=${inventoryItem.item.slot}, requiredSlot=${slot}`);
      throw new Error(`Este item não pode ser equipado no slot ${slot}`);
    }

    // Check if item is already equipped
    const alreadyEquipped = await prisma.equipment.findFirst({
      where: {
        characterId,
        inventoryId,
      },
    });

    if (alreadyEquipped) {
      throw new Error('Item já está equipado');
    }

    // Unequip any item in the target slot
    const currentEquipped = await prisma.equipment.findUnique({
      where: {
        characterId_slot: {
          characterId,
          slot: slot as EquipmentSlot,
        },
      },
    });

    if (currentEquipped) {
      await prisma.equipment.delete({
        where: {
          characterId_slot: {
            characterId,
            slot: slot as EquipmentSlot,
          },
        },
      });
    }

    // Equip the new item
    await prisma.equipment.create({
      data: {
        characterId,
        slot: slot as EquipmentSlot,
        inventoryId,
      },
    });

    // Recalculate stats
    await this.recalculateStats(characterId);

    // Update quest progress
    await questService.updateQuestProgress(characterId, {
      type: 'equip_item',
    });
  }

  async unequipItem(characterId: number, slot: string): Promise<void> {
    // Validate slot
    if (!Object.values(EquipmentSlot).includes(slot as EquipmentSlot)) {
      throw new Error('Slot inválido');
    }

    const equipment = await prisma.equipment.findUnique({
      where: {
        characterId_slot: {
          characterId,
          slot: slot as EquipmentSlot,
        },
      },
    });

    if (!equipment) {
      throw new Error('Nenhum item equipado neste slot');
    }

    await prisma.equipment.delete({
      where: {
        characterId_slot: {
          characterId,
          slot: slot as EquipmentSlot,
        },
      },
    });

    // Recalculate stats
    await this.recalculateStats(characterId);
  }

  async giveItem(characterId: number, data: GiveItemDTO): Promise<InventoryWithItem> {
    const { itemCode, quantity } = data;

    // Find item
    const item = await prisma.item.findUnique({
      where: { code: itemCode },
    });

    if (!item) {
      throw new Error('Item não encontrado');
    }

    // Check if item already exists in inventory
    const existingInventory = await prisma.inventory.findUnique({
      where: {
        characterId_itemId: {
          characterId,
          itemId: item.id,
        },
      },
    });

    if (existingInventory) {
      // Update quantity
      const updated = await prisma.inventory.update({
        where: { id: existingInventory.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
        include: { item: true },
      });

      return updated;
    } else {
      // Create new inventory entry
      const created = await prisma.inventory.create({
        data: {
          characterId,
          itemId: item.id,
          quantity,
        },
        include: { item: true },
      });

      return created;
    }
  }

  private async recalculateStats(characterId: number): Promise<void> {
    // Get base stats
    const stats = await prisma.characterStats.findUnique({
      where: { characterId },
    });

    if (!stats) {
      throw new Error('Stats não encontrados');
    }

    // Get all equipped items
    const equipment = await prisma.equipment.findMany({
      where: { characterId },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
      },
    });

    // Calculate total stats
    let totalStr = stats.str;
    let totalAgi = stats.agi;
    let totalVit = stats.vit;
    let totalInt = stats.int;
    let totalDef = stats.def;

    for (const equip of equipment) {
      if (equip.inventory?.item.attributes) {
        const attrs = equip.inventory.item.attributes as any;
        totalStr += attrs.str || 0;
        totalAgi += attrs.agi || 0;
        totalVit += attrs.vit || 0;
        totalInt += attrs.int || 0;
        totalDef += attrs.def || 0;
      }
    }

    // Update stats
    await prisma.characterStats.update({
      where: { characterId },
      data: {
        totalStr,
        totalAgi,
        totalVit,
        totalInt,
        totalDef,
      },
    });
  }

  async useItem(characterId: number, data: UseItemDTO): Promise<UseItemResult> {
    const { inventoryId } = data;

    logger.info(`Using item: characterId=${characterId}, inventoryId=${inventoryId}`);

    // Get inventory item
    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        characterId,
      },
      include: { item: true },
    });

    if (!inventoryItem) {
      throw new Error('Item não encontrado no inventário');
    }

    // Check if item is consumable
    if (inventoryItem.item.type !== 'consumable') {
      throw new Error('Este item não pode ser usado');
    }

    // Get character
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Apply item effects based on attributes
    const attributes = inventoryItem.item.attributes as any;
    let message = '';
    const effect: any = {};

    // HP Healing
    if (attributes.healAmount) {
      const currentHp = character.hp;
      const maxHp = character.maxHp;
      const healAmount = attributes.healAmount;
      const newHp = Math.min(currentHp + healAmount, maxHp);
      const actualHeal = newHp - currentHp;

      await prisma.character.update({
        where: { id: characterId },
        data: { hp: newHp },
      });

      effect.hpRestored = actualHeal;
      message = `Você usou ${inventoryItem.item.name} e recuperou ${actualHeal} HP!`;
      
      logger.info(`HP restored: ${actualHeal} (${currentHp} -> ${newHp})`);
    }

    // Buffs (future implementation)
    if (attributes.buff) {
      effect.buffApplied = attributes.buff;
      message += ` Buff ${attributes.buff} aplicado!`;
    }

    // Consume item
    if (inventoryItem.quantity > 1) {
      await prisma.inventory.update({
        where: { id: inventoryItem.id },
        data: { quantity: inventoryItem.quantity - 1 },
      });
    } else {
      await prisma.inventory.delete({
        where: { id: inventoryItem.id },
      });
    }

    logger.info(`Item used successfully: ${inventoryItem.item.name}`);

    return {
      success: true,
      message: message || `Você usou ${inventoryItem.item.name}!`,
      effect,
    };
  }
}

export const inventoryService = new InventoryService();
