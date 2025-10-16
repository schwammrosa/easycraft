# 🔥 FARM MODE - Sistema de Batalha Automática Assíncrona

## 📖 Visão Geral

O **Farm Mode** é um sistema avançado de batalha automática que permite aos jogadores farmarem XP, Gold e itens enquanto fazem outras atividades no jogo ou até mesmo em outras abas do navegador.

### **Características Principais:**
- ⚔️ **Batalhas automáticas** em tempo real (3 segundos entre cada)
- 💊 **Uso automático de poções** baseado em % de HP
- 📊 **Progresso em tempo real** atualizado a cada 2 segundos
- 🔄 **Processamento assíncrono** - pode navegar para outras páginas
- 🏃 **Sistema de fuga** com penalidade de 50%
- 🎯 **Apenas 1 farm ativo** por personagem
- 📈 **Acumulação inteligente** de XP, Gold e itens
- 🛡️ **Paradas de segurança** automáticas

---

## 🎮 Como Usar

### **1. Acessar Farm Mode**
```
Dashboard → ⚔️ Batalha → 🔥 Farm Mode
ou
Direto: /battle/farm
```

### **2. Configurar Farm**
```
1. Escolher monstro para farmar
2. Selecionar poção automática (opcional)
3. Definir % de HP para usar poção (20-80%)
4. Definir máximo de batalhas (1-500)
5. Clicar "🚀 INICIAR FARM MODE!"
```

### **3. Acompanhar Progresso**
```
⚔️ Farm em Andamento!
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Batalha     │ XP Ganho    │ Gold Ganho  │ Vitórias    │
│ 15 / 50     │ +450        │ +225        │ 15          │
└─────────────┴─────────────┴─────────────┴─────────────┘

Progresso: [████████░░░░] 30%
Lutando contra: Goblin
💊 Poções usadas: 3 | HP: 42/50

[🏃 FUGIR (Perde 50%)]
```

### **4. Navegar Livremente**
```
✅ Pode ir para Inventário
✅ Pode ir para Marketplace
✅ Pode ir para Crafting
✅ Farm continua rodando em background
✅ Ao voltar, progresso está atualizado
```

### **5. Resultado Final**
```
🎊 Resultado do Farm!
- 50 batalhas realizadas
- +1.500 XP ganho
- +750 Gold ganho
- Subiu 2 níveis (3 → 5)
- 12 poções usadas
- 45 itens dropados

[Continuar Farmando!]
```

---

## 🔧 Funcionalidades Técnicas

### **Processamento Assíncrono**
```typescript
Backend:
├─ FarmSession criada no banco
├─ FarmWorker processa em background
├─ Batalha a cada 3 segundos
├─ Atualiza progresso em tempo real
└─ Para automaticamente em condições específicas

Frontend:
├─ Polling a cada 2 segundos
├─ Atualiza painel em tempo real
├─ Permite navegação livre
└─ Mostra modal ao terminar
```

### **Uso Automático de Poções**
```
Antes de cada batalha:
1. Verifica HP atual vs HP máximo
2. Se HP% < configurado (ex: 50%):
   ├─ Procura poção configurada no inventário
   ├─ Usa poção automaticamente
   ├─ Recarrega HP
   └─ Incrementa contador de poções usadas
3. Se não tem poções + HP < 30%:
   └─ Para farm automaticamente (segurança)
```

### **Condições de Parada**
```typescript
1. max_battles: Completou número máximo configurado ✅
2. no_potions: Sem poções + HP < 30% ⚠️
3. low_hp: HP < 20% (risco de morte) ⚠️
4. died: Perdeu uma batalha 💀
5. fled: Jogador fugiu 🏃
6. error: Erro inesperado ❌
```

### **Sistema de Penalidade ao Fugir**
```typescript
Ao clicar "FUGIR":
├─ Modal de confirmação
│  ├─ Mostra recompensas atuais
│  └─ Mostra quanto vai perder (50%)
├─ Se confirmar:
│  ├─ Remove 50% do XP acumulado
│  ├─ Remove 50% do Gold acumulado
│  ├─ Mantém itens dropados
│  └─ Mostra mensagem de penalidade
└─ Status: cancelled
```

---

## 📊 Status do Farm

### **FarmSessionStatus**
| Status | Descrição | Modal | Cor |
|--------|-----------|-------|-----|
| `running` | Farm em andamento | Painel | Dourado |
| `completed` | Terminou normalmente | Sim | Azul/Verde |
| `cancelled` | Fugiu da batalha | Sim | Vermelho |
| `error` | Erro no processamento | Sim | Vermelho |

### **StoppedReason**
| Reason | Quando | Mensagem |
|--------|--------|----------|
| `max_battles` | Completou tudo | "Completou X batalhas com sucesso!" |
| `no_potions` | Sem poções + HP baixo | "Parou após X batalhas: Sem poções e HP baixo" |
| `low_hp` | HP < 20% | "Parou após X batalhas: HP muito baixo" |
| `died` | Perdeu batalha | "Derrotado após X batalhas" |
| `fled` | Fugiu | "⚠️ FUGIU! Perdeu 50% das recompensas" |
| `error` | Erro | "Erro ao processar farm" |

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: farm_sessions**
```sql
CREATE TABLE farm_sessions (
  id SERIAL PRIMARY KEY,
  character_id INT NOT NULL,
  enemy_code VARCHAR NOT NULL,
  enemy_name VARCHAR NOT NULL,
  potion_item_code VARCHAR,
  use_potion_at_hp_percent INT DEFAULT 50,
  max_battles INT NOT NULL,
  
  -- Status
  status farm_session_status DEFAULT 'running',
  
  -- Progresso
  current_battle INT DEFAULT 0,
  total_battles INT DEFAULT 0,
  victories INT DEFAULT 0,
  defeats INT DEFAULT 0,
  
  -- Recompensas
  total_xp_gained INT DEFAULT 0,
  total_gold_gained INT DEFAULT 0,
  total_items_dropped JSON DEFAULT '[]',
  levels_gained INT DEFAULT 0,
  start_level INT NOT NULL,
  end_level INT NOT NULL,
  potions_used INT DEFAULT 0,
  
  -- Finalização
  stopped_reason VARCHAR,
  stopped_message VARCHAR,
  final_hp INT,
  final_max_hp INT,
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT NOW(),
  last_battle_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE INDEX idx_farm_sessions_character ON farm_sessions(character_id);
CREATE INDEX idx_farm_sessions_status ON farm_sessions(status);
```

---

## 🔌 Endpoints da API

### **POST /api/battle/:characterId/farm**
Inicia uma nova sessão de farm.

**Request:**
```json
{
  "enemyCode": "goblin",
  "potionItemCode": "potion_hp_small",
  "usePotionAtHpPercent": 50,
  "maxBattles": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": 123
  }
}
```

### **GET /api/battle/farm/:sessionId/status**
Consulta o status atual de uma sessão de farm.

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": 123,
      "status": "running",
      "currentBattle": 15,
      "maxBattles": 50,
      "victories": 15,
      "totalXpGained": 450,
      "totalGoldGained": 225,
      "potionsUsed": 3,
      "enemyName": "Goblin",
      ...
    }
  }
}
```

### **POST /api/battle/farm/:sessionId/cancel**
Cancela uma sessão de farm em andamento (aplica penalidade de 50%).

**Response:**
```json
{
  "success": true,
  "message": "Farm cancelado com sucesso"
}
```

### **GET /api/battle/:characterId/farm/active**
Retorna a sessão de farm ativa do personagem (apenas status: running).

### **GET /api/battle/:characterId/farm/latest**
Retorna a última sessão de farm do personagem (qualquer status).

---

## 💡 Exemplos de Uso

### **Farm Simples (Sem Poções)**
```typescript
const config = {
  enemyCode: 'slime',
  maxBattles: 20
};

// Farm até completar 20 batalhas ou HP ficar < 20%
```

### **Farm Seguro (Com Poções)**
```typescript
const config = {
  enemyCode: 'goblin',
  potionItemCode: 'potion_hp_small',
  usePotionAtHpPercent: 60,  // Usa quando HP < 60%
  maxBattles: 100
};

// Farm mais longo e seguro
```

### **Farm Intensivo (Max Batalhas)**
```typescript
const config = {
  enemyCode: 'orc',
  potionItemCode: 'potion_hp_large',
  usePotionAtHpPercent: 50,
  maxBattles: 500  // Máximo permitido
};

// Farm extremo - pode levar vários minutos
```

---

## 🎯 Estratégias Recomendadas

### **Early Game (Level 1-5)**
```
Monstro: Slime
Poções: Poção Pequena
HP%: 70%
Batalhas: 20-30
→ Farm seguro para iniciantes
```

### **Mid Game (Level 6-15)**
```
Monstro: Goblin/Orc
Poções: Poção Média
HP%: 50%
Batalhas: 50-100
→ Bom equilíbrio XP/Segurança
```

### **Late Game (Level 16+)**
```
Monstro: Dragão
Poções: Poção Grande
HP%: 60%
Batalhas: 100-200
→ Máximo XP, requer boas poções
```

### **Farm de Itens**
```
Monstro: Qualquer com drops desejados
Batalhas: 200-500
→ Foco em droppar itens raros
```

---

## 🐛 Troubleshooting

### **Modal não aparece após farm terminar**
```
Solução: Volte para /battle/farm
- Modal aparece automaticamente se terminou < 5 min
```

### **Farm não inicia (já tem ativo)**
```
Solução: Só pode ter 1 farm por vez
- Aguarde o atual terminar ou fuja
```

### **Token expirou durante farm**
```
Solução: Sistema detecta automaticamente
- Redireciona para login
- Recompensas já foram salvas
```

### **HP muito baixo mas tem poções**
```
Solução: Ajuste % de uso de poção
- Se HP% < configurado, usa poção
- Se HP < 20%, para automaticamente
```

---

## 📈 Estatísticas e Limites

### **Limites do Sistema**
```
- Máximo de batalhas: 500 por sessão
- Delay entre batalhas: 3 segundos
- Polling do frontend: 2 segundos
- Janela de modal: 5 minutos após término
- HP mínimo auto-stop: 20%
- HP sem poções auto-stop: 30%
```

### **Performance**
```
- 50 batalhas: ~2.5 minutos
- 100 batalhas: ~5 minutos
- 200 batalhas: ~10 minutos
- 500 batalhas: ~25 minutos
```

### **Consumo de Poções**
```
HP inicial: 50/50
Monstro dano: 15 por batalha
HP%: 50 (usar em 25 HP)

Batalhas até usar poção: ~2
Poções por 50 batalhas: ~12-15
```

---

## 🔐 Segurança e Validações

### **Backend**
```typescript
✅ Apenas 1 farm ativo por personagem
✅ Validação de monstro (level máximo)
✅ Validação de poções no inventário
✅ Verificação de HP antes de cada batalha
✅ Autenticação JWT em todas rotas
✅ Timeout de 3s entre batalhas (anti-abuse)
✅ Limite de 500 batalhas por sessão
```

### **Frontend**
```typescript
✅ Impede múltiplos farms simultâneos
✅ Validação antes de iniciar
✅ Confirmação antes de fugir
✅ Tratamento de erros 401
✅ Polling apenas em sessão ativa
✅ Cleanup de intervals ao desmontar
```

---

## 🚀 Roadmap Futuro

### **Possíveis Melhorias:**
- [ ] Farm de múltiplos monstros sequencialmente
- [ ] Pausa/Resume de farm
- [ ] Notificações push quando terminar
- [ ] Estatísticas detalhadas (XP/hora, drop rate)
- [ ] Farm em grupo (party farm)
- [ ] Auto-vender itens comuns
- [ ] Presets de configuração salvos
- [ ] Achievements de farm

---

## 📝 Changelog

### **v1.0.0 - 16/10/2025**
- ✅ Sistema assíncrono implementado
- ✅ Polling em tempo real
- ✅ Uso automático de poções
- ✅ Sistema de fuga com penalidade
- ✅ Navegação livre durante farm
- ✅ Modal persistente após navegar
- ✅ Múltiplas condições de parada
- ✅ Status e reasons diferenciados
- ✅ Documentação completa

---

**Desenvolvido em:** 16 de Outubro de 2025  
**Status:** ✅ 100% Funcional  
**Versão:** 1.0.0
