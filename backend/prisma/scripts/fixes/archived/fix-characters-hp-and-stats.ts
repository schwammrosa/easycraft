/**
 * 🔧 SCRIPT DE CORREÇÃO
 * 
 * Corrige personagens existentes:
 * 1. Recalcula maxHP baseado em VIT (50 + VIT * 10)
 * 2. Dá pontos de atributo retroativos baseado no level
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HP_PER_VIT = 10;
const BASE_HP = 50;
const STAT_POINTS_PER_LEVEL = 3;

async function fixCharacters() {
  console.log('🔧 Iniciando correção de personagens...\n');

  try {
    // Buscar todos personagens com stats
    const characters = await prisma.character.findMany({
      include: {
        stats: true
      }
    });

    console.log(`📊 Encontrados ${characters.length} personagens\n`);

    for (const character of characters) {
      if (!character.stats) {
        console.log(`⚠️  ${character.name}: Sem stats, pulando...`);
        continue;
      }

      console.log(`\n🎮 Corrigindo: ${character.name} (Level ${character.level})`);
      console.log(`   Stats atuais:`);
      console.log(`   ├─ VIT: ${character.stats.vit}`);
      console.log(`   ├─ maxHP: ${character.maxHp}`);
      console.log(`   └─ statPoints: ${character.stats.statPoints}`);

      // 1. Calcular maxHP correto baseado em VIT
      const correctMaxHP = BASE_HP + (character.stats.vit * HP_PER_VIT);
      
      // 2. Calcular stat points que deveria ter
      // Level 1 = 0 pontos, Level 2 = 3 pontos, Level 3 = 6 pontos, etc
      const shouldHaveStatPoints = (character.level - 1) * STAT_POINTS_PER_LEVEL;
      
      // 3. Calcular pontos já gastos
      const INITIAL_STATS = 5;
      const pointsSpent = (character.stats.str - INITIAL_STATS)
                        + (character.stats.agi - INITIAL_STATS)
                        + (character.stats.vit - INITIAL_STATS)
                        + (character.stats.int - INITIAL_STATS);
      
      // 4. Pontos disponíveis = deveria ter - já gastos
      const correctStatPoints = Math.max(0, shouldHaveStatPoints - pointsSpent);

      console.log(`   Correções:`);
      console.log(`   ├─ maxHP: ${character.maxHp} → ${correctMaxHP}`);
      console.log(`   ├─ Pontos devidos: ${shouldHaveStatPoints}`);
      console.log(`   ├─ Pontos gastos: ${pointsSpent}`);
      console.log(`   └─ statPoints: ${character.stats.statPoints} → ${correctStatPoints}`);

      // 5. Atualizar personagem
      await prisma.character.update({
        where: { id: character.id },
        data: {
          maxHp: correctMaxHP,
          hp: Math.min(character.hp, correctMaxHP) // Não ultrapassar novo máximo
        }
      });

      // 6. Atualizar stats
      await prisma.characterStats.update({
        where: { characterId: character.id },
        data: {
          statPoints: correctStatPoints
        }
      });

      console.log(`   ✅ Corrigido!`);
    }

    console.log(`\n🎉 Correção completa! ${characters.length} personagens processados.\n`);

  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
fixCharacters();
