# EasyCraft - Game Design Document

## 💰 Sistema Econômico

### Fontes de Gold (Faucets)

| Fonte | Gold/hora | Notas |
|-------|-----------|-------|
| Batalhas Lv 1-5 | 200-300 | Principal fonte early |
| Batalhas Lv 6-15 | 400-600 | Mid game |
| Batalhas Lv 16+ | 800-1200 | End game |
| Quests | 150-300 | Consistente |
| Venda Mercado | Variável | Player-driven |

**Meta**: 600-1000 Gold/hora (jogador ativo)

### Drenos de Gold (Sinks)

- Taxa Mercado (5%): 30-150 Gold/hora
- Compras NPCs: 100-200 Gold/hora
- Reparos (futuro): 50-100 Gold/hora
- Upgrades (futuro): 200-500 Gold/hora

**Meta**: 50-70% do gold gerado deve sair

### Tabela de Preços

#### Materiais
- Wood: 2-4 Gold
- Iron Ore: 4-6 Gold
- Coal: 3-5 Gold
- Iron Ingot: 15-20 Gold

#### Equipamentos T1 (Lv 1-5)
- Iron Sword: 50-70 Gold (+3 STR)
- Leather Armor: 40-60 Gold (+2 DEF)
- Basic Boots: 30-50 Gold (+1 AGI)

#### Equipamentos T2 (Lv 6-15)
- Steel Sword: 200-300 Gold (+7 STR)
- Steel Armor: 250-350 Gold (+6 DEF)

## ⚖️ Balanceamento de Combate

### Fórmulas

**Dano**:
```
damage = MAX(1, (STR + weapon) - (DEF + armor))
critical_chance = AGI / 20
```

**HP**:
```
max_hp = (VIT * 10) + (level * 5)
```

### Inimigos por Área

#### Floresta (Lv 1-5)
- **Goblin**: 30 HP, 4 STR, 3 AGI, 2 DEF | Drop: Wood, Iron Ore | 10 Gold
- **Lobo**: 45 HP, 6 STR, 7 AGI, 3 DEF | Drop: Hide | 15 Gold
- **Urso**: 90 HP, 9 STR, 4 AGI, 7 DEF | Drop: Pelt | 30 Gold

#### Caverna (Lv 6-10)
- **Morcego**: 110 HP, 11 STR, 13 AGI, 5 DEF | Drop: Wing, Coal | 40 Gold
- **Troll**: 180 HP, 16 STR, 5 AGI, 10 DEF | Drop: Troll Skin | 60 Gold

## 📊 Progressão

### Tabela XP por Nível

```javascript
xp_needed = 100 * (level ^ 1.5)
```

| Nível | XP Necessário | XP Total | Tempo Estimado |
|-------|---------------|----------|----------------|
| 1→2 | 100 | 100 | 5 min |
| 2→3 | 283 | 383 | 10 min |
| 5→6 | 1,118 | 4,373 | 1 hora |
| 10→11 | 3,162 | 27,135 | 5 horas |
| 20→21 | 8,944 | 153,844 | 30 horas |

### Stats por Level Up

Cada nível ganha:
- STR: +1
- AGI: +1
- VIT: +2
- INT: +1
- DEF: +1

## 🛠️ Receitas de Craft

### Tier 1
- **Iron Sword**: 3x Iron Ingot, 1x Wood → +3 STR
- **Iron Pickaxe**: 2x Iron Ingot, 2x Wood → Ferramenta
- **Leather Armor**: 5x Animal Hide → +2 DEF

### Tier 2
- **Steel Sword**: 4x Steel Ingot, 1x Refined Wood → +7 STR
- **Steel Armor**: 6x Steel Ingot → +6 DEF

## 🎯 Sistema de Quests

### Tipos e Recompensas

**Tutorial** (Lv 1-3):
- Primeira Batalha: 50 XP, 20 Gold
- Equipar Item: 75 XP, Iron Sword
- Primeira Coleta: 60 XP, 30 Gold

**Early Game** (Lv 3-8):
- Coletar 10 Iron Ore: 100 XP, 50 Gold
- Derrotar 5 Goblins: 150 XP, 80 Gold
- Craftar Iron Sword: 120 XP, Iron Pickaxe

**Mid Game** (Lv 8-15):
- Derrotar Troll: 300 XP, 200 Gold, Steel Ingot
- Coletar Materiais Raros: 250 XP, 150 Gold

## 🎲 Drop Tables

### Goblin
- Wood: 80% (1-2)
- Iron Ore: 30% (1)
- Gold: 8-12

### Lobo
- Animal Hide: 70% (1-3)
- Meat: 50% (1-2)
- Gold: 12-18

### Urso
- Animal Hide: 90% (2-4)
- Rare Pelt: 10% (1)
- Gold: 25-40

## 📈 Métricas de Balanceamento

### KPIs
- Taxa de vitória primeira batalha: 90%+
- Tempo médio Lv 1→5: 1-2 horas
- Tempo médio Lv 5→10: 3-5 horas
- Taxa de retenção D1: 40%+
- Transações mercado/dia: 50+

### Ajustes
- Se taxa vitória < 80%: Reduzir stats inimigos 10%
- Se inflação > 20%/sem: Aumentar taxas ou reduzir drops
- Se mercado estagnado: Ajustar preços NPCs

---

**Versão**: 1.0  
**Data**: Outubro 2025
