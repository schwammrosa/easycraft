import { DungeonDifficulty, DungeonRunStatus } from '@prisma/client';

export interface DungeonWithFloors {
  id: number;
  code: string;
  name: string;
  description: string;
  recommendedLevel: number;
  maxFloors: number;
  cooldownHours: number;
  floors: DungeonFloorWithEnemy[];
}

export interface DungeonFloorWithEnemy {
  id: number;
  floorNumber: number;
  isBoss: boolean;
  enemyCount: number;
  goldReward: number;
  expReward: number;
  itemDrops: any[];
  enemy: {
    id: number;
    code: string;
    name: string;
    level: number;
    hp: number;
    str: number;
    agi: number;
    def: number;
  };
}

export interface DungeonRunWithDetails {
  id: number;
  characterId: number;
  dungeonId: number;
  difficulty: DungeonDifficulty;
  currentFloor: number;
  status: DungeonRunStatus;
  startedAt: Date;
  completedAt: Date | null;
  timeElapsed: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  goldEarned: number;
  expEarned: number;
  itemsObtained: any[];
  dungeon: {
    id: number;
    name: string;
    maxFloors: number;
  };
}

export interface EnterDungeonDTO {
  dungeonId: number;
  difficulty: DungeonDifficulty;
}

export interface BattleFloorDTO {
  runId: number;
  floorNumber: number;
}

export interface BattleFloorResult {
  victory: boolean;
  playerDamageDealt: number;
  playerDamageTaken: number;
  playerHpRemaining: number;
  goldEarned: number;
  expEarned: number;
  itemsObtained: any[];
  floorCompleted: boolean;
  dungeonCompleted: boolean;
}

export interface DungeonLeaderboardEntry {
  characterId: number;
  characterName: string;
  characterLevel: number;
  completionTime: number;
  difficulty: DungeonDifficulty;
  completedAt: Date;
}
