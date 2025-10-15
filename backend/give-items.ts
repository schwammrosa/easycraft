// Script para dar itens a um personagem (para testes)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function giveItems() {
  const characterId = process.argv[2];
  
  if (!characterId) {
    console.log('❌ Usage: ts-node give-items.ts <characterId>');
    process.exit(1);
  }

  const id = parseInt(characterId);

  // Verificar se personagem existe
  const character = await prisma.character.findUnique({
    where: { id },
  });

  if (!character) {
    console.log(`❌ Personagem ${id} não encontrado`);
    process.exit(1);
  }

  console.log(`\n🎁 Dando itens para: ${character.name}\n`);

  // Itens para dar (exemplo)
  const itemsToGive = [
    { code: 'sword_iron', quantity: 1 },
    { code: 'helmet_leather', quantity: 1 },
    { code: 'armor_leather', quantity: 1 },
    { code: 'pants_leather', quantity: 1 },
    { code: 'boots_leather', quantity: 1 },
    { code: 'potion_hp_small', quantity: 5 },
    { code: 'potion_hp_medium', quantity: 3 },
    { code: 'wood', quantity: 20 },
    { code: 'iron_ore', quantity: 15 },
    { code: 'leather', quantity: 10 },
  ];

  for (const { code, quantity } of itemsToGive) {
    const item = await prisma.item.findUnique({
      where: { code },
    });

    if (!item) {
      console.log(`⚠️  Item ${code} não encontrado`);
      continue;
    }

    // Verificar se já existe
    const existing = await prisma.inventory.findUnique({
      where: {
        characterId_itemId: {
          characterId: id,
          itemId: item.id,
        },
      },
    });

    if (existing) {
      await prisma.inventory.update({
        where: { id: existing.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
      console.log(`✅ ${item.name} x${quantity} (atualizado)`);
    } else {
      await prisma.inventory.create({
        data: {
          characterId: id,
          itemId: item.id,
          quantity,
        },
      });
      console.log(`✅ ${item.name} x${quantity} (novo)`);
    }
  }

  console.log(`\n🎉 Itens dados com sucesso!\n`);
  console.log(`Acesse o jogo e vá em: Dashboard → Inventário\n`);
}

giveItems()
  .catch((e) => {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
