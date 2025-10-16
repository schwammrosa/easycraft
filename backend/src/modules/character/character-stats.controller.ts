import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { characterStatsService } from './character-stats.service';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

export class CharacterStatsController {
  
  /**
   * POST /api/characters/:characterId/stats/distribute
   * Distribui pontos de atributo
   */
  async distributeStats(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.characterId);
      const { str, agi, vit, int } = req.body;

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

      // Validar que pelo menos um ponto foi especificado
      if (!str && !agi && !vit && !int) {
        res.status(400).json({
          success: false,
          error: {
            code: 'NO_POINTS',
            message: 'Você precisa distribuir pelo menos 1 ponto',
          },
        });
        return;
      }

      // Validar que são números positivos
      const points = { str, agi, vit, int };
      for (const [stat, value] of Object.entries(points)) {
        if (value !== undefined && (typeof value !== 'number' || value < 0)) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_POINTS',
              message: `${stat.toUpperCase()} deve ser um número positivo`,
            },
          });
          return;
        }
      }

      await characterStatsService.distributeStatPoints(characterId, points);

      logger.info(`Character ${characterId} distributed stat points: ${JSON.stringify(points)}`);

      res.json({
        success: true,
        message: 'Pontos distribuídos com sucesso!',
      });
    } catch (error: any) {
      logger.error('Distribute stats error:', error);

      res.status(400).json({
        success: false,
        error: {
          code: 'DISTRIBUTE_ERROR',
          message: error.message || 'Erro ao distribuir pontos',
        },
      });
    }
  }

  /**
   * POST /api/characters/:characterId/stats/reset
   * Reseta stats do personagem
   */
  async resetStats(req: Request, res: Response): Promise<void> {
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

      // Buscar character para pegar level
      const character = await prisma.character.findUnique({
        where: { id: characterId }
      });

      if (!character) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Personagem não encontrado',
          },
        });
        return;
      }

      const cost = characterStatsService.getResetCost(character.level);

      await characterStatsService.resetStats(characterId, cost);

      logger.info(`Character ${characterId} reset stats (cost: ${cost})`);

      res.json({
        success: true,
        message: `Stats resetados! Custo: ${cost} gold`,
        data: { goldSpent: cost },
      });
    } catch (error: any) {
      logger.error('Reset stats error:', error);

      res.status(400).json({
        success: false,
        error: {
          code: 'RESET_ERROR',
          message: error.message || 'Erro ao resetar stats',
        },
      });
    }
  }

  /**
   * GET /api/characters/:characterId/stats/reset-cost
   * Obtém custo para resetar stats
   */
  async getResetCost(req: Request, res: Response): Promise<void> {
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

      const character = await prisma.character.findUnique({
        where: { id: characterId }
      });

      if (!character) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Personagem não encontrado',
          },
        });
        return;
      }

      const cost = characterStatsService.getResetCost(character.level);

      res.json({
        success: true,
        data: {
          cost,
          level: character.level,
        },
      });
    } catch (error: any) {
      logger.error('Get reset cost error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar custo',
        },
      });
    }
  }
}

export const characterStatsController = new CharacterStatsController();
