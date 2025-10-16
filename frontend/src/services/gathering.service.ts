import { api } from './api';
import { ApiResponse } from '../types';

export interface GatherNode {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: 'wood' | 'ore' | 'herb' | 'crystal' | 'leather';
  requiredLevel: number;
  gatherTime: number;
  goldCost: number;
  xpReward: number;
  dropTable: Record<string, { chance: number; quantity: [number, number] }>;
}

export interface GatherSession {
  id: number;
  characterId: number;
  nodeCode: string;
  nodeName: string;
  maxGathers: number;
  status: 'running' | 'completed' | 'cancelled' | 'error';
  currentGather: number;
  totalGathers: number;
  successfulGathers: number;
  totalXpGained: number;
  totalItemsGathered: Array<{ itemCode: string; quantity: number }>;
  levelsGained: number;
  startLevel: number;
  endLevel: number;
  goldSpent: number;
  goldRefunded: number;
  stoppedReason: string | null;
  stoppedMessage: string | null;
  startedAt: string;
  lastGatherAt: string | null;
  completedAt: string | null;
}

export interface StartGatherSessionDTO {
  nodeCode: string;
  maxGathers: number;
}

export const gatheringService = {
  async getGatherNodes(characterId: number): Promise<GatherNode[]> {
    const response = await api.get<ApiResponse<{ nodes: GatherNode[] }>>(
      `/gathering/${characterId}/nodes`
    );
    return response.data.data!.nodes;
  },

  async startGatherSession(characterId: number, dto: StartGatherSessionDTO): Promise<number> {
    const response = await api.post<ApiResponse<{ sessionId: number }>>(
      `/gathering/${characterId}/start`,
      dto
    );
    return response.data.data!.sessionId;
  },

  async getGatherSessionStatus(sessionId: number): Promise<GatherSession> {
    const response = await api.get<ApiResponse<{ session: GatherSession }>>(
      `/gathering/session/${sessionId}`
    );
    return response.data.data!.session;
  },

  async cancelGatherSession(characterId: number, sessionId: number): Promise<void> {
    await api.post(`/gathering/${characterId}/session/${sessionId}/cancel`);
  },

  async getGatherHistory(characterId: number, limit: number = 10): Promise<GatherSession[]> {
    const response = await api.get<ApiResponse<{ history: GatherSession[] }>>(
      `/gathering/${characterId}/history?limit=${limit}`
    );
    return response.data.data!.history;
  },

  async getActiveGatherSession(characterId: number): Promise<GatherSession | null> {
    const response = await api.get<ApiResponse<{ session: GatherSession | null }>>(
      `/gathering/${characterId}/active`
    );
    return response.data.data!.session;
  },
};
