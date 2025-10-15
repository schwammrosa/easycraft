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

export interface BattleStats {
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  def: number;
}
