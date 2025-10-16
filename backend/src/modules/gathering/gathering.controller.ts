import { Request, Response } from 'express';
import { gatheringService } from './gathering.service';
import { logger } from '../../config/logger';

export class GatheringController {
  async getGatherNodes(req: Request, res: Response): Promise<void> {
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

      // Get character (only for validation)
      const { characterService } = await import('../character/character.service');
      await characterService.getCharacterById(characterId, req.user!.userId);

      // Get ALL gather nodes - frontend will handle level restrictions
      const nodes = await gatheringService.getGatherNodes();

      res.json({
        success: true,
        data: { nodes },
      });
    } catch (error) {
      logger.error('Get gather nodes error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar nodos de coleta',
        },
      });
    }
  }

  async startGatherSession(req: Request, res: Response): Promise<void> {
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

      const result = await gatheringService.startGatherSessionAsync(characterId, req.body);

      logger.info(`Gather session ${result.sessionId} started for character ${characterId}`);

      res.json({
        success: true,
        data: { sessionId: result.sessionId },
      });
    } catch (error) {
      logger.error('Start gather session error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'GATHER_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao iniciar coleta',
        },
      });
    }
  }

  async getGatherSessionStatus(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = parseInt(req.params.sessionId);

      if (isNaN(sessionId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID da sessão inválido',
          },
        });
        return;
      }

      const session = await gatheringService.getGatherSessionStatus(sessionId);

      res.json({
        success: true,
        data: { session },
      });
    } catch (error) {
      logger.error('Get gather session status error:', error);

      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar status da coleta',
        },
      });
    }
  }

  async cancelGatherSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const characterId = parseInt(req.params.characterId);

      if (isNaN(sessionId) || isNaN(characterId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'ID inválido',
          },
        });
        return;
      }

      await gatheringService.cancelGatherSession(sessionId, characterId);

      logger.info(`Gather session ${sessionId} cancelled by character ${characterId}`);

      res.json({
        success: true,
        message: 'Coleta cancelada',
      });
    } catch (error) {
      logger.error('Cancel gather session error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'CANCEL_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao cancelar coleta',
        },
      });
    }
  }

  async getGatherHistory(req: Request, res: Response): Promise<void> {
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

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await gatheringService.getGatherHistory(characterId, limit);

      res.json({
        success: true,
        data: { history },
      });
    } catch (error) {
      logger.error('Get gather history error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar histórico',
        },
      });
    }
  }

  async getActiveGatherSession(req: Request, res: Response): Promise<void> {
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

      const session = await gatheringService.getActiveGatherSession(characterId);

      res.json({
        success: true,
        data: { session },
      });
    } catch (error) {
      logger.error('Get active gather session error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar sessão ativa',
        },
      });
    }
  }
}

export const gatheringController = new GatheringController();
