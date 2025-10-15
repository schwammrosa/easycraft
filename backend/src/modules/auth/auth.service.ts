import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { RegisterDTO, LoginDTO, AuthResponse, AuthTokens } from './auth.types';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Conta desativada');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    // Verify refresh token is handled in controller
    // This method just generates new tokens
    const { verifyRefreshToken } = require('../../utils/jwt');
    const payload = verifyRefreshToken(refreshToken);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      throw new Error('Usuário inválido');
    }

    // Generate new tokens
    return this.generateTokens(user.id, user.email);
  }

  private generateTokens(userId: number, email: string): AuthTokens {
    return {
      accessToken: generateAccessToken(userId, email),
      refreshToken: generateRefreshToken(userId, email),
    };
  }
}

export const authService = new AuthService();
