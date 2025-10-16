# 📜 Changelog - EasyCraft

Todas as mudanças notáveis do projeto serão documentadas neste arquivo.

---

## [1.0.0] - 2025-10-16 🎉

### 🚀 Lançamento Oficial em Produção

**Deploy:**
- Frontend em produção na Vercel
- Backend em produção no Render
- Database PostgreSQL no Render
- 100% funcional e acessível publicamente

---

## [0.10.0] - 2025-10-16

### ✨ Sistema de Coleta (Gathering)

**Adicionado:**
- Model `GatherNode` e `GatherSession`
- 15 nodos de coleta (Wood, Ore, Herb, Crystal, Leather)
- Worker assíncrono para processamento de coleta
- 6 endpoints de API para gathering
- Página `Gathering.tsx` com UI completa
- Progresso em tempo real via polling
- Integração com Quest, Inventory e Level systems

**Código:**
- ~2.030 linhas adicionadas
- 9 arquivos novos
- Migration `20251016160249_add_gathering_system`

---

## [0.9.0] - 2025-10-16

### 🔥 Farm Mode (Batalha Automática Assíncrona)

**Adicionado:**
- Model `FarmSession` com status tracking
- Worker assíncrono para processamento de batalhas
- Sistema de uso automático de poções
- Progresso em tempo real via polling (2s)
- Sistema de fuga com penalidade 50%
- Navegação livre durante farm
- 5 novos endpoints de API

**Features:**
- Limite de 500 batalhas por sessão
- Múltiplas condições de parada
- Modal de resultado com estatísticas
- Sistema de dismissed sessions

**Código:**
- ~2.130 linhas adicionadas
- 5 arquivos novos
- Migration para farm_sessions

**Documentação:**
- `FARM_MODE.md` - Guia completo
- `FARM_STATUS_TEST.md` - Checklist de testes

---

## [0.8.0] - 2025-10-15

### 🎨 Polish & Refactor Frontend

**Refatorado:**
- 13 páginas com componentes reutilizáveis
- Sistema de design unificado
- TailwindCSS padronizado
- Performance otimizada

**Componentes criados:**
- `Card`, `Button`, `Badge`
- `PageLayout`, `ProgressBar`
- `Modal`, `EmptyState`
- `LoadingSpinner`

**Melhorias:**
- Consistência visual total
- Animações e transições
- Hover effects
- Gradientes modernos

---

## [0.7.0] - 2025-10-14

### 🏰 Sistema de Dungeons

**Adicionado:**
- 3 dungeons jogáveis:
  - Caverna Sombria (5 floors)
  - Templo Esquecido (8 floors)
  - Torre do Caos (10 floors)
- 3 níveis de dificuldade (Easy, Normal, Hard)
- Sistema de batalha floor-by-floor
- Boss fights com stats aumentados
- Cooldown de 24 horas
- Recompensas escaladas por dificuldade
- Histórico de runs completas

**Database:**
- Models: `Dungeon`, `DungeonFloor`, `DungeonRun`
- ~20 floors criados
- Sistema de progresso persistente

**Código:**
- ~1.800 linhas adicionadas
- Página `Dungeons.tsx` completa
- 8 endpoints de API

---

## [0.6.0] - 2025-10-13

### 🏪 Sistema de Marketplace

**Adicionado:**
- Economia player-to-player
- Sistema de compra/venda de itens
- Compra parcial ou total (quantidade configurável)
- Comissão de 5% (gold sink)
- Busca e filtros avançados
- Paginação de resultados
- Histórico de transações
- Cancelamento de anúncios
- Expiração automática após 7 dias

**Database:**
- Model `MarketplaceListing`
- Relações com Items e Characters

**Features:**
- Modal de compra inteligente
- Validação de gold
- Transferência automática de items
- UI responsiva

---

## [0.5.0] - 2025-10-12

### 🛠️ Sistema de Crafting & Consumíveis

**Adicionado:**
- 24 receitas de crafting:
  - 5 Weapons
  - 10 Armors
  - 4 Consumables
  - 5 Materials
- Taxa de sucesso variável (50%-100%)
- Requisitos de nível por receita
- Sistema de uso de poções:
  - Uso manual
  - Validação de HP
  - Restauração imediata
- Validação de materiais
- Remoção automática após crafting

**UI:**
- Página `Crafting.tsx` completa
- Cards de receitas com preview
- Modal de confirmação
- Feedback visual de sucesso/falha

---

## [0.4.0] - 2025-10-11

### 🎯 Sistema de Quests

**Adicionado:**
- 19 missões implementadas:
  - 8 Common
  - 5 Uncommon
  - 3 Rare
  - 2 Epic
  - 1 Legendary
- 6 tipos de quest:
  - kill_enemies
  - collect_items
  - reach_level
  - craft_items
  - complete_battles
  - spend_gold
- Progresso automático
- Sistema de recompensas (XP, Gold, Items)
- Quests repetíveis com cooldown
- Validação de requisitos de nível

**Database:**
- Model `Quest` e `CharacterQuest`
- Enum `QuestType` e `QuestRarity`
- Seed com 19 quests

**Features:**
- Página `Quests.tsx` com filtros
- Cards por raridade
- Barra de progresso visual
- Reivindicação de recompensas

---

## [0.3.0] - 2025-10-10

### ⚔️ Sistema de Batalhas

**Adicionado:**
- 10 tipos de inimigos (Nv.1-20):
  - Slime, Goblin, Lobo, Orc, Troll
  - Esqueleto, Dragão Jovem, Golem, Demônio, Dragão Ancestral
- Combate turn-based automático
- Sistema de XP e level up:
  - XP scaling: level * 100
  - Stat points ao subir de nível
- Sistema de críticos (2x damage)
- Drop de loot aleatório
- Sistema de descanso (recupera HP)
- Histórico de batalhas

**Database:**
- Model `Enemy` e `Battle`
- Tabela de drops configurável
- Stats e comportamento por inimigo

**Mecânicas:**
- Cálculo de dano baseado em stats
- Chance de crítico baseada em AGI
- Dodge baseado em AGI
- Validação de nível

---

## [0.2.0] - 2025-10-09

### 🎒 Sistema de Inventário & Equipamentos

**Adicionado:**
- 59 itens catalogados:
  - 15 armas (Sword, Bow, Staff)
  - 20 armaduras (Chest, Helmet, Shield, Boots, Gloves)
  - 14 consumíveis (HP/MP potions)
  - 10 materiais de crafting
- 5 slots de equipamento:
  - weapon, armor, helmet, shield, boots
- Sistema de raridades (common → legendary)
- Recálculo automático de stats
- Validação de classe e nível
- Stack de items

**Database:**
- Model `Item`, `Inventory`, `Equipment`
- Enum `ItemType`, `ItemRarity`
- Seed com 59 items

**Features:**
- Equipar/desequipar com validação
- Tooltip com stats
- Filtros por tipo e raridade
- Ordenação

---

## [0.1.0] - 2025-10-08

### 🔐 Sistema de Autenticação & Personagens

**Adicionado:**
- Autenticação JWT (access + refresh tokens)
- Sistema de login/registro
- CRUD de personagens
- 3 classes jogáveis:
  - Guerreiro (high STR/VIT)
  - Mago (high INT)
  - Arqueiro (high AGI/DEX)
- Customização por camadas:
  - head, arms, legs, feet
  - 6 variantes por parte
- Sistema de stats base
- Máximo de 3 personagens por conta

**Database:**
- Models: `User`, `Character`, `CharacterStats`
- Migrations iniciais
- Prisma ORM configurado

**Frontend:**
- Páginas: Login, Register, CharacterSelection, CharacterCreation
- Rotas privadas com autenticação
- Zustand para state management
- React Query para data fetching

**Backend:**
- Express + TypeScript
- Middleware de autenticação
- Validação de inputs
- Error handling centralizado

---

## [0.0.1] - 2025-10-07

### 🎬 Início do Projeto

**Criado:**
- Estrutura inicial do projeto
- Configuração de ambientes
- Docker Compose
- Setup do banco PostgreSQL
- Configuração Vite + React
- Configuração Express + TypeScript
- TailwindCSS setup
- Prisma ORM setup

**Documentação:**
- Visão geral do projeto
- Requisitos técnicos
- Game design document
- Database schema
- API specification
- UI/UX design
- Roadmap completo

---

## Formato do Changelog

Este changelog segue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

### Categorias
- **Adicionado** - Novas features
- **Alterado** - Mudanças em funcionalidades existentes
- **Depreciado** - Features que serão removidas
- **Removido** - Features removidas
- **Corrigido** - Bug fixes
- **Segurança** - Vulnerabilidades corrigidas

---

**Versão Atual:** 1.0.0  
**Status:** 🟢 Em Produção  
**Última Atualização:** 16/10/2025
