import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger';
import { inventoryService } from '../inventory/inventory.service';
import { questService } from '../quest/quest.service';

const prisma = new PrismaClient();

const XP_PER_LEVEL = 100;
const GATHER_DELAY_MS = 3000; // 3 segundos entre coletas

class GatherWorker {
  private activeSessions: Map<number, NodeJS.Timeout> = new Map();

  async startGatherSession(sessionId: number): Promise<void> {
    // Check if already running
    if (this.activeSessions.has(sessionId)) {
      logger.warn(`Gather session ${sessionId} is already running`);
      return;
    }

    logger.info(`Starting gather session ${sessionId}`);

    // Start processing in background
    const timeout = setTimeout(() => this.processGatherSession(sessionId), 100);
    this.activeSessions.set(sessionId, timeout);
  }

  async cancelGatherSession(sessionId: number): Promise<void> {
    const timeout = this.activeSessions.get(sessionId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeSessions.delete(sessionId);

      // Apply 50% penalty for cancelling (items + XP + gold refund)
      const session = await prisma.gatherSession.findUnique({
        where: { id: sessionId },
        include: { character: true }
      });

      if (session) {
        // Calculate 50% penalty
        const penaltyXp = Math.floor(session.totalXpGained * 0.5);
        const newXp = Math.max(0, Number(session.character.xp) - penaltyXp);

        // Remove 50% of gathered items from inventory
        const gatheredItems = session.totalItemsGathered as Array<{ itemCode: string; quantity: number }>;
        const itemsToRemove: Array<{ itemCode: string; quantity: number; removed: number }> = [];

        for (const item of gatheredItems) {
          const penaltyQuantity = Math.floor(item.quantity * 0.5);
          
          // Try to remove items from inventory
          const inventory = await prisma.inventory.findFirst({
            where: {
              characterId: session.characterId,
              item: {
                code: item.itemCode,
              },
            },
          });

          if (inventory && inventory.quantity >= penaltyQuantity) {
            await prisma.inventory.update({
              where: { id: inventory.id },
              data: {
                quantity: { decrement: penaltyQuantity },
              },
            });
            itemsToRemove.push({ itemCode: item.itemCode, quantity: item.quantity, removed: penaltyQuantity });
          } else if (inventory) {
            // Remove what we can
            await prisma.inventory.update({
              where: { id: inventory.id },
              data: {
                quantity: 0,
              },
            });
            itemsToRemove.push({ itemCode: item.itemCode, quantity: item.quantity, removed: inventory.quantity });
          }
        }

        // Calculate gold refund (50% of total spent)
        const goldRefund = Math.floor(((session as any).goldSpent || 0) * 0.5);

        // Update character (remove XP, refund 50% gold)
        await prisma.character.update({
          where: { id: session.characterId },
          data: {
            xp: newXp,
            gold: { increment: goldRefund },
          }
        });

        // Build penalty message
        const itemsPenaltyText = itemsToRemove
          .map(item => `-${item.removed}x ${item.itemCode}`)
          .join(', ');

        // Update session with penalty info
        await prisma.gatherSession.update({
          where: { id: sessionId },
          data: {
            status: 'cancelled',
            stoppedReason: 'cancelled',
            stoppedMessage: `⚠️ COLETA CANCELADA! Penalidade de 50%:\n- Perdeu ${penaltyXp} XP\n- Perdeu itens: ${itemsPenaltyText || 'nenhum'}\n+ Reembolso: ${goldRefund}g (50% do custo)`,
            ...(goldRefund ? { goldRefunded: goldRefund } : {}),
            completedAt: new Date(),
          } as any,
        });

        logger.info(`Gather session ${sessionId} cancelled with 50% penalty (XP: -${penaltyXp}, Gold refund: +${goldRefund}g)`);
      }
    }
  }

  private async processGatherSession(sessionId: number): Promise<void> {
    try {
      const session = await prisma.gatherSession.findUnique({
        where: { id: sessionId },
        include: {
          character: {
            include: {
              stats: true,
            }
          }
        }
      });

      if (!session || !session.character) {
        logger.error(`Gather session ${sessionId} not found or invalid`);
        return;
      }

      if (session.status !== 'running') {
        logger.info(`Gather session ${sessionId} is not running, skipping`);
        return;
      }

      // Check if reached max gathers
      if (session.currentGather >= session.maxGathers) {
        await this.completeGatherSession(sessionId, 'max_gathers', 
          `Completou ${session.maxGathers} coletas com sucesso!`);
        return;
      }

      // Get gather node
      const node = await prisma.gatherNode.findUnique({
        where: { code: session.nodeCode },
      });

      if (!node) {
        await this.completeGatherSession(sessionId, 'error', 'Nodo de coleta não encontrado');
        return;
      }

      const character = session.character;

      // Check level requirement
      if (character.level < node.requiredLevel) {
        await this.completeGatherSession(sessionId, 'level_too_low',
          `Nível insuficiente. Requer nível ${node.requiredLevel}`);
        return;
      }

      // Simulate gathering
      const gatherResult = this.processGather(node.dropTable as any);

      // Update session counts
      await prisma.gatherSession.update({
        where: { id: sessionId },
        data: {
          currentGather: { increment: 1 },
          totalGathers: { increment: 1 },
          successfulGathers: { increment: 1 },
          lastGatherAt: new Date(),
        }
      });

      // Process rewards
      await this.processGatherRewards(sessionId, character.id, node, gatherResult);

      // Schedule next gather
      const timeout = setTimeout(() => this.processGatherSession(sessionId), GATHER_DELAY_MS);
      this.activeSessions.set(sessionId, timeout);

      logger.info(`Session ${sessionId}: Gather ${session.currentGather + 1} completed`);

    } catch (error) {
      logger.error(`Error processing gather session ${sessionId}:`, error);
      await this.completeGatherSession(sessionId, 'error', 'Erro ao processar coleta');
    }
  }

  private async processGatherRewards(
    sessionId: number,
    characterId: number,
    node: any,
    items: Array<{ itemCode: string; quantity: number }>
  ): Promise<void> {
    const session = await prisma.gatherSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) return;

    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) return;

    // Update session items
    const currentItems = session.totalItemsGathered as any[];
    const updatedItems = [...currentItems];

    for (const item of items) {
      const existing = updatedItems.find((i: any) => i.itemCode === item.itemCode);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        updatedItems.push(item);
      }
    }

    // Calculate XP and level
    const currentXp = Number(character.xp);
    const newXp = currentXp + node.xpReward;
    const oldLevel = character.level;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > oldLevel;

    // Update character
    await prisma.character.update({
      where: { id: characterId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    // Level up bonuses
    if (leveledUp) {
      const levelsGained = newLevel - oldLevel;
      const statPointsGained = levelsGained * 3; // 3 pontos por level
      
      // Get current stats to recalculate maxHP
      const stats = await prisma.characterStats.findUnique({
        where: { characterId },
      });

      if (stats) {
        // Recalculate maxHP: HP = (VIT × 10) + (level × 5)
        const newMaxHP = (stats.totalVit * 10) + (newLevel * 5);
        const hpIncrease = levelsGained * 5; // +5 HP por level

        await prisma.character.update({
          where: { id: characterId },
          data: {
            maxHp: newMaxHP,
            hp: { increment: hpIncrease }, // Aumenta HP também
          },
        });
      }
      
      await prisma.characterStats.update({
        where: { characterId },
        data: {
          statPoints: { increment: statPointsGained }
        },
      });

      // Update session levels
      await prisma.gatherSession.update({
        where: { id: sessionId },
        data: {
          levelsGained: { increment: levelsGained },
          endLevel: newLevel,
        }
      });

      logger.info(`Session ${sessionId}: Character leveled up ${oldLevel} → ${newLevel} (+${statPointsGained} stat points)`);
    }

    // Give gathered items
    for (const item of items) {
      try {
        await inventoryService.giveItem(characterId, {
          itemCode: item.itemCode,
          quantity: item.quantity,
        });
      } catch (error) {
        logger.error(`Failed to give item ${item.itemCode} to character ${characterId}:`, error);
        // Continue with other items even if one fails
      }
    }

    // Update quests
    await questService.updateQuestProgress(characterId, {
      type: 'collect_items',
    });

    // Update session totals
    await prisma.gatherSession.update({
      where: { id: sessionId },
      data: {
        totalXpGained: { increment: node.xpReward },
        totalItemsGathered: updatedItems,
      }
    });
  }

  private processGather(dropTable: Record<string, { chance: number; quantity: [number, number] }>): Array<{ itemCode: string; quantity: number }> {
    const items: Array<{ itemCode: string; quantity: number }> = [];

    for (const [itemCode, dropInfo] of Object.entries(dropTable)) {
      if (Math.random() < dropInfo.chance) {
        const [min, max] = dropInfo.quantity;
        const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
        items.push({ itemCode, quantity });
      }
    }

    return items;
  }

  private async completeGatherSession(
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
    const session = await prisma.gatherSession.findUnique({
      where: { id: sessionId },
      include: { character: true }
    });

    if (!session) return;

    // Determine final status based on reason
    let finalStatus: 'completed' | 'cancelled' | 'error';
    if (reason === 'cancelled') {
      finalStatus = 'cancelled';
    } else if (reason === 'error' || reason === 'level_too_low') {
      finalStatus = 'error';
    } else {
      finalStatus = 'completed';
    }

    await prisma.gatherSession.update({
      where: { id: sessionId },
      data: {
        status: finalStatus,
        stoppedReason: reason,
        stoppedMessage: message,
        completedAt: new Date(),
      },
    });

    logger.info(`Gather session ${sessionId} ${finalStatus}: ${message}`);
  }
}

export const gatherWorker = new GatherWorker();
