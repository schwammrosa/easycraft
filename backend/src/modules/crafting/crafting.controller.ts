import { Request, Response } from 'express';
import { craftingService } from './crafting.service';
import { logger } from '../../config/logger';

export class CraftingController {
  async getRecipes(req: Request, res: Response): Promise<void> {
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

      const recipes = await craftingService.getRecipes(characterId);

      res.json({
        success: true,
        data: { recipes },
      });
    } catch (error) {
      logger.error('Get recipes error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar receitas',
        },
      });
    }
  }

  async getAllRecipes(_req: Request, res: Response): Promise<void> {
    try {
      const recipes = await craftingService.getAllRecipes();

      res.json({
        success: true,
        data: { recipes },
      });
    } catch (error) {
      logger.error('Get all recipes error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar receitas',
        },
      });
    }
  }

  async craftItem(req: Request, res: Response): Promise<void> {
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

      logger.info(`Crafting request - CharacterId: ${characterId}, Body:`, req.body);

      const result = await craftingService.craftItem(characterId, req.body);

      logger.info(`Character ${characterId} crafted item: ${result.success ? 'SUCCESS' : 'FAIL'}`);

      res.json({
        success: true,
        data: { result },
      });
    } catch (error) {
      logger.error('Craft item error:', error);
      logger.error('Error details:', {
        characterId: req.params.characterId,
        body: req.body,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CRAFTING_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao craftar item',
        },
      });
    }
  }
}

export const craftingController = new CraftingController();
