import { User } from '@prisma/client';

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    createdAt: Date;
  };
  tokens: AuthTokens;
}

export interface JWTPayload {
  userId: number;
  email: string;
  type: 'access' | 'refresh';
}

export type UserWithoutPassword = Omit<User, 'passwordHash'>;
