import { PrismaClient, QuestType } from '@prisma/client';
import { AcceptQuestDTO, ClaimQuestDTO, QuestProgressUpdate } from './quest.types';
import { inventoryService } from '../inventory/inventory.service';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

export class QuestService {
  async getAvailableQuests(characterId: number) {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Get all quests that match level requirement
    const allQuests = await prisma.quest.findMany({
      where: {
        requiredLevel: {
          lte: character.level,
        },
      },
      orderBy: [
        { rarity: 'asc' },
        { requiredLevel: 'asc' },
      ],
    });

    // Get character's active and completed quests
    const characterQuests = await prisma.characterQuest.findMany({
      where: { characterId },
      include: { quest: true },
    });

    const activeQuestIds = new Set(characterQuests.map(cq => cq.questId));
    const completedNonRepeatableIds = new Set(
      characterQuests
        .filter(cq => cq.claimed && !cq.quest.isRepeatable)
        .map(cq => cq.questId)
    );

    // Filter available quests
    const availableQuests = allQuests.filter(quest => {
      // Already active
      if (activeQuestIds.has(quest.id)) return false;
      
      // Completed and not repeatable
      if (completedNonRepeatableIds.has(quest.id)) return false;
      
      return true;
    });

    return availableQuests;
  }

  async getActiveQuests(characterId: number) {
    return await prisma.characterQuest.findMany({
      where: {
        characterId,
        claimed: false,
      },
      include: {
        quest: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async acceptQuest(characterId: number, data: AcceptQuestDTO) {
    const quest = await prisma.quest.findUnique({
      where: { code: data.questCode },
    });

    if (!quest) {
      throw new Error('Quest não encontrada');
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (character.level < quest.requiredLevel) {
      throw new Error(`Você precisa ser nível ${quest.requiredLevel} para aceitar esta quest`);
    }

    // Check if already active
    const existing = await prisma.characterQuest.findUnique({
      where: {
        characterId_questId: {
          characterId,
          questId: quest.id,
        },
      },
    });

    if (existing && !existing.claimed) {
      throw new Error('Você já aceitou esta quest');
    }

    if (existing && existing.claimed && !quest.isRepeatable) {
      throw new Error('Esta quest não é repetível');
    }

    // Accept quest
    const characterQuest = await prisma.characterQuest.upsert({
      where: {
        characterId_questId: {
          characterId,
          questId: quest.id,
        },
      },
      update: {
        progress: 0,
        completed: false,
        claimed: false,
        startedAt: new Date(),
        completedAt: null,
        claimedAt: null,
      },
      create: {
        characterId,
        questId: quest.id,
        progress: 0,
      },
      include: {
        quest: true,
      },
    });

    return characterQuest;
  }

  async claimQuest(characterId: number, data: ClaimQuestDTO) {
    const characterQuest = await prisma.characterQuest.findFirst({
      where: {
        id: data.questId,
        characterId,
      },
      include: {
        quest: true,
      },
    });

    if (!characterQuest) {
      throw new Error('Quest não encontrada');
    }

    if (!characterQuest.completed) {
      throw new Error('Quest ainda não foi completada');
    }

    if (characterQuest.claimed) {
      throw new Error('Recompensa já foi coletada');
    }

    // Give rewards
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    const currentXp = Number(character.xp);
    const currentGold = Number(character.gold);
    const newXp = currentXp + characterQuest.quest.xpReward;
    const newGold = currentGold + characterQuest.quest.goldReward;

    await prisma.character.update({
      where: { id: characterId },
      data: {
        xp: newXp,
        gold: newGold,
      },
    });

    // Give item rewards
    let itemsGained: any[] = [];
    if (characterQuest.quest.itemRewards) {
      try {
        const itemRewards = characterQuest.quest.itemRewards as any;
        const rewards = typeof itemRewards === 'string' 
          ? JSON.parse(itemRewards) 
          : itemRewards;
        
        if (Array.isArray(rewards)) {
          for (const reward of rewards) {
            await inventoryService.giveItem(characterId, {
              itemCode: reward.itemCode,
              quantity: reward.quantity,
            });
          }
          itemsGained = rewards;
        }
      } catch (error) {
        logger.error('Error parsing item rewards:', error);
      }
    }

    // Mark as claimed
    await prisma.characterQuest.update({
      where: { id: characterQuest.id },
      data: {
        claimed: true,
        claimedAt: new Date(),
      },
    });

    return {
      xpGained: characterQuest.quest.xpReward,
      goldGained: characterQuest.quest.goldReward,
      itemsGained,
    };
  }

  async updateQuestProgress(characterId: number, update: QuestProgressUpdate) {
    const activeQuests = await this.getActiveQuests(characterId);

    for (const cq of activeQuests) {
      let shouldUpdate = false;
      let progressIncrement = 1;

      switch (update.type) {
        case 'kill_enemy':
          if (cq.quest.type === QuestType.kill_enemies) {
            // Check if specific enemy is required
            if (cq.quest.targetData) {
              const targetData = cq.quest.targetData as any;
              const target = JSON.parse(targetData);
              if (target.enemyCode === update.data?.enemyCode) {
                shouldUpdate = true;
              }
            } else {
              // Any enemy
              shouldUpdate = true;
            }
          }
          break;

        case 'complete_battle':
          if (cq.quest.type === QuestType.complete_battles) {
            shouldUpdate = true;
          }
          break;

        case 'equip_item':
          if (cq.quest.type === QuestType.equip_items) {
            // Count equipped items
            const equipped = await prisma.equipment.count({
              where: { characterId },
            });
            
            await prisma.characterQuest.update({
              where: { id: cq.id },
              data: {
                progress: equipped,
                completed: equipped >= cq.quest.targetAmount,
                completedAt: equipped >= cq.quest.targetAmount ? new Date() : null,
              },
            });
            continue;
          }
          break;

        case 'earn_gold':
          if (cq.quest.type === QuestType.earn_gold) {
            const character = await prisma.character.findUnique({
              where: { id: characterId },
            });
            
            if (character) {
              const goldAmount = Number(character.gold);
              await prisma.characterQuest.update({
                where: { id: cq.id },
                data: {
                  progress: goldAmount,
                  completed: goldAmount >= cq.quest.targetAmount,
                  completedAt: goldAmount >= cq.quest.targetAmount ? new Date() : null,
                },
              });
            }
            continue;
          }
          break;
      }

      if (shouldUpdate) {
        const newProgress = cq.progress + progressIncrement;
        const isCompleted = newProgress >= cq.quest.targetAmount;

        await prisma.characterQuest.update({
          where: { id: cq.id },
          data: {
            progress: newProgress,
            completed: isCompleted,
            completedAt: isCompleted ? new Date() : null,
          },
        });
      }
    }

    // Check level quests
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (character) {
      const levelQuests = await prisma.characterQuest.findMany({
        where: {
          characterId,
          claimed: false,
          quest: {
            type: QuestType.reach_level,
          },
        },
        include: { quest: true },
      });

      for (const lq of levelQuests) {
        if (character.level >= lq.quest.targetAmount) {
          await prisma.characterQuest.update({
            where: { id: lq.id },
            data: {
              progress: character.level,
              completed: true,
              completedAt: new Date(),
            },
          });
        }
      }
    }
  }
}

export const questService = new QuestService();
