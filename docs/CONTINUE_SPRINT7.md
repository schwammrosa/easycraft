# 🏰 CONTINUAR SPRINT 7 - SISTEMA DE DUNGEONS

**Última Atualização:** 15/10/2025 - 14:00  
**Status:** Backend 100% ✅ | Frontend 0% ⏳  
**Tempo Restante Estimado:** 2 horas

---

## ✅ O QUE JÁ ESTÁ PRONTO

### Backend Completo
- ✅ Schema Prisma (3 models, 2 enums)
- ✅ Migration aplicada
- ✅ 8 endpoints REST API funcionais
- ✅ Sistema de dificuldade (Easy/Normal/Hard)
- ✅ Sistema de cooldown (24h)
- ✅ Sistema de batalha completo
- ✅ 3 Dungeons seeded no banco

### Arquivos Criados
```
backend/
├── prisma/
│   ├── schema.prisma (models Dungeon adicionados)
│   ├── migrations/.../add_dungeons/
│   ├── seed-dungeons.ts ✅
│   └── check-enemies.ts
├── src/modules/dungeon/
│   ├── dungeon.types.ts ✅
│   ├── dungeon.service.ts ✅
│   ├── dungeon.controller.ts ✅
│   └── dungeon.routes.ts ✅
└── src/server.ts (rotas adicionadas)

docs/
├── SPRINT7_DUNGEONS_PLAN.md ✅
└── SPRINT7_PROGRESS.md ✅
```

---

## 🎯 O QUE FALTA FAZER

### 1. Frontend Service (30min)

Criar `frontend/src/services/dungeon.service.ts`:

```typescript
import { api } from './api';

export interface Dungeon {
  id: number;
  name: string;
  description: string;
  recommendedLevel: number;
  maxFloors: number;
  cooldownHours: number;
  floors: DungeonFloor[];
}

export interface DungeonFloor {
  floorNumber: number;
  isBoss: boolean;
  enemyCount: number;
  goldReward: number;
  expReward: number;
  enemy: {
    name: string;
    level: number;
    hp: number;
  };
}

export interface DungeonRun {
  id: number;
  dungeonId: number;
  difficulty: 'easy' | 'normal' | 'hard';
  currentFloor: number;
  status: 'in_progress' | 'completed' | 'failed';
  goldEarned: number;
  expEarned: number;
  dungeon: {
    name: string;
    maxFloors: number;
  };
}

export const dungeonService = {
  async getAllDungeons() {
    const response = await api.get<ApiResponse<{ dungeons: Dungeon[] }>>('/dungeons');
    return response.data.data!.dungeons;
  },

  async canEnterDungeon(characterId: number, dungeonId: number) {
    const response = await api.get(`/dungeons/${characterId}/can-enter/${dungeonId}`);
    return response.data.data;
  },

  async enterDungeon(characterId: number, dungeonId: number, difficulty: string) {
    const response = await api.post(`/dungeons/${characterId}/enter`, {
      dungeonId,
      difficulty,
    });
    return response.data.data.run;
  },

  async battleFloor(characterId: number, runId: number, floorNumber: number) {
    const response = await api.post(`/dungeons/${characterId}/battle`, {
      runId,
      floorNumber,
    });
    return response.data.data.result;
  },

  async getActiveRun(characterId: number) {
    const response = await api.get(`/dungeons/${characterId}/active`);
    return response.data.data.run;
  },

  async getHistory(characterId: number) {
    const response = await api.get(`/dungeons/${characterId}/history`);
    return response.data.data.runs;
  },

  async getLeaderboard(dungeonId: number) {
    const response = await api.get(`/dungeons/${dungeonId}/leaderboard`);
    return response.data.data.leaderboard;
  },
};
```

---

### 2. Página Dungeons (1h)

Criar `frontend/src/pages/Dungeons.tsx`:

**Estrutura:**
```tsx
import { useState, useEffect } from 'react';
import { dungeonService } from '../services/dungeon.service';

export function Dungeons() {
  // Estados
  const [dungeons, setDungeons] = useState([]);
  const [activeRun, setActiveRun] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  
  // Funções
  const loadDungeons = async () => { /* ... */ };
  const handleEnterDungeon = async (dungeonId) => { /* ... */ };
  const handleBattle = async () => { /* ... */ };
  
  return (
    <div>
      {/* Lista de Dungeons */}
      {/* Interface de Batalha (se activeRun) */}
      {/* Leaderboard */}
    </div>
  );
}
```

**UI Sections:**
1. **Lista de Dungeons** - Cards com info e botão "Entrar"
2. **Seletor de Dificuldade** - Radio buttons (Easy/Normal/Hard)
3. **Interface de Batalha** - Quando em run ativa
4. **Leaderboard** - Tab separada

---

### 3. Adicionar Rota (5min)

Em `frontend/src/App.tsx`:

```tsx
import { Dungeons } from './pages/Dungeons';

// ... dentro do Router
<Route path="/dungeons" element={<Dungeons />} />
```

---

### 4. Link no Dashboard (5min)

Em `frontend/src/pages/Dashboard.tsx`:

```tsx
<button onClick={() => navigate('/dungeons')}>
  🏰 Dungeons
</button>
```

---

## 🎨 DESIGN SUGERIDO

### Lista de Dungeons
```
┌─────────────────────────────────────────┐
│  🏰 DUNGEONS                            │
├─────────────────────────────────────────┤
│  [Caverna dos Goblins]     ⭐⭐⭐☆☆   │
│  Nível Recomendado: 5                   │
│  Floors: 5 | Cooldown: 24h              │
│  Status: ✅ Disponível                  │
│  [Easy] [Normal] [Hard]                 │
│  → Entrar na Dungeon                    │
├─────────────────────────────────────────┤
│  [Floresta Amaldiçoada]    ⭐⭐⭐⭐☆   │
│  Nível Recomendado: 10                  │
│  Floors: 7 | Cooldown: 24h              │
│  Status: ⏰ Cooldown: 3h 25min          │
│  (bloqueado)                            │
└─────────────────────────────────────────┘
```

### Interface de Batalha
```
┌─────────────────────────────────────────┐
│  Floor 3/5 - Caverna dos Goblins        │
│  Dificuldade: Normal                    │
├─────────────────────────────────────────┤
│  ⚔️ Inimigos: 4x Goblin Batedor        │
│  Level 5 | HP: ~400                     │
│                                          │
│  Seu HP: ██████████░░ 85% (425/500)    │
│                                          │
│  Recompensas do Floor:                  │
│  💰 100g | ⭐ 200 XP | 🎁 30% item drop │
├─────────────────────────────────────────┤
│  [⚔️ Lutar!]  [🏃 Desistir]            │
└─────────────────────────────────────────┘
```

### Resultado da Batalha
```
┌─────────────────────────────────────────┐
│  ✅ VITÓRIA!                            │
├─────────────────────────────────────────┤
│  Você derrotou os inimigos!             │
│                                          │
│  Recompensas:                           │
│  💰 +100 gold                           │
│  ⭐ +200 XP                             │
│  🎁 1x Iron Ore                         │
│                                          │
│  Seu HP: ██████░░░░ 60% (300/500)      │
│  Dano causado: 850                      │
│  Dano recebido: 200                     │
├─────────────────────────────────────────┤
│  [➡️ Próximo Floor (4/5)]              │
└─────────────────────────────────────────┘
```

---

## 🧪 FLUXO DE TESTE

### Quando Retomar o Desenvolvimento:

1. **Verificar Backend:**
```bash
cd backend
npm run dev
# Testar: http://localhost:3001/api/dungeons
```

2. **Criar Service Frontend:**
```bash
cd frontend
# Criar: src/services/dungeon.service.ts
```

3. **Criar Página:**
```bash
# Criar: src/pages/Dungeons.tsx
```

4. **Testar Fluxo:**
- Listar dungeons
- Entrar em dungeon (dificuldade normal)
- Lutar floor 1
- Lutar floor 2
- ...
- Derrotar boss
- Ver recompensas
- Verificar cooldown

---

## 📋 CHECKLIST DE CONTINUAÇÃO

### Setup (5min)
- [ ] Backend rodando (npm run dev)
- [ ] Frontend rodando (npm run dev)
- [ ] Testar endpoint GET /api/dungeons

### Implementação (2h)
- [ ] Criar dungeon.service.ts (30min)
- [ ] Criar Dungeons.tsx (1h)
- [ ] Adicionar rota em App.tsx (5min)
- [ ] Adicionar link no Dashboard (5min)
- [ ] Estilizar com TailwindCSS (20min)

### Testes (15min)
- [ ] Entrar em dungeon (Easy)
- [ ] Completar dungeon
- [ ] Testar cooldown
- [ ] Testar dificuldade Hard
- [ ] Verificar recompensas
- [ ] Ver leaderboard

### Finalização (10min)
- [ ] Documentar em SPRINT7_COMPLETE.md
- [ ] Atualizar PROJECT_STATUS.md
- [ ] Commit do código

---

## 💡 DICAS PARA IMPLEMENTAÇÃO

### Estados Importantes
```typescript
const [dungeons, setDungeons] = useState<Dungeon[]>([]);
const [activeRun, setActiveRun] = useState<DungeonRun | null>(null);
const [inBattle, setInBattle] = useState(false);
const [battleResult, setBattleResult] = useState(null);
const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
```

### Lógica de Cooldown
```typescript
const canEnter = async (dungeonId: number) => {
  const result = await dungeonService.canEnterDungeon(characterId, dungeonId);
  if (!result.canEnter) {
    const remaining = new Date(result.cooldownEnd) - new Date();
    // Mostrar tempo restante
  }
};
```

### Batalha Turn-Based
```typescript
const handleBattle = async () => {
  setInBattle(true);
  const result = await dungeonService.battleFloor(
    characterId,
    activeRun.id,
    activeRun.currentFloor
  );
  
  setBattleResult(result);
  
  if (result.victory) {
    if (result.dungeonCompleted) {
      // Dungeon completada!
    } else {
      // Avançar para próximo floor
    }
  } else {
    // Derrota - fim da run
  }
  
  setInBattle(false);
};
```

---

## 🎯 RESULTADO ESPERADO

Ao final da continuação, você terá:

✅ Sistema completo de Dungeons jogável  
✅ 3 dungeons diferentes para explorar  
✅ Sistema de dificuldade funcional  
✅ Cooldown entre entradas  
✅ Recompensas especiais  
✅ Leaderboard competitivo  
✅ **CONTEÚDO ENDGAME ROBUSTO!**

---

## 📚 ARQUIVOS DE REFERÊNCIA

- **Planejamento:** `docs/SPRINT7_DUNGEONS_PLAN.md`
- **Progresso Atual:** `docs/SPRINT7_PROGRESS.md`
- **Backend Service:** `backend/src/modules/dungeon/dungeon.service.ts`
- **Endpoints:** `backend/src/modules/dungeon/dungeon.routes.ts`
- **Seed:** `backend/prisma/seed-dungeons.ts`

---

**🚀 Quando estiver pronto para continuar, é só voltar a este arquivo e seguir o checklist!**

**Tempo Estimado:** 2 horas para completar 100% da feature.
