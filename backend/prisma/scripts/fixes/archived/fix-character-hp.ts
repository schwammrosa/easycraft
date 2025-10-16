import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🔧 FIX CHARACTER HP
 * 
 * Recalcula o HP de todos os personagens usando a fórmula correta:
 * HP = (VIT × 10) + (level × 5)
 * 
 * Uso: npx ts-node prisma/fix-character-hp.ts
 */

async function fixCharacterHP() {
  console.log('🔧 Iniciando correção de HP dos personagens...\n');

  const characters = await prisma.character.findMany({
    include: {
      stats: true,
    },
  });

  console.log(`📊 Total de personagens encontrados: ${characters.length}\n`);

  let fixed = 0;
  let skipped = 0;

  for (const character of characters) {
    if (!character.stats) {
      console.log(`⚠️  [${character.name}] Sem stats, pulando...`);
      skipped++;
      continue;
    }

    // Calcular HP correto: HP = (VIT × 10) + (level × 5)
    const correctMaxHP = (character.stats.totalVit * 10) + (character.level * 5);
    const currentMaxHP = character.maxHp;

    if (correctMaxHP !== currentMaxHP) {
      console.log(`🔄 [${character.name}] Level ${character.level}, VIT ${character.stats.totalVit}`);
      console.log(`   Atual: ${currentMaxHP} HP → Correto: ${correctMaxHP} HP`);

      // Atualizar maxHP mantendo a proporção do HP atual
      const hpPercentage = character.hp / currentMaxHP;
      const newHP = Math.max(1, Math.floor(correctMaxHP * hpPercentage));

      await prisma.character.update({
        where: { id: character.id },
        data: {
          maxHp: correctMaxHP,
          hp: Math.min(newHP, correctMaxHP), // Garante que não ultrapassa maxHP
        },
      });

      console.log(`   ✅ HP atualizado: ${character.hp} → ${newHP}\n`);
      fixed++;
    } else {
      console.log(`✓  [${character.name}] HP já está correto (${currentMaxHP})`);
      skipped++;
    }
  }

  console.log('\n📈 Resumo:');
  console.log(`   ✅ Corrigidos: ${fixed}`);
  console.log(`   ⏭️  Pulados: ${skipped}`);
  console.log(`   📊 Total: ${characters.length}`);
  console.log('\n✨ Correção concluída!');
}

fixCharacterHP()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
