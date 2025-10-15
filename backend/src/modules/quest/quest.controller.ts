import { Request, Response } from 'express';
import { questService } from './quest.service';
import { logger } from '../../config/logger';

export class QuestController {
  async getAvailableQuests(req: Request, res: Response): Promise<void> {
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

      const quests = await questService.getAvailableQuests(characterId);

      res.json({
        success: true,
        data: { quests },
      });
    } catch (error) {
      logger.error('Get available quests error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar quests disponíveis',
        },
      });
    }
  }

  async getActiveQuests(req: Request, res: Response): Promise<void> {
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

      const quests = await questService.getActiveQuests(characterId);

      res.json({
        success: true,
        data: { quests },
      });
    } catch (error) {
      logger.error('Get active quests error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar quests ativas',
        },
      });
    }
  }

  async acceptQuest(req: Request, res: Response): Promise<void> {
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

      const characterQuest = await questService.acceptQuest(characterId, req.body);

      logger.info(`Character ${characterId} accepted quest ${characterQuest.quest.code}`);

      res.json({
        success: true,
        data: { characterQuest },
      });
    } catch (error) {
      logger.error('Accept quest error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'QUEST_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao aceitar quest',
        },
      });
    }
  }

  async claimQuest(req: Request, res: Response): Promise<void> {
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

      logger.info(`Claiming quest for character ${characterId}, body:`, req.body);

      const rewards = await questService.claimQuest(characterId, req.body);

      logger.info(`Character ${characterId} claimed quest rewards`);

      res.json({
        success: true,
        data: { rewards },
      });
    } catch (error) {
      logger.error('Claim quest error:', error);

      if (error instanceof Error) {
        logger.error('Error message:', error.message);
        logger.error('Error stack:', error.stack);
        res.status(400).json({
          success: false,
          error: {
            code: 'QUEST_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao coletar recompensa',
        },
      });
    }
  }
}

export const questController = new QuestController();
