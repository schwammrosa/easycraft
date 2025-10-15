# EasyCraft - Mecânicas Detalhadas

## 🎮 Sistema de Personagem

### Criação de Personagem

**Customização Visual (por camadas)**:
- **Cabeça** (head): 6+ variantes iniciais
- **Braços** (arms): 6+ variantes iniciais
- **Pernas** (legs): 6+ variantes iniciais
- **Pés** (feet): 6+ variantes iniciais

Cada slot é uma camada de imagem PNG transparente que se combina para formar o avatar único.

**Atributos Base**:
- Todos os personagens começam com stats balanceados
- Progressão via níveis e equipamentos

**Nome**: Único no servidor, 3-16 caracteres alfanuméricos

---

## 📊 Sistema de Atributos

### Atributos Primários

1. **Força (STR)**
   - Aumenta dano físico
   - Base: 5 | Por nível: +1-2
   - Modificado por armas e equipamentos

2. **Agilidade (AGI)**
   - Define velocidade em combate (ordem de turnos)
   - Aumenta chance de crítico
   - Base: 5 | Por nível: +1-2

3. **Vitalidade (VIT)**
   - Determina HP máximo
   - HP = VIT × 10 + bônus de nível
   - Base: 5 | Por nível: +2-3

4. **Inteligência (INT)**
   - Aumenta eficácia de habilidades especiais (futuro)
   - Melhora sucesso em crafting complexo
   - Base: 5 | Por nível: +1-2

5. **Defesa (DEF)**
   - Reduz dano recebido
   - DEF efetiva = base + armadura
   - Base: 2 | Por nível: +1

### Atributos Derivados

- **HP**: `(VIT × 10) + (level × 5)`
- **Dano Base**: `STR + (weapon_damage)`
- **Defesa Total**: `DEF + armor_def`
- **Velocidade**: `AGI` (define ordem de turnos)
- **Taxa Crítica**: `(AGI / 10)%` base

---

## ⚔️ Sistema de Combate (Automático)

### Iniciação
1. Jogador seleciona área de batalha
2. Sistema gera inimigo apropriado ao nível
3. Combate é resolvido automaticamente no servidor

### Resolução por Turnos

```
Turno:
1. Ordem determinada por AGI (maior age primeiro)
2. Atacante causa dano = MAX(1, ATK - DEF_alvo)
3. Verifica crítico: chance = (AGI / 10)%
4. Aplica efeitos (se houver)
5. Verifica se algum combatente caiu (HP ≤ 0)
6. Próximo turno
```

### Cálculo de Dano

```javascript
// Pseudo-código
atk = attacker.str + attacker.weapon_damage
def = target.def + target.armor_def
base_damage = atk - def
damage = MAX(1, base_damage) // Mínimo 1

// Crítico
if (random(0,100) < attacker.agi / 10) {
  damage *= 2
}
```

### Resultado do Combate

**Vitória**:
- XP = `enemy_base_xp * (1 + enemy_level / 10)`
- Gold = `random(enemy_gold_min, enemy_gold_max)`
- Loot: tabela de drop do monstro (% por item)

**Derrota**:
- Sem penalidade de XP/ouro (MVP)
- Cooldown de 30 segundos antes de próxima batalha
- (Futuro: penalidade de durabilidade em equipamentos)

### Log de Batalha

Retornado em formato texto estruturado:
```
Turn 1: Você ataca! 12 de dano.
Turn 2: Goblin ataca! 5 de dano.
Turn 3: Você ataca! CRÍTICO! 24 de dano.
Resultado: VITÓRIA!
Recompensas: 35 XP, 12 Gold, 2x Iron Ore
```

---

## 🎒 Sistema de Inventário

### Estrutura
- Slots limitados (ex: 50 iniciais)
- Itens empilháveis (stackable) até limite por tipo
- Categorias: Armas, Armaduras, Materiais, Consumíveis

### Tipos de Item

1. **Equipáveis**
   - Armas (aumentam ATK)
   - Armaduras por slot: head, torso, legs, feet
   - Cada item equipado modifica stats

2. **Materiais**
   - Usados em craft
   - Vendíveis no mercado
   - Sem efeito direto

3. **Consumíveis**
   - Poções de HP (uso imediato)
   - Buffs temporários (futuro)

### Equipar Item

- Arrasta/clica item para slot de equipamento
- Só pode equipar 1 item por slot
- Stats recalculados em tempo real
- Preview de mudança antes de confirmar

---

## 🛠️ Sistema de Craft

### Mecânica

1. Jogador seleciona receita conhecida
2. Sistema verifica materiais no inventário
3. Consome materiais
4. Aplica tempo de craft (opcional: instantâneo no MVP)
5. Item criado vai para inventário

### Receitas

**Estrutura**:
```json
{
  "recipe_id": "iron_sword",
  "name": "Espada de Ferro",
  "materials": [
    {"item": "iron_ingot", "quantity": 3},
    {"item": "wood", "quantity": 1}
  ],
  "craft_time": 0,
  "result": {"item": "iron_sword", "quantity": 1}
}
```

**Desbloqueio**:
- Receitas básicas: disponíveis desde início
- Receitas avançadas: desbloqueadas por nível, missões ou descoberta

### Valor Agregado

- Materiais brutos têm valor X
- Item craftado vale > soma dos materiais
- Incentiva craft e especialização

---

## ⛏️ Sistema de Coleta

### Áreas de Coleta

Diferentes locais oferecem diferentes recursos:
- **Mina**: Iron Ore, Copper Ore, Coal
- **Floresta**: Wood, Herbs, Animal Hide
- **Lago**: Fish, Water Plants
- **Ruínas**: Ancient Fragments, Gems

### Mecânica (Simplificada - MVP)

1. Jogador entra em área de coleta
2. Seleciona recurso para coletar
3. Tempo de cooldown (ex: 5-10 segundos)
4. Recebe quantidade aleatória do recurso
5. Pode coletar novamente após cooldown

### Mecânica Avançada (Pós-MVP)

- **Ferramenta adequada**: Picareta para mineração, Machado para madeira
- **Minijogo textual**: Escolhas que afetam quantidade/qualidade
- **Sucesso variável**: Baseado em INT e ferramenta
- **Desgaste de ferramenta**: Durabilidade (futuro)

---

## 🏪 Sistema de Mercado

### Marketplace (Jogador → Jogador)

**Criar Anúncio**:
```json
{
  "item_id": 123,
  "quantity": 5,
  "price_per_unit": 10,
  "duration": "7 days"
}
```

**Listar Anúncios**:
- Filtros: tipo, preço, nome
- Ordenação: preço crescente, recente, popularidade

**Comprar**:
- Verifica ouro do comprador
- Transfere item para inventário do comprador
- Transfere ouro (menos taxa) para vendedor
- Remove ou reduz listing

**Taxa de Mercado**: 5% do valor de venda (dreno de ouro)

### NPCs Compradores (Dreno de Economia)

**Funcionamento**:
- NPCs têm tabela de itens que compram
- Preço fixo (geralmente 60-80% do valor base)
- Compra automática ou manual
- Remove itens da economia

**Exemplo**:
```json
{
  "npc_id": "merchant_bob",
  "buy_list": {
    "iron_sword": 50,
    "iron_ingot": 8,
    "wood": 2
  }
}
```

**Estratégia**:
- Se nenhum jogador compra, vende para NPC
- NPC garante liquidez para todos os itens
- Previne excesso de oferta

---

## 🎯 Sistema de Missões

### Tipos de Quest

1. **Coleta**: "Traga X unidades de Y"
2. **Combate**: "Derrote X inimigos do tipo Y"
3. **Craft**: "Crie X unidades de Y"
4. **Exploração**: "Visite área X" (futuro)

### Estrutura

```json
{
  "quest_id": "gather_iron",
  "title": "Ferreiro Necessitado",
  "description": "O ferreiro precisa de 10 Iron Ore",
  "type": "collect",
  "objectives": [
    {"item": "iron_ore", "quantity": 10}
  ],
  "rewards": {
    "xp": 100,
    "gold": 50,
    "items": [{"item": "iron_sword", "quantity": 1}]
  },
  "level_required": 1
}
```

### Progressão

- Quests disponíveis por nível
- Algumas quests desbloqueiam outras (chain)
- Quests diárias/semanais (pós-MVP)
- História principal via quests (pós-MVP)

---

## 📈 Sistema de Progressão

### Experiência e Níveis

**Ganho de XP**:
- Batalhas: Principal fonte
- Quests: Recompensas fixas
- Craft de itens complexos: XP bônus (futuro)

**Fórmula de XP por Nível**:
```javascript
xp_for_next_level = 100 * (current_level ^ 1.5)
```

**Recompensas por Level Up**:
- +2-5 pontos de atributo (distribuição automática inicial)
- Acesso a novas áreas
- Desbloqueio de receitas
- Novas quests disponíveis

### Curva de Progressão

- **Níveis 1-10**: Rápido (tutorial e aprendizado)
- **Níveis 11-25**: Moderado (core gameplay)
- **Níveis 26-50**: Gradual (endgame)

---

## 💰 Sistema Econômico

### Fontes de Ouro (Faucets)

1. Batalhas contra monstros
2. Venda para NPCs
3. Recompensas de quests
4. Venda no mercado (de outros jogadores)

### Drenos de Ouro (Sinks)

1. **Taxa de mercado**: 5% em vendas
2. **Compras de NPCs**: Poções, ferramentas
3. **Reparos de equipamento**: (futuro)
4. **Upgrades de inventário**: Slots extras (futuro)
5. **Craft com custo**: Receitas avançadas (futuro)

### Balanceamento

- Monitorar inflação: `gold_total / players_active`
- Ajustar preços de NPC conforme economia
- Eventos de dreno (ofertas especiais de NPC vendedor)

---

## 🔄 Loops de Gameplay

### Loop Principal (Hora de Jogo)

```
1. Login → Check mercado/quests
2. Equipar melhor gear
3. Fazer 5-10 batalhas (XP, gold, loot)
4. Coletar recursos necessários
5. Craft itens ou vender materiais
6. Listar itens no mercado
7. Completar 1-2 quests
8. Verificar se subiu nível
9. Logout
```

### Loop de Progressão (Sessão)

```
Nível N → Farm gold/materials → Craft/Buy gear melhor → 
Farm área mais difícil → Nível N+1
```

### Loop Econômico

```
Coletar material bruto → Craft item valioso → 
Vender no mercado → Comprar materiais raros → 
Craft item mais valioso → Ciclo se repete
```

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Especificação de mecânicas completa
