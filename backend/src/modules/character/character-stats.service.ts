import { PrismaClient } from '@prisma/client';
import { inventoryService } from '../inventory/inventory.service';

const prisma = new PrismaClient();

/**
 * 🎯 CHARACTER STATS SERVICE
 * 
 * Gerencia distribuição de pontos de atributo e cálculo de HP
 * Similar ao sistema do Ragnarok Online
 */

// HP base + (VIT * 10)
const HP_PER_VIT = 10;
const BASE_HP = 50;

// Pontos ganhos por level up
const STAT_POINTS_PER_LEVEL = 3;

export class CharacterStatsService {
  
  /**
   * Calcula HP máximo baseado em VIT
   */
  calculateMaxHP(vit: number): number {
    return BASE_HP + (vit * HP_PER_VIT);
  }

  /**
   * Distribui pontos de atributo
   */
  async distributeStatPoints(characterId: number, points: {
    str?: number;
    agi?: number;
    vit?: number;
    int?: number;
  }): Promise<void> {
    // Validar que os pontos são positivos
    const totalPointsToSpend = (points.str || 0) + (points.agi || 0) + (points.vit || 0) + (points.int || 0);
    
    if (totalPointsToSpend <= 0) {
      throw new Error('Você precisa distribuir pelo menos 1 ponto');
    }

    // Buscar stats atuais
    const stats = await prisma.characterStats.findUnique({
      where: { characterId },
      include: { character: true }
    });

    if (!stats) {
      throw new Error('Stats não encontrados');
    }

    // Verificar se tem pontos suficientes
    if (totalPointsToSpend > stats.statPoints) {
      throw new Error(`Você tem apenas ${stats.statPoints} pontos disponíveis`);
    }

    // Calcular novos stats base
    const newStr = stats.str + (points.str || 0);
    const newAgi = stats.agi + (points.agi || 0);
    const newVit = stats.vit + (points.vit || 0);
    const newInt = stats.int + (points.int || 0);

    // Atualizar stats base
    await prisma.characterStats.update({
      where: { characterId },
      data: {
        str: newStr,
        agi: newAgi,
        vit: newVit,
        int: newInt,
        statPoints: { decrement: totalPointsToSpend }
      }
    });

    // Recalcular stats totais (inclui equipamentos)
    await inventoryService['recalculateStats'](characterId);

    // Se VIT mudou, recalcular maxHP
    if (points.vit && points.vit > 0) {
      const newMaxHP = this.calculateMaxHP(newVit);
      const character = stats.character;
      
      // Aumenta HP proporcional ao aumento de maxHP
      const hpIncrease = HP_PER_VIT * (points.vit || 0);
      const newHP = Math.min(character.hp + hpIncrease, newMaxHP);

      await prisma.character.update({
        where: { id: characterId },
        data: {
          maxHp: newMaxHP,
          hp: newHP // Aumenta HP junto
        }
      });
    }
  }

  /**
   * Processa level up - dá pontos em vez de auto-incrementar stats
   */
  async processLevelUp(characterId: number, levelsGained: number): Promise<void> {
    const pointsGained = levelsGained * STAT_POINTS_PER_LEVEL;

    await prisma.characterStats.update({
      where: { characterId },
      data: {
        statPoints: { increment: pointsGained }
      }
    });
  }

  /**
   * Reseta stats para redistribuir (custo opcional)
   */
  async resetStats(characterId: number, goldCost: number = 0): Promise<void> {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { stats: true }
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    if (!character.stats) {
      throw new Error('Stats não encontrados');
    }

    // Verificar se tem gold suficiente
    if (goldCost > 0 && Number(character.gold) < goldCost) {
      throw new Error(`Você precisa de ${goldCost} gold para resetar os stats`);
    }

    // Calcular pontos totais investidos
    const level = character.level;
    const totalPointsAvailable = (level - 1) * STAT_POINTS_PER_LEVEL; // Level 1 não ganha pontos
    
    // Stats base iniciais
    const INITIAL_STATS = 5;

    // Resetar para valores iniciais
    await prisma.characterStats.update({
      where: { characterId },
      data: {
        str: INITIAL_STATS,
        agi: INITIAL_STATS,
        vit: INITIAL_STATS,
        int: INITIAL_STATS,
        statPoints: totalPointsAvailable // Devolve todos os pontos
      }
    });

    // Recalcular stats totais
    await inventoryService['recalculateStats'](characterId);

    // Resetar HP para base
    const baseMaxHP = this.calculateMaxHP(INITIAL_STATS);
    await prisma.character.update({
      where: { id: characterId },
      data: {
        maxHp: baseMaxHP,
        hp: Math.min(character.hp, baseMaxHP),
        gold: goldCost > 0 ? { decrement: goldCost } : undefined
      }
    });
  }

  /**
   * Obtém custo para resetar stats baseado no level
   */
  getResetCost(level: number): number {
    // Custo aumenta com o level
    // Level 1-10: 100 gold
    // Level 11-20: 500 gold
    // Level 21+: 1000 gold
    if (level <= 10) return 100;
    if (level <= 20) return 500;
    return 1000;
  }
}

export const characterStatsService = new CharacterStatsService();
