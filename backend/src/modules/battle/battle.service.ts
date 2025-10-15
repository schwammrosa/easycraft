import { PrismaClient } from '@prisma/client';
import { BattleResult, BattleTurn, StartBattleDTO, DropResult, BattleStats } from './battle.types';
import { inventoryService } from '../inventory/inventory.service';
import { questService } from '../quest/quest.service';

const prisma = new PrismaClient();

const CRIT_CHANCE = 0.15; // 15% chance de crítico
const CRIT_MULTIPLIER = 2.0; // Crítico causa 2x dano
const XP_PER_LEVEL = 100; // XP necessário para subir de nível

export class BattleService {
  async startBattle(characterId: number, data: StartBattleDTO): Promise<BattleResult> {
    // Get character with stats
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { stats: true },
    });

    if (!character || !character.stats) {
      throw new Error('Personagem não encontrado');
    }

    // Check if character is alive
    if (character.hp <= 0) {
      throw new Error('Personagem está morto! Descanse para recuperar HP.');
    }

    // Get enemy
    const enemy = await prisma.enemy.findUnique({
      where: { code: data.enemyCode },
    });

    if (!enemy) {
      throw new Error('Inimigo não encontrado');
    }

    // Check level requirement (max 5 levels above)
    if (enemy.level > character.level + 5) {
      throw new Error('Inimigo muito forte! Suba de nível primeiro.');
    }

    // Simulate battle
    const battleResult = this.simulateBattle(
      {
        hp: character.hp,
        maxHp: character.maxHp,
        str: character.stats.totalStr,
        agi: character.stats.totalAgi,
        def: character.stats.totalDef,
      },
      {
        hp: enemy.hp,
        maxHp: enemy.hp,
        str: enemy.str,
        agi: enemy.agi,
        def: enemy.def,
      },
      character.name,
      enemy.name
    );

    // Process result
    if (battleResult.victory) {
      // Give rewards
      battleResult.xpGained = enemy.xpReward;
      battleResult.goldGained = enemy.goldReward;
      battleResult.itemsDropped = this.processDrops(enemy.dropTable as any);

      // Update character (convert BigInt to Number)
      const currentXp = Number(character.xp);
      const currentGold = Number(character.gold);
      const newXp = currentXp + enemy.xpReward;
      const newGold = currentGold + enemy.goldReward;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const leveledUp = newLevel > character.level;

      // Calculate HP after battle (get from last turn)
      const lastTurn = battleResult.turns[battleResult.turns.length - 1];
      const charHpRemaining = lastTurn.attacker === character.name
        ? lastTurn.attackerHpRemaining
        : lastTurn.defenderHpRemaining;
      const hpAfterBattle = Math.max(1, Math.floor(charHpRemaining));

      await prisma.character.update({
        where: { id: characterId },
        data: {
          xp: newXp,
          gold: newGold,
          level: newLevel,
          hp: hpAfterBattle, // Mantém o HP após batalha (use Descansar para recuperar)
        },
      });

      // Level up bonuses
      if (leveledUp) {
        const statPointsGained = (newLevel - character.level) * 2;
        await prisma.characterStats.update({
          where: { characterId },
          data: {
            str: { increment: statPointsGained },
            totalStr: { increment: statPointsGained },
          },
        });

        battleResult.levelUp = {
          newLevel,
          statPointsGained,
        };
      }

      // Give dropped items
      for (const drop of battleResult.itemsDropped) {
        await inventoryService.giveItem(characterId, {
          itemCode: drop.itemCode,
          quantity: drop.quantity,
        });
      }

      // Update quest progress
      await questService.updateQuestProgress(characterId, {
        type: 'kill_enemy',
        data: { enemyCode: enemy.code },
      });

      await questService.updateQuestProgress(characterId, {
        type: 'complete_battle',
      });

      await questService.updateQuestProgress(characterId, {
        type: 'earn_gold',
      });
    } else {
      // Defeat - lose HP
      await prisma.character.update({
        where: { id: characterId },
        data: {
          hp: 1, // Sobrevive com 1 HP
        },
      });
    }

    return battleResult;
  }

  async getEnemiesByLevel(_minLevel: number, _maxLevel: number) {
    // Retorna TODOS os inimigos para permitir completar quests
    // Jogadores podem escolher lutar contra inimigos mais fracos se quiserem
    // Parâmetros ignorados intencionalmente (prefixo _)
    return await prisma.enemy.findMany({
      orderBy: { level: 'asc' },
    });
  }

  private simulateBattle(
    char: BattleStats,
    enemy: BattleStats,
    charName: string,
    enemyName: string
  ): BattleResult {
    const turns: BattleTurn[] = [];
    let charHp = char.hp;
    let enemyHp = enemy.hp;
    let turnNumber = 0;

    // Determine who goes first (higher AGI)
    let charTurn = char.agi >= enemy.agi;

    while (charHp > 0 && enemyHp > 0 && turnNumber < 100) {
      turnNumber++;

      if (charTurn) {
        // Character attacks
        const damage = this.calculateDamage(char.str, enemy.def);
        const isCritical = Math.random() < CRIT_CHANCE;
        const finalDamage = isCritical ? Math.floor(damage * CRIT_MULTIPLIER) : damage;
        
        enemyHp -= finalDamage;

        turns.push({
          turn: turnNumber,
          attacker: charName,
          defender: enemyName,
          damage: finalDamage,
          isCritical,
          attackerHpRemaining: charHp,
          defenderHpRemaining: Math.max(0, enemyHp),
        });
      } else {
        // Enemy attacks
        const damage = this.calculateDamage(enemy.str, char.def);
        const isCritical = Math.random() < CRIT_CHANCE;
        const finalDamage = isCritical ? Math.floor(damage * CRIT_MULTIPLIER) : damage;
        
        charHp -= finalDamage;

        turns.push({
          turn: turnNumber,
          attacker: enemyName,
          defender: charName,
          damage: finalDamage,
          isCritical,
          attackerHpRemaining: Math.max(0, enemyHp),
          defenderHpRemaining: Math.max(0, charHp),
        });
      }

      // Alternate turns
      charTurn = !charTurn;
    }

    return {
      victory: enemyHp <= 0,
      turns,
      xpGained: 0,
      goldGained: 0,
      itemsDropped: [],
    };
  }

  private calculateDamage(attackerStr: number, defenderDef: number): number {
    const baseDamage = attackerStr * 2;
    const damageReduction = defenderDef;
    const finalDamage = Math.max(1, baseDamage - damageReduction);
    return finalDamage;
  }

  private processDrops(dropTable: Record<string, { chance: number; quantity: number[] }>): DropResult[] {
    const drops: DropResult[] = [];

    for (const [itemCode, dropInfo] of Object.entries(dropTable)) {
      if (Math.random() < dropInfo.chance) {
        const [min, max] = dropInfo.quantity;
        const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
        drops.push({ itemCode, quantity });
      }
    }

    return drops;
  }

  async restCharacter(characterId: number): Promise<void> {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    await prisma.character.update({
      where: { id: characterId },
      data: {
        hp: character.maxHp,
      },
    });
  }
}

export const battleService = new BattleService();
