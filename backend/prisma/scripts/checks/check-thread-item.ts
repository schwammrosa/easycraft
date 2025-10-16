import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkThread() {
  const items = await prisma.item.findMany({
    where: {
      OR: [
        { code: { contains: 'thread' } },
        { name: { contains: 'Linha' } },
        { name: { contains: 'Thread' } }
      ]
    }
  });

  console.log(`Found ${items.length} items:`);
  items.forEach(item => {
    console.log(`- ${item.name} (${item.code})`);
  });

  if (items.length === 0) {
    console.log('\n⚠️ Thread item not found! Need to create it.');
  }

  await prisma.$disconnect();
}

checkThread();
