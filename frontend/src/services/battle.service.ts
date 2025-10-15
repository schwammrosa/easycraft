import { api } from './api';
import { ApiResponse } from '../types';

export interface Enemy {
  id: number;
  code: string;
  name: string;
  description: string | null;
  level: number;
  hp: number;
  str: number;
  agi: number;
  def: number;
  xpReward: number;
  goldReward: number;
}

export interface BattleTurn {
  turn: number;
  attacker: string;
  defender: string;
  damage: number;
  isCritical: boolean;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
}

export interface BattleResult {
  victory: boolean;
  turns: BattleTurn[];
  xpGained: number;
  goldGained: number;
  itemsDropped: { itemCode: string; quantity: number }[];
  levelUp?: {
    newLevel: number;
    statPointsGained: number;
  };
}

export const battleService = {
  async getEnemies(characterId: number): Promise<Enemy[]> {
    const response = await api.get<ApiResponse<{ enemies: Enemy[] }>>(
      `/battle/${characterId}/enemies`
    );
    return response.data.data!.enemies;
  },

  async startBattle(characterId: number, enemyCode: string): Promise<BattleResult> {
    const response = await api.post<ApiResponse<{ result: BattleResult }>>(
      `/battle/${characterId}/start`,
      { enemyCode }
    );
    return response.data.data!.result;
  },

  async rest(characterId: number): Promise<void> {
    await api.post(`/battle/${characterId}/rest`);
  },
};
