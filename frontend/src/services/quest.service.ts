import { api } from './api';
import { ApiResponse } from '../types';

export interface Quest {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  targetAmount: number;
  xpReward: number;
  goldReward: number;
  itemRewards: any;
  isRepeatable: boolean;
  requiredLevel: number;
}

export interface CharacterQuest {
  id: number;
  characterId: number;
  questId: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  startedAt: string;
  completedAt: string | null;
  claimedAt: string | null;
  quest: Quest;
}

export interface QuestRewards {
  xpGained: number;
  goldGained: number;
  itemsGained: { itemCode: string; quantity: number }[];
}

export const questService = {
  async getAvailableQuests(characterId: number): Promise<Quest[]> {
    const response = await api.get<ApiResponse<{ quests: Quest[] }>>(
      `/quest/${characterId}/available`
    );
    return response.data.data!.quests;
  },

  async getActiveQuests(characterId: number): Promise<CharacterQuest[]> {
    const response = await api.get<ApiResponse<{ quests: CharacterQuest[] }>>(
      `/quest/${characterId}/active`
    );
    return response.data.data!.quests;
  },

  async acceptQuest(characterId: number, questCode: string): Promise<CharacterQuest> {
    const response = await api.post<ApiResponse<{ characterQuest: CharacterQuest }>>(
      `/quest/${characterId}/accept`,
      { questCode }
    );
    return response.data.data!.characterQuest;
  },

  async claimQuest(characterId: number, questId: number): Promise<QuestRewards> {
    const response = await api.post<ApiResponse<{ rewards: QuestRewards }>>(
      `/quest/${characterId}/claim`,
      { questId }
    );
    return response.data.data!.rewards;
  },
};
