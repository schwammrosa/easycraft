import { PrismaClient } from '@prisma/client';
import { CreateCharacterDTO, CharacterWithStats, CharacterResponse } from './character.types';

const prisma = new PrismaClient();

const MAX_CHARACTERS_PER_USER = 3;
const INITIAL_STAT_VALUE = 5;
const INITIAL_DEFENSE = 2;
const INITIAL_GOLD = 100;
const INITIAL_HP = 50;

export class CharacterService {
  async getCharactersByUserId(userId: number): Promise<CharacterResponse[]> {
    const characters = await prisma.character.findMany({
      where: { userId },
      include: { stats: true },
      orderBy: { createdAt: 'desc' },
    });

    return characters.map((char) => this.formatCharacterResponse(char));
  }

  async getCharacterById(characterId: number, userId: number): Promise<CharacterResponse> {
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId,
      },
      include: { stats: true },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    return this.formatCharacterResponse(character);
  }

  async createCharacter(userId: number, data: CreateCharacterDTO): Promise<CharacterResponse> {
    // Check character limit
    const existingCount = await prisma.character.count({
      where: { userId },
    });

    if (existingCount >= MAX_CHARACTERS_PER_USER) {
      throw new Error(`Máximo de ${MAX_CHARACTERS_PER_USER} personagens por conta`);
    }

    // Check name uniqueness (case insensitive)
    const existingName = await prisma.character.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingName) {
      throw new Error('Nome já está em uso');
    }

    // Create character with stats in transaction
    const character = await prisma.$transaction(async (tx) => {
      // Create character
      const newCharacter = await tx.character.create({
        data: {
          userId,
          name: data.name,
          headVariant: data.headVariant,
          armsVariant: data.armsVariant,
          legsVariant: data.legsVariant,
          feetVariant: data.feetVariant,
          level: 1,
          xp: 0,
          gold: INITIAL_GOLD,
          hp: INITIAL_HP,
          maxHp: INITIAL_HP,
        },
      });

      // Create initial stats
      const stats = await tx.characterStats.create({
        data: {
          characterId: newCharacter.id,
          str: INITIAL_STAT_VALUE,
          agi: INITIAL_STAT_VALUE,
          vit: INITIAL_STAT_VALUE,
          int: INITIAL_STAT_VALUE,
          def: INITIAL_DEFENSE,
          totalStr: INITIAL_STAT_VALUE,
          totalAgi: INITIAL_STAT_VALUE,
          totalVit: INITIAL_STAT_VALUE,
          totalInt: INITIAL_STAT_VALUE,
          totalDef: INITIAL_DEFENSE,
        },
      });

      return {
        ...newCharacter,
        stats,
      };
    });

    return this.formatCharacterResponse(character);
  }

  async deleteCharacter(characterId: number, userId: number): Promise<void> {
    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId,
      },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Cascade delete will handle stats, inventory, etc.
    await prisma.character.delete({
      where: { id: characterId },
    });
  }

  private formatCharacterResponse(character: CharacterWithStats): CharacterResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = character;
    
    // Convert BigInt to Number for JSON serialization
    return JSON.parse(
      JSON.stringify(rest, (_key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      )
    );
  }
}

export const characterService = new CharacterService();
