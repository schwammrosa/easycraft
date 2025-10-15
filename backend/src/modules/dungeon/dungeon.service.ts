// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { 
  DungeonWithFloors, 
  DungeonRunWithDetails, 
  EnterDungeonDTO,
  BattleFloorDTO,
  BattleFloorResult,
  DungeonLeaderboardEntry
} from './dungeon.types';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

// Difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
  easy: { hp: 1.0, damage: 0.8, reward: 1.0 },
  normal: { hp: 1.5, damage: 1.0, reward: 1.5 },
  hard: { hp: 2.5, damage: 1.5, reward: 3.0 },
};

export const dungeonService = {
  // List all dungeons with their floors
  async getAllDungeons(): Promise<DungeonWithFloors[]> {
    logger.info('Fetching all dungeons');

    const dungeons = await prisma.dungeon.findMany({
      include: {
        floors: {
          include: {
            enemy: {
              select: {
                id: true,
                code: true,
                name: true,
                level: true,
                hp: true,
                str: true,
                agi: true,
                def: true,
              },
            },
          },
          orderBy: { floorNumber: 'asc' },
        },
      },
      orderBy: { recommendedLevel: 'asc' },
    });

    return dungeons as DungeonWithFloors[];
  },

  // Get specific dungeon by ID
  async getDungeonById(dungeonId: number): Promise<DungeonWithFloors | null> {
    logger.info(`Fetching dungeon: ${dungeonId}`);

    const dungeon = await prisma.dungeon.findUnique({
      where: { id: dungeonId },
      include: {
        floors: {
          include: {
            enemy: {
              select: {
                id: true,
                code: true,
                name: true,
                level: true,
                hp: true,
                str: true,
                agi: true,
                def: true,
              },
            },
          },
          orderBy: { floorNumber: 'asc' },
        },
      },
    });

    return dungeon as DungeonWithFloors | null;
  },

  // Check if character can enter dungeon (cooldown check)
  async canEnterDungeon(characterId: number, dungeonId: number): Promise<{ canEnter: boolean; cooldownEnd?: Date; }> {
    const lastRun = await prisma.dungeonRun.findFirst({
      where: {
        characterId,
        dungeonId,
        status: { in: ['completed', 'failed'] },
      },
      include: { dungeon: true },
      orderBy: { completedAt: 'desc' },
    });

    if (!lastRun || !lastRun.completedAt) {
      return { canEnter: true };
    }

    const cooldownMs = lastRun.dungeon.cooldownHours * 60 * 60 * 1000;
    const cooldownEnd = new Date(lastRun.completedAt.getTime() + cooldownMs);
    const canEnter = new Date() > cooldownEnd;

    return { canEnter, cooldownEnd: canEnter ? undefined : cooldownEnd };
  },

  // Enter a dungeon
  async enterDungeon(characterId: number, data: EnterDungeonDTO): Promise<DungeonRunWithDetails> {
    const { dungeonId, difficulty } = data;

    logger.info(`Character ${characterId} entering dungeon ${dungeonId} on ${difficulty}`);

    // Check if dungeon exists
    const dungeon = await prisma.dungeon.findUnique({
      where: { id: dungeonId },
    });

    if (!dungeon) {
      throw new Error('Dungeon não encontrada');
    }

    // Check if character exists
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Check if there's an active run
    const activeRun = await prisma.dungeonRun.findFirst({
      where: {
        characterId,
        status: 'in_progress',
      },
    });

    if (activeRun) {
      throw new Error('Você já está em uma dungeon ativa');
    }

    // Check cooldown
    const { canEnter, cooldownEnd } = await this.canEnterDungeon(characterId, dungeonId);
    if (!canEnter) {
      const remainingTime = Math.ceil((cooldownEnd!.getTime() - Date.now()) / 1000 / 60);
      throw new Error(`Cooldown ativo. Aguarde ${remainingTime} minutos`);
    }

    // Create dungeon run
    const run = await prisma.dungeonRun.create({
      data: {
        characterId,
        dungeonId,
        difficulty,
        currentFloor: 1,
        status: 'in_progress',
      },
      include: {
        dungeon: true,
      },
    });

    logger.info(`Dungeon run created: ${run.id}`);

    return run as DungeonRunWithDetails;
  },

  // Battle a floor
  async battleFloor(characterId: number, data: BattleFloorDTO): Promise<BattleFloorResult> {
    try {
      const { runId, floorNumber } = data;

      logger.info(`Character ${characterId} battling floor ${floorNumber} in run ${runId}`);

      // Get the run
      const run = await prisma.dungeonRun.findUnique({
        where: { id: runId },
        include: {
          character: {
            include: {
              stats: true,
              equipment: {
                include: {
                  inventory: {
                    include: { item: true },
                  },
                },
              },
            },
          },
          dungeon: true,
        },
      });

      logger.info(`Run found: ${run ? 'yes' : 'no'}`);

      // Get the specific floor separately
      const floor = await prisma.dungeonFloor.findFirst({
        where: {
          dungeonId: run?.dungeonId,
          floorNumber,
        },
        include: {
          enemy: true,
        },
      });

      logger.info(`Floor found: ${floor ? 'yes' : 'no'}`);

      if (!run) {
        throw new Error('Dungeon run não encontrada');
      }

      if (run.characterId !== characterId) {
        throw new Error('Esta run não pertence a você');
      }

      if (run.status !== 'in_progress') {
        throw new Error('Esta run não está ativa');
      }

      if (run.currentFloor !== floorNumber) {
        throw new Error(`Você deve lutar no floor ${run.currentFloor}`);
      }

      if (!floor) {
        throw new Error('Floor não encontrado');
      }

      // @ts-ignore - Prisma types issue
      const character = run.character;
      const stats = character.stats!;

      // Calculate character stats (base + equipment)
      let totalStr = stats.str;
      let totalAgi = stats.agi;
      let totalDef = stats.def;
      let totalVit = stats.vit;

      character.equipment.forEach((eq: any) => {
        const attrsRaw = eq.inventory?.item?.attributes;
        const attrs = typeof attrsRaw === 'string' ? JSON.parse(attrsRaw) : (attrsRaw || {});
        totalStr += (attrs.str ?? attrs.strBonus ?? 0);
        totalAgi += (attrs.agi ?? attrs.agiBonus ?? 0);
        totalDef += (attrs.def ?? attrs.defBonus ?? 0);
        totalVit += (attrs.vit ?? attrs.vitBonus ?? 0);
      });

      // Apply difficulty multipliers
      const multiplier = DIFFICULTY_MULTIPLIERS[run.difficulty as keyof typeof DIFFICULTY_MULTIPLIERS];
      const enemies = floor.enemyCount;
      const enemyHp = Math.floor(floor.enemy.hp * multiplier.hp);
      const enemyStr = Math.floor(floor.enemy.str * multiplier.damage);
      const enemyDef = floor.enemy.def;

      // Simple battle simulation
      let playerHp = character.hp;
      let totalEnemyHp = enemyHp * enemies;
      let playerDamageDealt = 0;
      let playerDamageTaken = 0;

      // Battle loop
      while (playerHp > 0 && totalEnemyHp > 0) {
        // Player attacks
        const playerDamage = Math.max(1, totalStr * 2 - enemyDef + Math.floor(Math.random() * 10));
        totalEnemyHp -= playerDamage;
        playerDamageDealt += playerDamage;

        if (totalEnemyHp <= 0) break;

        // Enemies attack
        const enemyDamage = Math.max(1, enemyStr * 2 - totalDef + Math.floor(Math.random() * 10));
        playerHp -= enemyDamage;
        playerDamageTaken += enemyDamage;
      }

      const victory = totalEnemyHp <= 0;

      // Calculate rewards
      const goldEarned = victory ? Math.floor(floor.goldReward * multiplier.reward) : 0;
      const expEarned = victory ? Math.floor(floor.expReward * multiplier.reward) : 0;
      const itemsObtained: any[] = [];

      // Get dungeon info
      const dungeon = await prisma.dungeon.findUnique({
        where: { id: run.dungeonId },
      });

      if (!dungeon) {
        throw new Error('Dungeon não encontrada');
      }

      const isLastFloor = floorNumber === dungeon.maxFloors;
      const newStatus = victory ? (isLastFloor ? 'completed' : 'in_progress') : 'failed';
      const newCurrentFloor = victory && !isLastFloor ? floorNumber + 1 : floorNumber;

      // Update run
      await prisma.dungeonRun.update({
        where: { id: runId },
        data: {
          currentFloor: newCurrentFloor,
          status: newStatus,
          completedAt: newStatus !== 'in_progress' ? new Date() : undefined,
          totalDamageDealt: { increment: playerDamageDealt },
          totalDamageTaken: { increment: playerDamageTaken },
          goldEarned: { increment: goldEarned },
          expEarned: { increment: expEarned },
        },
      });

      // Update character HP
      await prisma.character.update({
        where: { id: characterId },
        data: { hp: Math.max(0, playerHp) },
      });

      if (victory) {
        // Give rewards
        await prisma.character.update({
          where: { id: characterId },
          data: {
            gold: { increment: goldEarned },
            xp: { increment: expEarned },
          },
        });
      }

      logger.info(`Floor battle result: victory=${victory}, gold=${goldEarned}, exp=${expEarned}`);

      return {
        victory,
        playerDamageDealt,
        playerDamageTaken,
        playerHpRemaining: Math.max(0, playerHp),
        goldEarned,
        expEarned,
        itemsObtained,
        floorCompleted: victory,
        dungeonCompleted: victory && isLastFloor,
      };
    } catch (error) {
      logger.error('Detailed error in battleFloor:', error);
      throw error;
    }
  },

  // Get active run for character
  async getActiveRun(characterId: number): Promise<DungeonRunWithDetails | null> {
    const run = await prisma.dungeonRun.findFirst({
      where: {
        characterId,
        status: 'in_progress',
      },
      include: {
        dungeon: true,
      },
    });

    return run as DungeonRunWithDetails | null;
  },

  // Get run history for character
  async getRunHistory(characterId: number): Promise<DungeonRunWithDetails[]> {
    const runs = await prisma.dungeonRun.findMany({
      where: { characterId },
      include: {
        dungeon: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return runs as DungeonRunWithDetails[];
  },

  // Get leaderboard for a dungeon
  async getLeaderboard(dungeonId: number): Promise<DungeonLeaderboardEntry[]> {
    const runs = await prisma.dungeonRun.findMany({
      where: {
        dungeonId,
        status: 'completed',
      },
      include: {
        character: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: { timeElapsed: 'asc' },
      take: 10,
    });

    return runs.map((run) => ({
      characterId: run.character.id,
      // @ts-ignore - Prisma types issue
      characterName: run.character.name,
      characterLevel: run.character.level,
      completionTime: run.timeElapsed,
      difficulty: run.difficulty,
      completedAt: run.completedAt!,
    }));
  },
};
