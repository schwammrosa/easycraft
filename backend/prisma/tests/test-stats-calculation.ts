/**
 * 🧪 TESTE DE CÁLCULO DE STATS
 * 
 * Este script testa se o sistema de stats está calculando corretamente:
 * - Stats base do personagem
 * - Bônus de equipamentos
 * - Stats totais (base + equipamentos)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testStatsCalculation() {
  console.log('🧪 INICIANDO TESTE DE CÁLCULO DE STATS\n');

  try {
    // 1. Buscar primeiro personagem do banco
    const character = await prisma.character.findFirst({
      include: {
        stats: true,
        equipment: {
          include: {
            inventory: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    if (!character) {
      console.log('❌ Nenhum personagem encontrado no banco!');
      console.log('💡 Crie um personagem primeiro pelo jogo.');
      return;
    }

    console.log(`✅ Personagem encontrado: ${character.name} (Level ${character.level})\n`);

    // 2. Mostrar stats base
    console.log('📊 STATS BASE:');
    console.log(`├─ STR: ${character.stats?.str || 0}`);
    console.log(`├─ AGI: ${character.stats?.agi || 0}`);
    console.log(`├─ VIT: ${character.stats?.vit || 0}`);
    console.log(`├─ INT: ${character.stats?.int || 0}`);
    console.log(`└─ DEF: ${character.stats?.def || 0}\n`);

    // 3. Calcular bônus de equipamentos manualmente
    let equipStr = 0;
    let equipAgi = 0;
    let equipVit = 0;
    let equipInt = 0;
    let equipDef = 0;

    console.log('🛡️ EQUIPAMENTOS:');
    if (character.equipment.length === 0) {
      console.log('└─ Nenhum equipamento!\n');
    } else {
      character.equipment.forEach((equip: any) => {
        const item = equip.inventory?.item;
        if (item) {
          const attrs = typeof item.attributes === 'string' 
            ? JSON.parse(item.attributes) 
            : item.attributes;
          
          console.log(`├─ ${item.name} (${equip.slot})`);
          if (attrs.str) console.log(`│  ├─ STR +${attrs.str}`);
          if (attrs.agi) console.log(`│  ├─ AGI +${attrs.agi}`);
          if (attrs.vit) console.log(`│  ├─ VIT +${attrs.vit}`);
          if (attrs.int) console.log(`│  ├─ INT +${attrs.int}`);
          if (attrs.def) console.log(`│  └─ DEF +${attrs.def}`);

          equipStr += attrs.str || 0;
          equipAgi += attrs.agi || 0;
          equipVit += attrs.vit || 0;
          equipInt += attrs.int || 0;
          equipDef += attrs.def || 0;
        }
      });
      console.log('');
    }

    // 4. Calcular totais esperados
    const expectedTotalStr = (character.stats?.str || 0) + equipStr;
    const expectedTotalAgi = (character.stats?.agi || 0) + equipAgi;
    const expectedTotalVit = (character.stats?.vit || 0) + equipVit;
    const expectedTotalInt = (character.stats?.int || 0) + equipInt;
    const expectedTotalDef = (character.stats?.def || 0) + equipDef;

    console.log('📈 BÔNUS DE EQUIPAMENTOS:');
    console.log(`├─ STR: +${equipStr}`);
    console.log(`├─ AGI: +${equipAgi}`);
    console.log(`├─ VIT: +${equipVit}`);
    console.log(`├─ INT: +${equipInt}`);
    console.log(`└─ DEF: +${equipDef}\n`);

    console.log('🎯 STATS TOTAIS (ESPERADO):');
    console.log(`├─ totalStr: ${expectedTotalStr} (${character.stats?.str} base + ${equipStr} equip)`);
    console.log(`├─ totalAgi: ${expectedTotalAgi} (${character.stats?.agi} base + ${equipAgi} equip)`);
    console.log(`├─ totalVit: ${expectedTotalVit} (${character.stats?.vit} base + ${equipVit} equip)`);
    console.log(`├─ totalInt: ${expectedTotalInt} (${character.stats?.int} base + ${equipInt} equip)`);
    console.log(`└─ totalDef: ${expectedTotalDef} (${character.stats?.def} base + ${equipDef} equip)\n`);

    console.log('💾 STATS TOTAIS (NO BANCO):');
    console.log(`├─ totalStr: ${character.stats?.totalStr || 0}`);
    console.log(`├─ totalAgi: ${character.stats?.totalAgi || 0}`);
    console.log(`├─ totalVit: ${character.stats?.totalVit || 0}`);
    console.log(`├─ totalInt: ${character.stats?.totalInt || 0}`);
    console.log(`└─ totalDef: ${character.stats?.totalDef || 0}\n`);

    // 5. Validar se está correto
    console.log('✅ VALIDAÇÃO:');
    
    const strMatch = (character.stats?.totalStr || 0) === expectedTotalStr;
    const agiMatch = (character.stats?.totalAgi || 0) === expectedTotalAgi;
    const vitMatch = (character.stats?.totalVit || 0) === expectedTotalVit;
    const intMatch = (character.stats?.totalInt || 0) === expectedTotalInt;
    const defMatch = (character.stats?.totalDef || 0) === expectedTotalDef;

    console.log(`├─ STR: ${strMatch ? '✅ Correto' : '❌ INCORRETO!'}`);
    console.log(`├─ AGI: ${agiMatch ? '✅ Correto' : '❌ INCORRETO!'}`);
    console.log(`├─ VIT: ${vitMatch ? '✅ Correto' : '❌ INCORRETO!'}`);
    console.log(`├─ INT: ${intMatch ? '✅ Correto' : '❌ INCORRETO!'}`);
    console.log(`└─ DEF: ${defMatch ? '✅ Correto' : '❌ INCORRETO!'}\n`);

    if (strMatch && agiMatch && vitMatch && intMatch && defMatch) {
      console.log('🎉 TESTE PASSOU! Sistema de stats está funcionando corretamente!\n');
    } else {
      console.log('❌ TESTE FALHOU! Há inconsistências no cálculo de stats!\n');
      console.log('💡 SOLUÇÃO: Equipe ou desequipe um item para recalcular.\n');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
testStatsCalculation();
