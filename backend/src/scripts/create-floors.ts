import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFloors() {
  try {
    console.log('🏗️  Starting floor creation...');
    
    // Get all dungeons
    const dungeons = await prisma.dungeon.findMany({
      orderBy: { id: 'asc' },
    });
    
    console.log(`Found ${dungeons.length} dungeons`);
    
    if (dungeons.length === 0) {
      console.error('❌ No dungeons found! Run seed first.');
      process.exit(1);
    }
    
    // Clear existing floors
    console.log('🧹 Clearing existing floors...');
    await prisma.dungeonFloor.deleteMany({});
    
    const floors = [];
    
    // Goblin Cave (first dungeon)
    console.log(`Creating floors for: ${dungeons[0].name} (id: ${dungeons[0].id})`);
    floors.push(
      { dungeonId: dungeons[0].id, floorNumber: 1, enemyCode: 'goblin', isBoss: false },
      { dungeonId: dungeons[0].id, floorNumber: 2, enemyCode: 'goblin', isBoss: false },
      { dungeonId: dungeons[0].id, floorNumber: 3, enemyCode: 'orc', isBoss: true }
    );
    
    // Dark Forest (second dungeon)
    if (dungeons[1]) {
      console.log(`Creating floors for: ${dungeons[1].name} (id: ${dungeons[1].id})`);
      floors.push(
        { dungeonId: dungeons[1].id, floorNumber: 1, enemyCode: 'wolf', isBoss: false },
        { dungeonId: dungeons[1].id, floorNumber: 2, enemyCode: 'wolf', isBoss: false },
        { dungeonId: dungeons[1].id, floorNumber: 3, enemyCode: 'orc', isBoss: false },
        { dungeonId: dungeons[1].id, floorNumber: 4, enemyCode: 'troll', isBoss: false },
        { dungeonId: dungeons[1].id, floorNumber: 5, enemyCode: 'troll', isBoss: true }
      );
    }
    
    // Ancient Ruins (third dungeon)
    if (dungeons[2]) {
      console.log(`Creating floors for: ${dungeons[2].name} (id: ${dungeons[2].id})`);
      floors.push(
        { dungeonId: dungeons[2].id, floorNumber: 1, enemyCode: 'dark_knight', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 2, enemyCode: 'dark_knight', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 3, enemyCode: 'dark_knight', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 4, enemyCode: 'troll', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 5, enemyCode: 'dark_knight', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 6, enemyCode: 'dark_knight', isBoss: false },
        { dungeonId: dungeons[2].id, floorNumber: 7, enemyCode: 'dragon', isBoss: true }
      );
    }
    
    console.log(`📝 Creating ${floors.length} floors...`);
    await prisma.dungeonFloor.createMany({ data: floors });
    
    console.log(`✅ Successfully created ${floors.length} dungeon floors!`);
    
    // Verify
    const count = await prisma.dungeonFloor.count();
    console.log(`✅ Verification: ${count} floors in database`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createFloors()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
