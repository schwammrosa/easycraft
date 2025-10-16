import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando items de gathering...\n');

  const itemsNeeded = [
    'wood', 'herb', 'iron_ore', 'copper_ore', 'coal', 
    'mythril_ore', 'cloth', 'leather', 'magic_essence', 
    'crystal', 'dragon_scale'
  ];

  const existing = await prisma.item.findMany({
    where: {
      code: {
        in: itemsNeeded,
      },
    },
    select: {
      code: true,
      name: true,
    },
  });

  const existingCodes = existing.map(i => i.code);
  const missing = itemsNeeded.filter(code => !existingCodes.includes(code));

  console.log(`✅ Items encontrados (${existing.length}/11):`);
  existing.forEach(item => {
    console.log(`  ✓ ${item.code} - ${item.name}`);
  });

  if (missing.length > 0) {
    console.log(`\n❌ Items FALTANDO (${missing.length}):`);
    missing.forEach(code => {
      console.log(`  ✗ ${code}`);
    });
    console.log('\n⚠️  RODE O COMANDO:');
    console.log('   npx ts-node prisma/fix-gathering-items.ts\n');
  } else {
    console.log('\n✅ Todos os items de gathering existem!\n');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
