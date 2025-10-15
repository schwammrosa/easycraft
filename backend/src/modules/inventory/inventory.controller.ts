import { Request, Response } from 'express';
import { inventoryService } from './inventory.service';
import { logger } from '../../config/logger';

export class InventoryController {
  async getInventory(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      const inventory = await inventoryService.getInventory(characterId);

      res.json({
        success: true,
        data: { inventory },
      });
    } catch (error) {
      logger.error('Get inventory error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar inventário',
        },
      });
    }
  }

  async getEquipment(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      const equipment = await inventoryService.getEquipment(characterId);

      res.json({
        success: true,
        data: { equipment },
      });
    } catch (error) {
      logger.error('Get equipment error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar equipamentos',
        },
      });
    }
  }

  async equipItem(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      await inventoryService.equipItem(characterId, req.body);

      logger.info(`Item equipped by character ${characterId}`);

      res.json({
        success: true,
        message: 'Item equipado com sucesso',
      });
    } catch (error) {
      logger.error('Equip item error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'EQUIP_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao equipar item',
        },
      });
    }
  }

  async unequipItem(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);
      const { slot } = req.body;

      if (isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do personagem inválido',
          },
        });
        return;
      }

      await inventoryService.unequipItem(characterId, slot);

      logger.info(`Item unequipped by character ${characterId}`);

      res.json({
        success: true,
        message: 'Item desequipado com sucesso',
      });
    } catch (error) {
      logger.error('Unequip item error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'UNEQUIP_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao desequipar item',
        },
      });
    }
  }
}

export const inventoryController = new InventoryController();
