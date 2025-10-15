import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

export class ItemController {
  async getAllItems(_req: Request, res: Response): Promise<void> {
    try {
      const items = await prisma.item.findMany({
        orderBy: [
          { type: 'asc' },
          { baseValue: 'asc' },
        ],
      });

      res.json({
        success: true,
        data: { items },
      });
    } catch (error) {
      logger.error('Get items error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar itens',
        },
      });
    }
  }

  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const itemId = parseInt(req.params.id);

      if (isNaN(itemId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID do item inválido',
          },
        });
        return;
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ITEM_NOT_FOUND',
            message: 'Item não encontrado',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: { item },
      });
    } catch (error) {
      logger.error('Get item error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar item',
        },
      });
    }
  }
}

export const itemController = new ItemController();
