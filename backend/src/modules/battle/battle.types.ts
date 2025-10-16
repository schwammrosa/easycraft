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
  itemsDropped: DropResult[];
  levelUp?: {
    newLevel: number;
    statPointsGained: number;
  };
}

export interface DropResult {
  itemCode: string;
  quantity: number;
}

export interface StartBattleDTO {
  enemyCode: string;
}

// Farm Mode Types
export interface FarmModeConfig {
  enemyCode: string;
  potionItemCode?: string; // Código da poção a usar
  usePotionAtHpPercent?: number; // % de HP para usar poção (ex: 50 = usa quando HP < 50%)
  maxBattles?: number; // Limite de batalhas (0 = sem limite)
}

export interface FarmModeResult {
  success: boolean;
  totalBattles: number;
  victories: number;
  defeats: number;
  totalXpGained: number;
  totalGoldGained: number;
  totalItemsDropped: DropResult[];
  levelsGained: number;
  startLevel: number;
  endLevel: number;
  potionsUsed: number;
  stoppedReason: 'no_potions' | 'low_hp' | 'died' | 'max_battles' | 'no_enemy' | 'error';
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

export interface BattleStats {
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  def: number;
}
