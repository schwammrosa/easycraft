import { Request, Response } from 'express';
import { characterService } from './character.service';
import { createCharacterSchema, updateCharacterAppearanceSchema } from './character.validation';
import { logger } from '../../config/logger';

export class CharacterController {
  async getCharacters(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const characters = await characterService.getCharactersByUserId(userId);

      res.json({
        success: true,
        data: { characters },
      });
    } catch (error) {
      logger.error('Get characters error:', error);
      console.error('Get characters detailed error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar personagens',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  async getCharacter(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const characterId = parseInt(req.params.id);

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

      const character = await characterService.getCharacterById(characterId, userId);

      res.json({
        success: true,
        data: { character },
      });
    } catch (error) {
      logger.error('Get character error:', error);

      if (error instanceof Error && error.message === 'Personagem não encontrado') {
        res.status(404).json({
          success: false,
          error: {
            code: 'CHARACTER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar personagem',
        },
      });
    }
  }

  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Validate input
      const validatedData = createCharacterSchema.parse(req.body);

      // Create character
      const character = await characterService.createCharacter(userId, validatedData);

      logger.info(`Character created: ${character.name} by user ${userId}`);

      res.status(201).json({
        success: true,
        data: { character },
      });
    } catch (error) {
      logger.error('Create character error:', error);
      console.error('Create character detailed error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Máximo de') || error.message === 'Nome já está em uso') {
          res.status(400).json({
            success: false,
            error: {
              code: error.message.includes('Máximo') ? 'CHARACTER_LIMIT' : 'NAME_TAKEN',
              message: error.message,
            },
          });
          return;
        }

        // Zod validation error
        if (error.name === 'ZodError') {
          res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Dados inválidos',
              details: error,
            },
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao criar personagem',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  async updateCharacterAppearance(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const characterId = parseInt(req.params.id);

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

      // Validate input
      const validatedData = updateCharacterAppearanceSchema.parse(req.body);

      // Update character appearance
      const character = await characterService.updateCharacterAppearance(
        characterId,
        userId,
        validatedData
      );

      logger.info(`Character appearance updated: ${character.name} by user ${userId}`);

      res.json({
        success: true,
        data: { character },
      });
    } catch (error) {
      logger.error('Update character appearance error:', error);

      if (error instanceof Error && error.message === 'Personagem não encontrado') {
        res.status(404).json({
          success: false,
          error: {
            code: 'CHARACTER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      // Zod validation error
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dados inválidos',
            details: error,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao atualizar personagem',
        },
      });
    }
  }

  async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const characterId = parseInt(req.params.id);

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

      await characterService.deleteCharacter(characterId, userId);

      logger.info(`Character deleted: ${characterId} by user ${userId}`);

      res.json({
        success: true,
        message: 'Personagem deletado com sucesso',
      });
    } catch (error) {
      logger.error('Delete character error:', error);

      if (error instanceof Error && error.message === 'Personagem não encontrado') {
        res.status(404).json({
          success: false,
          error: {
            code: 'CHARACTER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao deletar personagem',
        },
      });
    }
  }
}

export const characterController = new CharacterController();
