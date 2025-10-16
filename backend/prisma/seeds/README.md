# 🌱 Seeds - Popular Banco de Dados

Scripts para popular o banco de dados com dados iniciais do jogo.

## 📦 Arquivos

### Main Seed
- **main.seed.ts** - Seed principal (roda todos os outros em sequência)

### Seeds Específicos
- **seed-all-craftable-items.ts** - Todos os items craftáveis
- **seed-crafting-items.ts** - Items resultantes de crafting
- **seed-crafting.ts** - Receitas de crafting
- **seed-dungeons.ts** - Dungeons e floors
- **seed-enemies.ts** - Inimigos e monstros
- **seed-gather-nodes.ts** - Nodos de coleta (gathering)
- **seed-gathering-materials.ts** - Materiais de gathering
- **seed-missing-materials.ts** - Materiais faltantes
- **seed-quests-crafting.ts** - Missões relacionadas a crafting
- **seed-quests.ts** - Missões principais
- **seed-test-materials.ts** - Materiais para testes
- **seed-test-resources.ts** - Recursos de teste completos

## 🚀 Como Usar

### Seed Completo (Recomendado)
```bash
npm run seed:all
```

Executa `main.seed.ts` que popula o banco na ordem correta.

### Seeds Individuais
```bash
# Items
npm run seed:items

# Inimigos
npm run seed:enemies

# Missões
npm run seed:quests

# Crafting
npm run seed:crafting

# Gathering (coleta)
npm run seed:gathering

# Dungeons
npm run seed:dungeons
```

### Seeds de Desenvolvimento
```bash
# Adicionar recursos de teste ao personagem
npm run dev:test-resources
```

## 📝 Ordem de Execução

Se for rodar seeds manualmente, siga esta ordem:

1. **Items** (seed-all-craftable-items.ts)
2. **Enemies** (seed-enemies.ts)
3. **Quests** (seed-quests.ts)
4. **Crafting** (seed-crafting.ts)
5. **Gathering** (seed-gather-nodes.ts)
6. **Dungeons** (seed-dungeons.ts)

## ⚠️ Observações

- **Upsert**: Todos os seeds usam `upsert` (cria ou atualiza)
- **Idempotente**: Pode rodar múltiplas vezes sem duplicar dados
- **Logs**: Todos os seeds mostram progresso no console
- **Erro**: Se um seed falhar, verifica logs para detalhes

## 🎮 Dados Populados

### Items (~40 items)
- Armas (espadas, arcos, cajados, etc.)
- Armaduras (capacetes, peitorais, etc.)
- Consumíveis (poções, comida)
- Materiais (minério, madeira, couro, etc.)

### Enemies (~7 tipos)
- Slime (Nv 1)
- Goblin (Nv 3)
- Wolf (Nv 5)
- Skeleton (Nv 8)
- Orc (Nv 12)
- Troll (Nv 15)
- Dragon (Nv 20)

### Quests (~3 missões)
- Tutorial inicial
- Missões repetíveis
- Missões de crafting

### Crafting (~3+ receitas)
- Poção de Vida
- Equipment básico
- Items craftáveis

### Gathering (~15 nodos)
- Wood (3 tipos)
- Ore (4 tipos)
- Herbs (3 tipos)
- Crystals (2 tipos)
- Leather (3 tipos)

### Dungeons (~3 dungeons)
- Dungeon 1: 15 floors
- Dungeon 2: 15 floors
- Dungeon 3: 15 floors

---

**Total:** ~100+ registros criados no banco de dados
