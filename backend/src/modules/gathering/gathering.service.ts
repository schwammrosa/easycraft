import { PrismaClient } from '@prisma/client';
import { StartGatherSessionDTO, GatherNodeWithDrops, GatherSessionProgress } from './gathering.types';
import { gatherWorker } from './gatherWorker';

const prisma = new PrismaClient();

class GatheringService {
  async getGatherNodes(): Promise<GatherNodeWithDrops[]> {
    // Retorna TODOS os nodos, ordenados por nível
    // Frontend decide quais desabilitar baseado no nível do personagem
    const nodes = await prisma.gatherNode.findMany({
      orderBy: [
        { requiredLevel: 'asc' },
        { name: 'asc' }
      ],
    });

    return nodes.map(node => ({
      ...node,
      goldCost: (node as any).goldCost || (node as any).energyCost || 0,
      dropTable: node.dropTable as any,
    }));
  }

  async startGatherSessionAsync(characterId: number, dto: StartGatherSessionDTO): Promise<{ sessionId: number }> {
    // Check if character exists
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('Personagem não encontrado');
    }

    // Check for active gather session
    const activeSession = await prisma.gatherSession.findFirst({
      where: {
        characterId,
        status: 'running',
      },
    });

    if (activeSession) {
      throw new Error('Você já possui uma sessão de coleta ativa');
    }

    // Check for active farm session (can't gather while farming)
    const activeFarmSession = await prisma.farmSession.findFirst({
      where: {
        characterId,
        status: 'running',
      },
    });

    if (activeFarmSession) {
      throw new Error('Você não pode coletar enquanto está em farm mode');
    }

    // Get gather node
    const node = await prisma.gatherNode.findUnique({
      where: { code: dto.nodeCode },
    });

    if (!node) {
      throw new Error('Nodo de coleta não encontrado');
    }

    // Check level requirement
    if (character.level < node.requiredLevel) {
      throw new Error(`Nível insuficiente. Requer nível ${node.requiredLevel}`);
    }

    // Validate maxGathers
    if (dto.maxGathers < 1 || dto.maxGathers > 100) {
      throw new Error('Número de coletas deve estar entre 1 e 100');
    }

    // Calculate total gold cost
    const totalGoldCost = ((node as any).goldCost || (node as any).energyCost || 0) * dto.maxGathers;

    // Check if character has enough gold
    const currentGold = Number(character.gold);
    if (currentGold < totalGoldCost) {
      throw new Error(`Gold insuficiente! Necessário: ${totalGoldCost}g, Disponível: ${currentGold}g`);
    }

    // Deduct gold BEFORE starting session (transaction)
    await prisma.character.update({
      where: { id: characterId },
      data: {
        gold: currentGold - totalGoldCost,
      },
    });

    // Create gather session
    const session = await prisma.gatherSession.create({
      data: {
        characterId,
        nodeCode: node.code,
        nodeName: node.name,
        maxGathers: dto.maxGathers,
        status: 'running',
        startLevel: character.level,
        endLevel: character.level,
        ...(totalGoldCost ? { goldSpent: totalGoldCost } : {}),
      } as any,
    });

    // Start worker
    await gatherWorker.startGatherSession(session.id);

    return { sessionId: session.id };
  }

  async getGatherSessionStatus(sessionId: number): Promise<GatherSessionProgress> {
    const session = await prisma.gatherSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Sessão de coleta não encontrada');
    }

    return {
      ...session,
      totalItemsGathered: session.totalItemsGathered as any,
      goldSpent: (session as any).goldSpent || 0,
      goldRefunded: (session as any).goldRefunded || 0,
    };
  }

  async cancelGatherSession(sessionId: number, characterId: number): Promise<void> {
    const session = await prisma.gatherSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Sessão de coleta não encontrada');
    }

    if (session.characterId !== characterId) {
      throw new Error('Esta sessão não pertence a você');
    }

    if (session.status !== 'running') {
      throw new Error('Esta sessão não está ativa');
    }

    await gatherWorker.cancelGatherSession(sessionId);
  }

  async getGatherHistory(characterId: number, limit: number = 10): Promise<GatherSessionProgress[]> {
    const sessions = await prisma.gatherSession.findMany({
      where: { characterId },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    return sessions.map(session => ({
      ...session,
      totalItemsGathered: session.totalItemsGathered as any,
      goldSpent: (session as any).goldSpent || 0,
      goldRefunded: (session as any).goldRefunded || 0,
    }));
  }

  async getActiveGatherSession(characterId: number): Promise<GatherSessionProgress | null> {
    const session = await prisma.gatherSession.findFirst({
      where: {
        characterId,
        status: 'running',
      },
    });

    if (!session) {
      return null;
    }

    return {
      ...session,
      totalItemsGathered: session.totalItemsGathered as any,
      goldSpent: (session as any).goldSpent || 0,
      goldRefunded: (session as any).goldRefunded || 0,
    };
  }
}

export const gatheringService = new GatheringService();
