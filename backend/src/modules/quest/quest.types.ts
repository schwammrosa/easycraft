export interface AcceptQuestDTO {
  questCode: string;
}

export interface ClaimQuestDTO {
  questId: number;
}

export interface QuestProgressUpdate {
  type: 'kill_enemy' | 'complete_battle' | 'equip_item' | 'earn_gold' | 'collect_items';
  data?: {
    enemyCode?: string;
    amount?: number;
  };
}
