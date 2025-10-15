import { Request, Response } from 'express';
import { authService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation';
import { logger } from '../../config/logger';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await authService.register(validatedData);

      logger.info(`User registered: ${result.user.email}`);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Register error:', error);

      if (error instanceof Error) {
        if (error.message === 'Email já está em uso') {
          res.status(409).json({
            success: false,
            error: {
              code: 'EMAIL_ALREADY_EXISTS',
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
          message: 'Erro ao registrar usuário',
        },
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await authService.login(validatedData);

      logger.info(`User logged in: ${result.user.email}`);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Login error:', error);

      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas' || error.message === 'Conta desativada') {
          res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
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
          message: 'Erro ao fazer login',
        },
      });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      // Refresh tokens
      const tokens = await authService.refresh(refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      logger.error('Refresh token error:', error);

      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_REFRESH_TOKEN',
              message: 'Refresh token inválido ou expirado',
            },
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao renovar token',
        },
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // For stateless JWT, logout is handled client-side
    // In the future, we could implement token blacklisting with Redis
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  }
}

export const authController = new AuthController();
