import { api } from './api';
import { ApiResponse } from '../types';

export interface Dungeon {
  id: number;
  code: string;
  name: string;
  description: string;
  recommendedLevel: number;
  maxFloors: number;
  cooldownHours: number;
  floors: DungeonFloor[];
}

export interface DungeonFloor {
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

export interface DungeonRun {
  id: number;
  characterId: number;
  dungeonId: number;
  difficulty: 'easy' | 'normal' | 'hard';
  currentFloor: number;
  status: 'in_progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
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

export interface BattleResult {
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

export interface CooldownCheck {
  canEnter: boolean;
  cooldownEnd?: string;
}

export interface LeaderboardEntry {
  characterId: number;
  characterName: string;
  characterLevel: number;
  completionTime: number;
  difficulty: 'easy' | 'normal' | 'hard';
  completedAt: string;
}

export const dungeonService = {
  async getAllDungeons(): Promise<Dungeon[]> {
    const response = await api.get<ApiResponse<{ dungeons: Dungeon[] }>>('/dungeons');
    return response.data.data!.dungeons;
  },

  async getDungeonById(dungeonId: number): Promise<Dungeon> {
    const response = await api.get<ApiResponse<{ dungeon: Dungeon }>>(`/dungeons/${dungeonId}`);
    return response.data.data!.dungeon;
  },

  async canEnterDungeon(characterId: number, dungeonId: number): Promise<CooldownCheck> {
    const response = await api.get<ApiResponse<CooldownCheck>>(
      `/dungeons/${characterId}/can-enter/${dungeonId}`
    );
    return response.data.data!;
  },

  async enterDungeon(
    characterId: number,
    dungeonId: number,
    difficulty: 'easy' | 'normal' | 'hard'
  ): Promise<DungeonRun> {
    const response = await api.post<ApiResponse<{ run: DungeonRun }>>(
      `/dungeons/${characterId}/enter`,
      { dungeonId, difficulty }
    );
    return response.data.data!.run;
  },

  async battleFloor(characterId: number, runId: number, floorNumber: number): Promise<BattleResult> {
    const response = await api.post<ApiResponse<{ result: BattleResult }>>(
      `/dungeons/${characterId}/battle`,
      { runId, floorNumber }
    );
    return response.data.data!.result;
  },

  async getActiveRun(characterId: number): Promise<DungeonRun | null> {
    const response = await api.get<ApiResponse<{ run: DungeonRun | null }>>(
      `/dungeons/${characterId}/active`
    );
    return response.data.data!.run;
  },

  async getHistory(characterId: number): Promise<DungeonRun[]> {
    const response = await api.get<ApiResponse<{ runs: DungeonRun[] }>>(
      `/dungeons/${characterId}/history`
    );
    return response.data.data!.runs;
  },

  async getLeaderboard(dungeonId: number): Promise<LeaderboardEntry[]> {
    const response = await api.get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>(
      `/dungeons/${dungeonId}/leaderboard`
    );
    return response.data.data!.leaderboard;
  },
};
