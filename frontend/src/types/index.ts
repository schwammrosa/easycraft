// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Auth types
export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
}

// Character types
export interface CharacterStats {
  str: number;
  agi: number;
  vit: number;
  int: number;
  def: number;
  statPoints: number;
  totalStr: number;
  totalAgi: number;
  totalVit: number;
  totalInt: number;
  totalDef: number;
}

export interface Character {
  id: number;
  name: string;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  headVariant: string;
  armsVariant: string;
  legsVariant: string;
  feetVariant: string;
  stats: CharacterStats;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

export interface CreateCharacterDTO {
  name: string;
  headVariant: string;
  armsVariant: string;
  legsVariant: string;
  feetVariant: string;
}

export const VARIANT_OPTIONS = [
  'variant1',
  'variant2',
  'variant3',
  'variant4',
  'variant5',
  'variant6',
];
