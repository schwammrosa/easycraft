import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger';
import { inventoryService } from '../inventory/inventory.service';
import { questService } from '../quest/quest.service';

const prisma = new PrismaClient();

const CRIT_CHANCE = 0.15;
const CRIT_MULTIPLIER = 2.0;
const XP_PER_LEVEL = 100;
const BATTLE_DELAY_MS = 3000; // 3 segundos entre batalhas

interface BattleStats {
  hp: number;
  maxHp: number;
  str: number;
  agi: number;
  def: number;
}

interface BattleTurn {
  turn: number;
  attacker: string;
  defender: string;
  damage: number;
  isCritical: boolean;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
}

interface BattleSimResult {
  victory: boolean;
  turns: BattleTurn[];
  charHpRemaining: number;
}

class FarmWorker {
  private activeSessions: Map<number, NodeJS.Timeout> = new Map();

  async startFarmSession(sessionId: number): Promise<void> {
    // Check if already running
    if (this.activeSessions.has(sessionId)) {
      logger.warn(`Farm session ${sessionId} is already running`);
      return;
    }

    logger.info(`Starting farm session ${sessionId}`);

    // Start processing in background
    const timeout = setTimeout(() => this.processFarmSession(sessionId), 100);
    this.activeSessions.set(sessionId, timeout);
  }

  async cancelFarmSession(sessionId: number): Promise<void> {
    const timeout = this.activeSessions.get(sessionId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSessions.delete(sessionId);

      // Apply 50% penalty for fleeing
      const session = await prisma.farmSession.findUnique({
        where: { id: sessionId },
        include: { character: true }
      });

      if (session) {
        // Remove 50% of accumulated rewards
        const penaltyXp = Math.floor(session.totalXpGained * 0.5);
        const penaltyGold = Math.floor(session.totalGoldGained * 0.5);

        const newXp = Math.max(0, Number(session.character.xp) - penaltyXp);
        const newGold = Math.max(0, Number(session.character.gold) - penaltyGold);

        await prisma.character.update({
          where: { id: session.characterId },
          data: {
            xp: newXp,
            gold: newGold,
          }
        });

        // Update session with penalty info
        await prisma.farmSession.update({
          where: { id: sessionId },
          data: {
            status: 'cancelled',
            stoppedReason: 'fled',
            stoppedMessage: `⚠️ FUGIU DA BATALHA! Perdeu 50% das recompensas (-${penaltyXp} XP, -${penaltyGold} Gold)`,
            completedAt: new Date(),
          },
        });

        logger.info(`Farm session ${sessionId} cancelled with 50% penalty`);
      }
    }
  }

  private async processFarmSession(sessionId: number): Promise<void> {
    try {
      const session = await prisma.farmSession.findUnique({
        where: { id: sessionId },
        include: {
          character: {
            include: {
              stats: true,
              inventory: {
                include: { item: true }
              }
            }
          }
        }
      });

      if (!session || !session.character || !session.character.stats) {
        logger.error(`Farm session ${sessionId} not found or invalid`);
        return;
      }

      if (session.status !== 'running') {
        logger.info(`Farm session ${sessionId} is not running, skipping`);
        return;
      }

      // Check if reached max battles
      if (session.currentBattle >= session.maxBattles) {
        await this.completeFarmSession(sessionId, 'max_battles', 
          `Completou ${session.maxBattles} batalhas com sucesso!`);
        return;
      }

      // Get enemy
      const enemy = await prisma.enemy.findUnique({
        where: { code: session.enemyCode },
      });

      if (!enemy) {
        await this.completeFarmSession(sessionId, 'error', 'Inimigo não encontrado');
        return;
      }

      const character = session.character;
      const hpPercent = (character.hp / character.maxHp) * 100;

      // Auto-use potion if HP is low
      if (session.potionItemCode && hpPercent < session.usePotionAtHpPercent) {
        const potionInInventory = character.inventory.find(
          (inv: any) => inv.item.code === session.potionItemCode && inv.quantity > 0
        );

        if (potionInInventory) {
          try {
            await inventoryService.useItem(character.id, { inventoryId: potionInInventory.id });

            // Reload character
            const reloaded = await prisma.character.findUnique({
              where: { id: character.id },
              include: { stats: true }
            });
            if (reloaded && reloaded.stats) {
              character.hp = reloaded.hp;
            }

            // Update potions used count
            await prisma.farmSession.update({
              where: { id: sessionId },
              data: { potionsUsed: { increment: 1 } }
            });

            logger.info(`Session ${sessionId}: Used potion, HP now ${character.hp}`);
          } catch (error) {
            logger.warn(`Session ${sessionId}: Failed to use potion - ${error}`);
          }
        } else if (hpPercent < 30) {
          // No potions and HP too low
          await this.completeFarmSession(sessionId, 'no_potions',
            `Parou após ${session.currentBattle} batalhas: Sem poções e HP baixo (${Math.floor(hpPercent)}%)`);
          return;
        }
      }

      // Check if HP is critically low
      if ((character.hp / character.maxHp) * 100 < 20) {
        await this.completeFarmSession(sessionId, 'low_hp',
          `Parou após ${session.currentBattle} batalhas: HP muito baixo (${character.hp}/${character.maxHp})`);
        return;
      }

      // Simulate battle
      if (!character.stats) return;

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

      // Update session counts
      await prisma.farmSession.update({
        where: { id: sessionId },
        data: {
          currentBattle: { increment: 1 },
          totalBattles: { increment: 1 },
          victories: battleResult.victory ? { increment: 1 } : undefined,
          defeats: !battleResult.victory ? { increment: 1 } : undefined,
          lastBattleAt: new Date(),
        }
      });

      if (battleResult.victory) {
        // Process victory
        await this.processVictory(sessionId, character.id, enemy, battleResult.charHpRemaining);
      } else {
        // Defeat - set HP to 1 and stop
        await prisma.character.update({
          where: { id: character.id },
          data: { hp: 1 }
        });

        await this.completeFarmSession(sessionId, 'died',
          `Derrotado após ${session.currentBattle + 1} batalhas`);
        return;
      }

      // Schedule next battle
      const timeout = setTimeout(() => this.processFarmSession(sessionId), BATTLE_DELAY_MS);
      this.activeSessions.set(sessionId, timeout);

      logger.info(`Session ${sessionId}: Battle ${session.currentBattle + 1} completed, victory: ${battleResult.victory}`);

    } catch (error) {
      logger.error(`Error processing farm session ${sessionId}:`, error);
      await this.completeFarmSession(sessionId, 'error', 'Erro ao processar farm');
    }
  }

  private async processVictory(
    sessionId: number,
    characterId: number,
    enemy: any,
    charHpRemaining: number
  ): Promise<void> {
    const session = await prisma.farmSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) return;

    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) return;

    // Calculate drops
    const drops = this.processDrops(enemy.dropTable as any);

    // Update session rewards
    const currentItems = session.totalItemsDropped as any[];
    const updatedItems = [...currentItems];

    for (const drop of drops) {
      const existing = updatedItems.find((d: any) => d.itemCode === drop.itemCode);
      if (existing) {
        existing.quantity += drop.quantity;
      } else {
        updatedItems.push(drop);
      }
    }

    // Calculate XP and level
    const currentXp = Number(character.xp);
    const newXp = currentXp + enemy.xpReward;
    const currentGold = Number(character.gold);
    const newGold = currentGold + enemy.goldReward;
    const oldLevel = character.level;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > oldLevel;

    // Update character
    const hpAfterBattle = Math.max(1, Math.floor(charHpRemaining));
    await prisma.character.update({
      where: { id: characterId },
      data: {
        xp: newXp,
        gold: newGold,
        level: newLevel,
        hp: hpAfterBattle,
      },
    });

    // Level up bonuses
    if (leveledUp) {
      const levelsGained = newLevel - oldLevel;
      const statPointsGained = levelsGained * 3; // 3 pontos por level
      
      await prisma.characterStats.update({
        where: { characterId },
        data: {
          statPoints: { increment: statPointsGained }
        },
      });

      // Update session levels
      await prisma.farmSession.update({
        where: { id: sessionId },
        data: {
          levelsGained: { increment: levelsGained },
          endLevel: newLevel,
        }
      });

      logger.info(`Session ${sessionId}: Character leveled up ${oldLevel} → ${newLevel} (+${statPointsGained} stat points)`);
    }

    // Give dropped items
    for (const drop of drops) {
      await inventoryService.giveItem(characterId, {
        itemCode: drop.itemCode,
        quantity: drop.quantity,
      });
    }

    // Update quests
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

    // Update session totals
    await prisma.farmSession.update({
      where: { id: sessionId },
      data: {
        totalXpGained: { increment: enemy.xpReward },
        totalGoldGained: { increment: enemy.goldReward },
        totalItemsDropped: updatedItems,
        finalHp: hpAfterBattle,
        finalMaxHp: character.maxHp,
      }
    });
  }

  private simulateBattle(
    charStats: BattleStats,
    enemyStats: BattleStats,
    charName: string,
    enemyName: string
  ): BattleSimResult {
    const turns: BattleTurn[] = [];
    let charHp = charStats.hp;
    let enemyHp = enemyStats.hp;

    // Determine who goes first
    let attacker = charStats.agi >= enemyStats.agi ? 'character' : 'enemy';

    for (let turnNum = 1; turnNum <= 100; turnNum++) {
      const isCharAttacking = attacker === 'character';
      const attackerStats = isCharAttacking ? charStats : enemyStats;
      const defenderStats = isCharAttacking ? enemyStats : charStats;
      const attackerName = isCharAttacking ? charName : enemyName;
      const defenderName = isCharAttacking ? enemyName : charName;

      // Calculate damage
      let damage = Math.max(1, attackerStats.str * 2 - defenderStats.def);
      const isCritical = Math.random() < CRIT_CHANCE;
      if (isCritical) {
        damage = Math.floor(damage * CRIT_MULTIPLIER);
      }

      // Apply damage
      if (isCharAttacking) {
        enemyHp -= damage;
      } else {
        charHp -= damage;
      }

      turns.push({
        turn: turnNum,
        attacker: attackerName,
        defender: defenderName,
        damage,
        isCritical,
        attackerHpRemaining: isCharAttacking ? charHp : enemyHp,
        defenderHpRemaining: isCharAttacking ? enemyHp : charHp,
      });

      // Check victory
      if (charHp <= 0) {
        return { victory: false, turns, charHpRemaining: 0 };
      }
      if (enemyHp <= 0) {
        return { victory: true, turns, charHpRemaining: charHp };
      }

      // Switch attacker
      attacker = attacker === 'character' ? 'enemy' : 'character';
    }

    // Max turns reached - whoever has more HP wins
    return {
      victory: charHp > enemyHp,
      turns,
      charHpRemaining: charHp,
    };
  }

  private processDrops(dropTable: Record<string, { chance: number; quantity: [number, number] }>): Array<{ itemCode: string; quantity: number }> {
    const drops: Array<{ itemCode: string; quantity: number }> = [];

    for (const [itemCode, dropInfo] of Object.entries(dropTable)) {
      if (Math.random() < dropInfo.chance) {
        const [min, max] = dropInfo.quantity;
        const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
        drops.push({ itemCode, quantity });
      }
    }

    return drops;
  }

  private async completeFarmSession(
    sessionId: number,
    reason: string,
    message: string
  ): Promise<void> {
    // Clear timeout
    const timeout = this.activeSessions.get(sessionId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSessions.delete(sessionId);
    }

    // Update session
    const session = await prisma.farmSession.findUnique({
      where: { id: sessionId },
      include: { character: true }
    });

    if (!session) return;

    // Determine final status based on reason
    let finalStatus: 'completed' | 'cancelled' | 'error';
    if (reason === 'fled') {
      finalStatus = 'cancelled';
    } else if (reason === 'error') {
      finalStatus = 'error';
    } else {
      finalStatus = 'completed';
    }

    await prisma.farmSession.update({
      where: { id: sessionId },
      data: {
        status: finalStatus,
        stoppedReason: reason,
        stoppedMessage: message,
        completedAt: new Date(),
        finalHp: session.character.hp,
        finalMaxHp: session.character.maxHp,
      },
    });

    logger.info(`Farm session ${sessionId} ${finalStatus}: ${message}`);
  }
}

export const farmWorker = new FarmWorker();
