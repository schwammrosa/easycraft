# 🏰 SPRINT 7 - SISTEMA DE DUNGEONS

**Data Início:** 15/10/2025 - 13:45  
**Tempo Estimado:** 4-5 horas  
**Status:** 🚧 EM DESENVOLVIMENTO  
**Prioridade:** ⭐⭐⭐⭐⭐

---

## 🎯 OBJETIVO

Implementar um sistema completo de **Dungeons** (masmorras) que fornece:
- Conteúdo endgame desafiador
- Múltiplas ondas de inimigos por dungeon
- Boss fights épicos
- Sistema de dificuldade (Easy, Normal, Hard)
- Loot especial e recompensas exclusivas
- Leaderboard competitivo
- Cooldown diário para balanceamento

---

## 📋 ESCOPO DA SPRINT

### Backend
- ✅ Models Prisma (Dungeon, DungeonFloor, DungeonRun)
- ✅ Service layer completo
- ✅ Controllers e rotas
- ✅ Sistema de recompensas
- ✅ Leaderboard

### Frontend
- ✅ Página Dungeons
- ✅ Seleção de dificuldade
- ✅ Visualização de progresso
- ✅ Leaderboard UI

### Game Design
- ✅ 3-5 dungeons diferentes
- ✅ 5-10 floors por dungeon
- ✅ Boss final em cada dungeon
- ✅ Loot tables especiais

---

## 🗺️ ARQUITETURA DO SISTEMA

### Fluxo de Gameplay

```
1. Jogador seleciona Dungeon
   ↓
2. Escolhe dificuldade (Easy/Normal/Hard)
   ↓
3. Entra no dungeon (verifica cooldown)
   ↓
4. Luta Floor 1 → Floor 2 → ... → Boss Floor
   ↓
5. Se vencer: Recebe recompensa especial
6. Se perder: Volta sem recompensa
   ↓
7. Cooldown ativado (24h)
```

### Estrutura de Dados

```typescript
Dungeon {
  id: int
  name: string (ex: "Caverna Sombria")
  description: string
  recommendedLevel: int (ex: 10)
  difficulty: Easy | Normal | Hard
  cooldownHours: int (24)
  
  floors: DungeonFloor[]
  runs: DungeonRun[]
}

DungeonFloor {
  id: int
  dungeonId: int
  floorNumber: int (1, 2, 3...)
  isBoss: boolean
  
  // Composição da wave
  enemyId: int
  enemyCount: int (quantos inimigos)
  
  // Recompensas
  goldReward: int
  expReward: int
  itemDrops: Item[] (loot table)
}

DungeonRun {
  id: int
  characterId: int
  dungeonId: int
  difficulty: Easy | Normal | Hard
  
  startedAt: DateTime
  completedAt: DateTime?
  currentFloor: int
  status: in_progress | completed | failed
  
  // Stats
  totalDamageDealt: int
  totalDamageTaken: int
  timeElapsed: int (segundos)
  
  // Recompensas
  goldEarned: int
  expEarned: int
  itemsObtained: Item[]
}
```

---

## 🎮 DUNGEONS PLANEJADOS

### 1. Caverna dos Goblins 🏔️
**Nível Recomendado:** 5  
**Floors:** 5  
**Boss:** Goblin King

```
Floor 1: 3x Goblin Scout
Floor 2: 2x Goblin Warrior
Floor 3: 4x Goblin Scout + 1x Goblin Warrior
Floor 4: 2x Goblin Shaman
Floor 5: 1x Goblin King (BOSS)
```

**Loot Especial:**
- Goblin Dagger (Common)
- Goblin Crown (Rare)
- King's Treasure Chest (Epic)

---

### 2. Floresta Amaldiçoada 🌲
**Nível Recomendado:** 10  
**Floors:** 7

```
Floor 1: 2x Wolf
Floor 2: 3x Wolf
Floor 3: 1x Bear
Floor 4: 2x Wolf + 1x Bear
Floor 5: 3x Skeleton
Floor 6: 2x Skeleton Archer
Floor 7: 1x Cursed Treant (BOSS)
```

**Loot Especial:**
- Nature's Bow (Rare)
- Cursed Wood Staff (Epic)
- Treant's Heart (Legendary)

---

### 3. Cripta Esquecida ⚰️
**Nível Recomendado:** 15  
**Floors:** 8

```
Floor 1: 3x Skeleton
Floor 2: 2x Zombie
Floor 3: 4x Skeleton + 1x Skeleton Archer
Floor 4: 3x Zombie
Floor 5: 2x Ghoul
Floor 6: 1x Vampire Spawn
Floor 7: 3x Skeleton Archer + 1x Ghoul
Floor 8: 1x Lich Lord (BOSS)
```

**Loot Especial:**
- Bone Blade (Rare)
- Lich's Staff (Epic)
- Phylactery Shard (Legendary)

---

### 4. Torre do Mago Louco 🔮
**Nível Recomendado:** 20  
**Floors:** 10

```
Floor 1-3: Elementals (Fire, Ice, Lightning)
Floor 4-6: Golems (Stone, Iron)
Floor 7-9: Demons (Imp, Fiend)
Floor 10: Archmage Boss
```

**Loot Especial:**
- Elemental Orb (Epic)
- Arcane Staff (Legendary)
- Wizard's Spellbook (Mythic)

---

### 5. Abismo das Sombras 🌑
**Nível Recomendado:** 25  
**Floors:** 12

```
Endgame dungeon - Hardest content
Boss: Shadow Dragon
```

**Loot Especial:**
- Dragon Scale Armor (Legendary)
- Shadow Blade (Mythic)
- Dragon's Hoard (Massive rewards)

---

## 🎲 SISTEMA DE DIFICULDADE

### Easy Mode
- **HP dos inimigos:** 100%
- **Dano dos inimigos:** 80%
- **Recompensas:** 100%
- **Cooldown:** 12 horas

### Normal Mode
- **HP dos inimigos:** 150%
- **Dano dos inimigos:** 100%
- **Recompensas:** 150%
- **Cooldown:** 24 horas

### Hard Mode
- **HP dos inimigos:** 250%
- **Dano dos inimigos:** 150%
- **Recompensas:** 300%
- **Cooldown:** 24 horas
- **Requisito:** Level mínimo + 5

---

## 🏆 SISTEMA DE LEADERBOARD

### Categorias:
1. **Fastest Clear** (tempo mais rápido)
2. **Most Runs Completed** (total completado)
3. **Highest Damage** (maior dano em uma run)
4. **Deathless Runs** (sem morrer)

### Rankings:
- Top 10 global
- Top 3 por dungeon
- Recompensas semanais para top rankers

---

## 💰 RECOMPENSAS

### Por Floor:
- Gold: 50-200g (escala com dificuldade)
- EXP: 100-500 (escala com dificuldade)
- Item drop chance: 20-40%

### Boss Final:
- Gold: 500-2000g
- EXP: 1000-5000
- Guaranteed rare/epic drop
- Chance de legendary (5-10%)

### First Clear Bonus:
- 2x recompensas
- Achievement unlock
- Special title

---

## 🔒 SISTEMA DE COOLDOWN

### Regras:
- Cada dungeon tem cooldown independente
- Cooldown começa após **completar ou falhar**
- Pode entrar em diferentes dungeons
- Cooldown reseta às 00:00 (opcional)

### Verificação:
```typescript
const lastRun = await getLastRun(characterId, dungeonId);
const cooldownEnd = lastRun.completedAt + dungeon.cooldownHours;
const canEnter = Date.now() > cooldownEnd;
```

---

## 📊 ENDPOINTS API

### Dungeons
```
GET    /api/dungeons                    # Listar todas
GET    /api/dungeons/:id                # Detalhes de uma
GET    /api/dungeons/:id/leaderboard    # Rankings
```

### Dungeon Runs
```
POST   /api/dungeons/:characterId/:dungeonId/enter
       Body: { difficulty: 'normal' }
       
POST   /api/dungeons/:characterId/run/:runId/floor/:floorId/battle
       # Lutar em um floor específico
       
GET    /api/dungeons/:characterId/runs  # Histórico
GET    /api/dungeons/:characterId/active # Run ativa
```

---

## 🎨 UI/UX DESIGN

### Página Dungeons

```
┌─────────────────────────────────────┐
│  🏰 DUNGEONS                        │
├─────────────────────────────────────┤
│  [Caverna dos Goblins]  [Lv 5]     │
│  Description...                      │
│  Cooldown: Ready ✅ / 2h remaining  │
│  [Easy] [Normal] [Hard]             │
│  → Enter Dungeon                     │
├─────────────────────────────────────┤
│  [Floresta Amaldiçoada] [Lv 10]    │
│  ...                                 │
└─────────────────────────────────────┘
```

### During Run

```
┌─────────────────────────────────────┐
│  Floor 3/5 - Caverna dos Goblins    │
├─────────────────────────────────────┤
│  ⚔️ 3x Goblin Scout                 │
│  HP: ████████░░ 80%                 │
│                                      │
│  Your HP: ██████████ 100%           │
│  Gold Earned: 150g                  │
│  Time: 5:23                         │
│                                      │
│  [⚔️ Fight] [🏃 Retreat]            │
└─────────────────────────────────────┘
```

---

## 📈 MÉTRICAS DE SUCESSO

### Engajamento:
- % de jogadores que entram em dungeons
- Média de runs por dia
- Taxa de completação vs falha

### Balanceamento:
- Tempo médio de clear
- Taxa de morte por floor
- Distribuição de dificuldade escolhida

### Economia:
- Gold gerado por dungeons
- Itens raros dropados
- Impacto no marketplace

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Database (1h)
- [ ] Schema Prisma
- [ ] Migration
- [ ] Seed dungeons

### Fase 2: Backend (2h)
- [ ] Service layer
- [ ] Controllers
- [ ] Routes
- [ ] Sistema de cooldown
- [ ] Leaderboard

### Fase 3: Frontend (1.5h)
- [ ] Página Dungeons
- [ ] Seleção de dungeon
- [ ] Interface de batalha
- [ ] Leaderboard UI

### Fase 4: Testing & Polish (0.5h)
- [ ] Testes completos
- [ ] Balanceamento
- [ ] Documentação

---

## 🎯 RESULTADO ESPERADO

Ao final desta sprint, os jogadores poderão:
1. ✅ Ver lista de dungeons disponíveis
2. ✅ Escolher dificuldade
3. ✅ Entrar e progredir floor por floor
4. ✅ Lutar contra waves de inimigos
5. ✅ Enfrentar boss final
6. ✅ Receber recompensas especiais
7. ✅ Ver leaderboard
8. ✅ Sistema de cooldown funcionando

---

**Status:** 🚀 PRONTO PARA COMEÇAR!  
**Primeira Tarefa:** Criar schema Prisma para Dungeons
