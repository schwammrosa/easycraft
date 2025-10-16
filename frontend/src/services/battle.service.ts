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

export interface FarmModeConfig {
  enemyCode: string;
  potionItemCode?: string;
  usePotionAtHpPercent?: number;
  maxBattles?: number;
}

export interface FarmModeResult {
  success: boolean;
  totalBattles: number;
  victories: number;
  defeats: number;
  totalXpGained: number;
  totalGoldGained: number;
  totalItemsDropped: { itemCode: string; quantity: number }[];
  levelsGained: number;
  startLevel: number;
  endLevel: number;
  potionsUsed: number;
  stoppedReason: string;
  stoppedMessage: string;
  finalHp: number;
  finalMaxHp: number;
  battleSummaries: BattleSummary[];
}

export interface BattleSummary {
  battleNumber: number;
  victory: boolean;
  xpGained: number;
  goldGained: number;
  itemsDropped: number;
  hpBefore: number;
  hpAfter: number;
  levelUp?: number;
  potionUsedBefore?: boolean;
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

  async startFarmMode(characterId: number, config: FarmModeConfig): Promise<{ sessionId: number }> {
    const response = await api.post(`/battle/${characterId}/farm`, config);
    return response.data.data;
  },

  async getFarmSessionStatus(sessionId: number): Promise<any> {
    const response = await api.get(`/battle/farm/${sessionId}/status`);
    return response.data.data.session;
  },

  async cancelFarmSession(sessionId: number): Promise<void> {
    await api.post(`/battle/farm/${sessionId}/cancel`);
  },

  async getActiveFarmSession(characterId: number): Promise<any | null> {
    const response = await api.get(`/battle/${characterId}/farm/active`);
    return response.data.data.session;
  },

  async getLatestFarmSession(characterId: number): Promise<any | null> {
    const response = await api.get(`/battle/${characterId}/farm/latest`);
    return response.data.data.session;
  },
};
