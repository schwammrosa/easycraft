import { GatherNodeType, GatherSessionStatus } from '@prisma/client';

export interface GatherNodeWithDrops {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: GatherNodeType;
  requiredLevel: number;
  gatherTime: number;
  goldCost: number;
  xpReward: number;
  dropTable: Record<string, { chance: number; quantity: [number, number] }>;
}

export interface StartGatherSessionDTO {
  nodeCode: string;
  maxGathers: number; // Máximo de coletas para fazer
}

export interface GatherSessionProgress {
  id: number;
  characterId: number;
  nodeCode: string;
  nodeName: string;
  maxGathers: number;
  status: GatherSessionStatus;
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
  startedAt: Date;
  lastGatherAt: Date | null;
  completedAt: Date | null;
}

export interface GatherResult {
  success: boolean;
  itemsGathered: Array<{ itemCode: string; quantity: number }>;
  xpGained: number;
  goldUsed: number;
  message: string;
}
