# 🌲 Sistema de Coleta de Recursos (Gathering)

## Visão Geral

O **Sistema de Gathering** permite que jogadores coletem recursos automaticamente de forma assíncrona, similar ao Farm Mode, mas focado em materiais de crafting ao invés de combate.

**Data de Implementação**: 16/10/2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Funcional

---

## 📋 Características Principais

### ⚙️ Coleta Automática Assíncrona
- Processamento em background (3s entre coletas)
- Progresso em tempo real via polling (2s)
- Navegação livre durante a coleta
- Modal persistente mostrando progresso

### 🌍 Tipos de Nodos

O sistema possui 5 tipos diferentes de nodos de coleta:

1. **🌲 Wood (Madeira)** - Árvores para madeira
2. **⛏️ Ore (Minério)** - Depósitos minerais
3. **🌿 Herb (Ervas)** - Plantas medicinais e mágicas
4. **💎 Crystal (Cristais)** - Cristais mágicos
5. **🦌 Leather (Couro)** - Caça de animais

### 📊 Sistema de Progressão
- **XP por coleta**: 4 a 60 XP dependendo do nodo
- **Level up automático**: Com redistribuição de stat points
- **Requisitos de nível**: Nodos desbloqueiam com progressão
- **Energia**: Sistema de custo por coleta (4-25 energia)

### 🎁 Drop Table Dinâmico
- Múltiplos items por coleta
- Chance variável de drop (10% a 100%)
- Quantidade aleatória dentro de range
- Items raros em nodos de alto nível

---

## 🗂️ Estrutura do Sistema

### Backend

#### **Models (Prisma)**
```prisma
model GatherNode {
  id              Int             @id
  code            String          @unique
  name            String
  description     String?
  type            GatherNodeType
  requiredLevel   Int
  gatherTime      Int             // segundos
  energyCost      Int
  xpReward        Int
  dropTable       Json
}

model GatherSession {
  id                  Int
  characterId         Int
  nodeCode            String
  nodeName            String
  maxGathers          Int
  status              GatherSessionStatus
  currentGather       Int
  totalGathers        Int
  successfulGathers   Int
  totalXpGained       Int
  totalItemsGathered  Json
  levelsGained        Int
  energyUsed          Int
  stoppedReason       String?
  stoppedMessage      String?
  startedAt           DateTime
  lastGatherAt        DateTime?
  completedAt         DateTime?
}
```

#### **Endpoints API**

```typescript
// Listar nodos disponíveis
GET /api/gathering/:characterId/nodes

// Iniciar sessão de coleta
POST /api/gathering/:characterId/start
Body: { nodeCode: string, maxGathers: number }

// Status da sessão
GET /api/gathering/session/:sessionId

// Cancelar sessão
POST /api/gathering/:characterId/session/:sessionId/cancel

// Histórico
GET /api/gathering/:characterId/history?limit=10

// Sessão ativa
GET /api/gathering/:characterId/active
```

#### **Worker Process**
- `gatherWorker.ts` - Processa coletas assincronamente
- Intervalo de 3 segundos entre coletas
- Gerenciamento automático de XP e level ups
- Distribuição automática de items coletados

### Frontend

#### **Páginas**
- `Gathering.tsx` - Interface principal de coleta
  - Lista de nodos disponíveis
  - Modal de progresso em tempo real
  - Histórico de sessões
  - Configuração de quantidade de coletas

#### **Services**
- `gathering.service.ts` - Comunicação com API
  - CRUD de sessões
  - Gerenciamento de nodos
  - Polling de status

---

## 📦 Nodos de Coleta Implementados

### Madeira (Wood)
1. **Carvalho Comum** - Nv.1 - 5 XP
2. **Pinheiro** - Nv.3 - 8 XP
3. **Árvore Ancestral** - Nv.8 - 20 XP

### Minério (Ore)
1. **Depósito de Cobre** - Nv.1 - 6 XP
2. **Depósito de Ferro** - Nv.2 - 10 XP
3. **Depósito de Carvão** - Nv.3 - 8 XP
4. **Depósito de Mithril** - Nv.10 - 35 XP

### Ervas (Herb)
1. **Erva Curativa** - Nv.1 - 4 XP
2. **Flor Mágica** - Nv.5 - 15 XP
3. **Raiz Ancestral** - Nv.9 - 25 XP

### Cristais (Crystal)
1. **Cristal de Mana** - Nv.6 - 20 XP
2. **Cristal do Vazio** - Nv.12 - 50 XP

### Couro (Leather)
1. **Caça Selvagem** - Nv.2 - 10 XP
2. **Fera Exótica** - Nv.7 - 25 XP
3. **Ninho de Dragão** - Nv.15 - 60 XP

**Total**: 15 nodos de coleta

---

## 🎮 Fluxo de Uso

### 1. Acessar Sistema
```
Dashboard → 🌲 Coleta
```

### 2. Selecionar Nodo
- Visualizar nodos disponíveis por nível
- Ver requisitos e recompensas
- Selecionar nodo desejado

### 3. Configurar Sessão
- Definir quantidade de coletas (1-100)
- Ver tempo estimado
- Confirmar início

### 4. Acompanhar Progresso
- Modal mostra progresso em tempo real
- XP, items e energia atualizados
- Possibilidade de cancelar (penalidade 30% XP)

### 5. Completar Sessão
- Receber todos os items coletados
- Ver sumário de recompensas
- Fechar e iniciar nova coleta

---

## ⚠️ Regras e Limitações

### Cancelamento
- **Penalidade**: Perda de 30% da XP acumulada
- **Aviso**: Confirmação obrigatória antes de cancelar
- Items coletados até o momento são perdidos

### Restrições
- ❌ Não pode coletar durante Farm Mode ativo
- ❌ Não pode ter 2 sessões simultâneas
- ❌ Máximo de 100 coletas por sessão
- ✅ Pode navegar livremente durante coleta

### Requisitos
- Nível mínimo para cada nodo
- Personagem ativo selecionado

---

## 🔧 Integração com Outros Sistemas

### ✅ Quest System
- Atualiza progresso de quests `collect_items`
- Compatível com missões de coleta

### ✅ Crafting System
- Items coletados vão direto para inventário
- Materiais disponíveis para crafting imediato

### ✅ Level System
- XP acumulado durante coleta
- Level up automático com stat points

### ✅ Inventory System
- Items adicionados automaticamente
- Respeita stack limits

---

## 📊 Estatísticas Técnicas

### Performance
- **Intervalo entre coletas**: 3 segundos
- **Polling de status**: 2 segundos
- **Latência média**: < 100ms por operação
- **Processamento**: Assíncrono (não bloqueia servidor)

### Base de Dados
- **2 tabelas novas**: `gather_nodes`, `gather_sessions`
- **5 enums novos**: `GatherNodeType`, `GatherSessionStatus`
- **Migration**: `20251016160249_add_gathering_system`

### Código
- **Backend**: ~800 linhas (4 arquivos)
- **Frontend**: ~650 linhas (2 arquivos)
- **Seeds**: 15 nodos pré-configurados
- **Total**: ~1.450 linhas adicionadas

---

## 🚀 Próximas Melhorias

### Curto Prazo
- [ ] Sistema de energia máxima do personagem
- [ ] Bonus de XP para coletas consecutivas
- [ ] Achievements de coleta
- [ ] Visual dos items coletados

### Médio Prazo
- [ ] Nodos raros com spawn aleatório
- [ ] Sistema de clima afetando drops
- [ ] Ferramentas que aumentam eficiência
- [ ] Guild gathering (coleta em grupo)

### Longo Prazo
- [ ] Minigames de coleta
- [ ] Nodos personalizados por região
- [ ] Sistema de reflorestamento
- [ ] Profissões especializadas

---

## 📝 Como Testar

### Teste Local

1. **Aplicar Migration**:
```bash
cd backend
npx prisma migrate dev
```

2. **Popular Nodos**:
```bash
npx tsx prisma/seed-gather-nodes.ts
```

3. **Iniciar Backend**:
```bash
npm run dev
```

4. **Iniciar Frontend**:
```bash
cd ../frontend
npm run dev
```

5. **Testar no Jogo**:
- Login com personagem
- Acessar Dashboard → 🌲 Coleta
- Selecionar nodo de nível 1
- Iniciar coleta com 5-10 iterações
- Acompanhar progresso
- Verificar items no inventário

### Endpoints de Teste

```http
### Listar nodos
GET http://localhost:3001/api/gathering/1/nodes
Authorization: Bearer YOUR_TOKEN

### Iniciar coleta
POST http://localhost:3001/api/gathering/1/start
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "nodeCode": "oak_tree",
  "maxGathers": 10
}

### Ver status
GET http://localhost:3001/api/gathering/session/1
Authorization: Bearer YOUR_TOKEN
```

---

## 🐛 Troubleshooting

### Items não aparecem no inventário
- Verificar se coleta foi completada
- Checar histórico de sessões
- Recarregar inventário

### Sessão não inicia
- Verificar se não há farm ativo
- Confirmar nível suficiente
- Checar logs do servidor

### Progresso não atualiza
- Verificar conexão com API
- Polling pode estar pausado
- Reabrir página de coleta

---

## 📚 Referências

- [Farm Mode Documentation](FARM_MODE.md)
- [Crafting System](02_mecanicas_detalhadas.md#crafting)
- [Prisma Schema](../backend/prisma/schema.prisma)
- [API Routes](../backend/src/modules/gathering/)

---

**Última atualização**: 16/10/2025  
**Mantido por**: EasyCraft Team  
**Versão**: 1.0.0
