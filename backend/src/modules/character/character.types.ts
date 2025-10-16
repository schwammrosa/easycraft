import { Character, CharacterStats } from '@prisma/client';

export interface CreateCharacterDTO {
  name: string;
  headVariant: string;
  armsVariant: string;
  legsVariant: string;
  feetVariant: string;
}

export interface UpdateCharacterAppearanceDTO {
  headVariant: string;
  armsVariant: string;
  legsVariant: string;
  feetVariant: string;
}

export interface CharacterWithStats extends Character {
  stats: CharacterStats | null;
}

export type CharacterResponse = Omit<Character, 'userId'> & {
  stats: CharacterStats | null;
};
