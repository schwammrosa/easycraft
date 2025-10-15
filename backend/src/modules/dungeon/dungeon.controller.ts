import { Request, Response } from 'express';
import { dungeonService } from './dungeon.service';
import { logger } from '../../config/logger';

export const dungeonController = {
  // GET /api/dungeons
  async getAllDungeons(_req: Request, res: Response) {
    try {
      const dungeons = await dungeonService.getAllDungeons();
      
      res.json({
        success: true,
        data: { dungeons },
      });
    } catch (error: any) {
      logger.error('Error fetching dungeons:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao buscar dungeons',
          details: error.message,
        },
      });
    }
  },

  // GET /api/dungeons/:id
  async getDungeonById(req: Request, res: Response) {
    try {
      const dungeonId = parseInt(req.params.id);
      const dungeon = await dungeonService.getDungeonById(dungeonId);

      if (!dungeon) {
        return res.status(404).json({
          success: false,
          error: { message: 'Dungeon não encontrada' },
        });
      }

      return res.json({
        success: true,
        data: { dungeon },
      });
    } catch (error: any) {
      logger.error('Error fetching dungeon:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao buscar dungeon',
          details: error.message,
        },
      });
    }
  },

  // GET /api/dungeons/:characterId/can-enter/:dungeonId
  async canEnterDungeon(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      const dungeonId = parseInt(req.params.dungeonId);

      const result = await dungeonService.canEnterDungeon(characterId, dungeonId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error checking cooldown:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao verificar cooldown',
          details: error.message,
        },
      });
    }
  },

  // POST /api/dungeons/:characterId/enter
  async enterDungeon(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      const { dungeonId, difficulty } = req.body;

      const run = await dungeonService.enterDungeon(characterId, {
        dungeonId,
        difficulty,
      });

      res.json({
        success: true,
        data: { run },
      });
    } catch (error: any) {
      logger.error('Error entering dungeon:', error);
      res.status(400).json({
        success: false,
        error: {
          message: error.message || 'Erro ao entrar na dungeon',
        },
      });
    }
  },

  // POST /api/dungeons/:characterId/battle
  async battleFloor(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      const { runId, floorNumber } = req.body;

      const result = await dungeonService.battleFloor(characterId, {
        runId,
        floorNumber,
      });

      res.json({
        success: true,
        data: { result },
      });
    } catch (error: any) {
      logger.error('Error in floor battle:', error);
      logger.error('Error stack:', error.stack);
      logger.error('Error message:', error.message);
      res.status(400).json({
        success: false,
        error: {
          message: error.message || 'Erro na batalha',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      });
    }
  },

  // GET /api/dungeons/:characterId/active
  async getActiveRun(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      const run = await dungeonService.getActiveRun(characterId);

      res.json({
        success: true,
        data: { run },
      });
    } catch (error: any) {
      logger.error('Error fetching active run:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao buscar dungeon ativa',
          details: error.message,
        },
      });
    }
  },

  // GET /api/dungeons/:characterId/history
  async getRunHistory(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      const runs = await dungeonService.getRunHistory(characterId);

      res.json({
        success: true,
        data: { runs },
      });
    } catch (error: any) {
      logger.error('Error fetching run history:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao buscar histórico',
          details: error.message,
        },
      });
    }
  },

  // GET /api/dungeons/:dungeonId/leaderboard
  async getLeaderboard(req: Request, res: Response) {
    try {
      const dungeonId = parseInt(req.params.dungeonId);
      const leaderboard = await dungeonService.getLeaderboard(dungeonId);

      res.json({
        success: true,
        data: { leaderboard },
      });
    } catch (error: any) {
      logger.error('Error fetching leaderboard:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Erro ao buscar leaderboard',
          details: error.message,
        },
      });
    }
  },
};
