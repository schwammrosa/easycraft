import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnemies() {
  const enemies = await prisma.enemy.findMany({
    select: { id: true, code: true, name: true },
  });

  console.log('📋 Enemies in database:');
  console.log(JSON.stringify(enemies, null, 2));
  
  await prisma.$disconnect();
}

checkEnemies();
