import { Request, Response } from 'express';
import { battleService } from './battle.service';
import { logger } from '../../config/logger';

export class BattleController {
  async startBattle(req: Request, res: Response): Promise<void> {
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

      const result = await battleService.startBattle(characterId, req.body);

      logger.info(`Battle completed: Character ${characterId} vs ${req.body.enemyCode} - ${result.victory ? 'Victory' : 'Defeat'}`);

      res.json({
        success: true,
        data: { result },
      });
    } catch (error) {
      logger.error('Start battle error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BATTLE_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao iniciar batalha',
        },
      });
    }
  }

  async getEnemies(req: Request, res: Response): Promise<void> {
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

      // Get character level
      const { characterService } = await import('../character/character.service');
      const character = await characterService.getCharacterById(characterId, req.user!.userId);

      // Get enemies within level range
      const minLevel = Math.max(1, character.level - 2);
      const maxLevel = character.level + 5;
      
      const enemies = await battleService.getEnemiesByLevel(minLevel, maxLevel);

      res.json({
        success: true,
        data: { enemies },
      });
    } catch (error) {
      logger.error('Get enemies error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar inimigos',
        },
      });
    }
  }

  async rest(req: Request, res: Response): Promise<void> {
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

      await battleService.restCharacter(characterId);

      logger.info(`Character ${characterId} rested and recovered HP`);

      res.json({
        success: true,
        message: 'HP restaurado com sucesso',
      });
    } catch (error) {
      logger.error('Rest error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao descansar',
        },
      });
    }
  }

  async startFarmMode(req: Request, res: Response): Promise<void> {
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

      const result = await battleService.startFarmModeAsync(characterId, req.body);

      logger.info(`Farm session ${result.sessionId} started for character ${characterId}`);

      res.json({
        success: true,
        data: { sessionId: result.sessionId },
      });
    } catch (error) {
      logger.error('Farm mode error:', error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: {
            code: 'FARM_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro no modo farm',
        },
      });
    }
  }

  async getFarmSessionStatus(req: Request, res: Response): Promise<void> {
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

      const session = await battleService.getFarmSessionStatus(sessionId);

      res.json({
        success: true,
        data: { session },
      });
    } catch (error) {
      logger.error('Get farm session status error:', error);

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
          message: 'Erro ao buscar status',
        },
      });
    }
  }

  async cancelFarmSession(req: Request, res: Response): Promise<void> {
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

      await battleService.cancelFarmSession(sessionId);

      res.json({
        success: true,
        message: 'Farm cancelado com sucesso',
      });
    } catch (error) {
      logger.error('Cancel farm session error:', error);

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
          message: 'Erro ao cancelar farm',
        },
      });
    }
  }

  async getActiveFarmSession(req: Request, res: Response): Promise<void> {
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

      const session = await battleService.getActiveFarmSession(characterId);

      res.json({
        success: true,
        data: { session },
      });
    } catch (error) {
      logger.error('Get active farm session error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar sessão ativa',
        },
      });
    }
  }

  async getLatestFarmSession(req: Request, res: Response): Promise<void> {
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

      const session = await battleService.getLatestFarmSession(characterId);

      res.json({
        success: true,
        data: { session },
      });
    } catch (error) {
      logger.error('Get latest farm session error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar última sessão',
        },
      });
    }
  }
}

export const battleController = new BattleController();
