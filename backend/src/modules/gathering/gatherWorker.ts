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

      // Apply 30% penalty for cancelling
      const session = await prisma.gatherSession.findUnique({
        where: { id: sessionId },
        include: { character: true }
      });

      if (session) {
        // Remove 30% of accumulated rewards
        const penaltyXp = Math.floor(session.totalXpGained * 0.3);

        const newXp = Math.max(0, Number(session.character.xp) - penaltyXp);

        await prisma.character.update({
          where: { id: session.characterId },
          data: {
            xp: newXp,
          }
        });

        // Update session with penalty info
        await prisma.gatherSession.update({
          where: { id: sessionId },
          data: {
            status: 'cancelled',
            stoppedReason: 'cancelled',
            stoppedMessage: `⚠️ COLETA CANCELADA! Perdeu 30% da XP acumulada (-${penaltyXp} XP)`,
            completedAt: new Date(),
          },
        });

        logger.info(`Gather session ${sessionId} cancelled with 30% penalty`);
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
          energyUsed: { increment: node.energyCost }
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
      await inventoryService.giveItem(characterId, {
        itemCode: item.itemCode,
        quantity: item.quantity,
      });
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
