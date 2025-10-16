# 🎮 SISTEMA DE ATRIBUTOS ESTILO RAGNAROK ONLINE

## 📊 Visão Geral

Implementado sistema de distribuição manual de pontos de atributo similar ao Ragnarok Online, onde o jogador escolhe onde investir seus pontos ao subir de nível.

---

## 🆕 MUDANÇAS IMPLEMENTADAS

### **ANTES (Sistema Automático)** ❌
```
Level Up → STR aumenta automaticamente
VIT não afeta maxHP
Sem escolha do jogador
```

### **DEPOIS (Sistema Manual - Ragnarok Style)** ✅
```
Level Up → Ganha 3 pontos de atributo
Jogador escolhe onde investir (STR, AGI, VIT, INT)
VIT aumenta maxHP (1 VIT = +10 HP)
Pode resetar stats pagando Gold
```

---

## 🎯 COMO FUNCIONA

### **1. Level Up**
```
Subiu de nível → Ganha 3 pontos de atributo
Pontos ficam salvos em "statPoints"
Pode distribuir quando quiser
```

### **2. Distribuir Pontos**
```
Endpoint: POST /api/characters/:id/stats/distribute
Body: {
  "str": 2,
  "agi": 1,
  "vit": 0,
  "int": 0
}

Resultado:
- STR +2
- AGI +1
- statPoints -3
- maxHP recalculado se VIT mudou
```

### **3. Cálculo de HP**
```
maxHP = 50 (base) + (VIT * 10)

Exemplos:
VIT 5  → 50 + (5 * 10)  = 100 HP
VIT 10 → 50 + (10 * 10) = 150 HP
VIT 20 → 50 + (20 * 10) = 250 HP
VIT 50 → 50 + (50 * 10) = 550 HP
```

### **4. Resetar Stats**
```
Endpoint: POST /api/characters/:id/stats/reset

Custo:
- Level 1-10:  100 gold
- Level 11-20: 500 gold
- Level 21+:   1000 gold

Resultado:
- Todos stats voltam para 5
- Devolve todos pontos gastos
- maxHP volta para base (100)
- Perde o gold
```

---

## 🔧 DATABASE SCHEMA

### **Novo Campo Adicionado:**
```sql
ALTER TABLE character_stats 
ADD COLUMN stat_points INT NOT NULL DEFAULT 0;
```

### **CharacterStats Completo:**
```sql
CREATE TABLE character_stats (
  character_id INT PRIMARY KEY,
  
  -- Stats base (escolhidos pelo jogador)
  str INT DEFAULT 5,
  agi INT DEFAULT 5,
  vit INT DEFAULT 5,
  int INT DEFAULT 5,
  def INT DEFAULT 2,
  
  -- Pontos disponíveis para distribuir
  stat_points INT DEFAULT 0,
  
  -- Stats totais (base + equipamentos)
  total_str INT DEFAULT 5,
  total_agi INT DEFAULT 5,
  total_vit INT DEFAULT 5,
  total_int INT DEFAULT 5,
  total_def INT DEFAULT 2,
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 ENDPOINTS DA API

### **1. Distribuir Pontos**
```http
POST /api/characters/:characterId/stats/distribute
Authorization: Bearer {token}
Content-Type: application/json

{
  "str": 2,
  "agi": 1,
  "vit": 0,
  "int": 0
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Pontos distribuídos com sucesso!"
}
```

**Response Error:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "Você tem apenas 2 pontos disponíveis"
  }
}
```

---

### **2. Resetar Stats**
```http
POST /api/characters/:characterId/stats/reset
Authorization: Bearer {token}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Stats resetados! Custo: 100 gold",
  "data": {
    "goldSpent": 100
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_GOLD",
    "message": "Você precisa de 100 gold para resetar os stats"
  }
}
```

---

### **3. Ver Custo de Reset**
```http
GET /api/characters/:characterId/stats/reset-cost
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cost": 100,
    "level": 5
  }
}
```

---

## 🎮 EXEMPLO PRÁTICO

### **Personagem Level 1 (Início)**
```
Level: 1
XP: 0/100
Stats Base:
├─ STR: 5
├─ AGI: 5
├─ VIT: 5
├─ INT: 5
└─ DEF: 2

statPoints: 0
maxHP: 100 (50 + 5*10)
HP: 100/100
```

---

### **Level Up! (Level 2)**
```
✨ Subiu para Level 2!
Ganhou 3 pontos de atributo!

statPoints: 3 ⭐
```

**Jogador distribui:**
```
+2 STR
+1 VIT
```

**Resultado:**
```
Stats Base:
├─ STR: 7  (+2)
├─ AGI: 5
├─ VIT: 6  (+1)
├─ INT: 5
└─ DEF: 2

statPoints: 0
maxHP: 110 (50 + 6*10) ⬆️ +10 HP!
HP: 110/110
```

---

### **Level 5 (Build Tanque)**
```
Investiu tudo em VIT:
VIT: 17 (5 inicial + 12 pontos)

maxHP: 220 (50 + 17*10)
HP: 220/220

Personagem muito resistente! 🛡️
```

---

### **Level 5 (Build DPS)**
```
Investiu tudo em STR:
STR: 17 (5 inicial + 12 pontos)

Dano: STR * 2 = 34 de dano base!
maxHP: 100 (só base)

Personagem frágil mas forte! ⚔️
```

---

### **Level 5 (Build Balanceado)**
```
Distribuição equilibrada:
STR: 8  (+3)
AGI: 8  (+3)
VIT: 8  (+3)
INT: 8  (+3)

maxHP: 130 (50 + 8*10)
Dano: 16
Velocidade: Boa
Craft: Bom

Personagem versátil! 🎯
```

---

## 🔄 RESETAR STATS

### **Quando Usar:**
- Mudou de build (DPS → Tanque)
- Distribuiu errado
- Quer experimentar outra classe

### **Como Funciona:**
```
1. Paga gold (100-1000 dependendo do level)
2. Todos stats voltam para 5
3. Recebe TODOS os pontos gastos de volta
4. Pode redistribuir como quiser
5. maxHP volta para 100
```

### **Exemplo:**
```
Level 10 (Antes do Reset):
STR: 15
AGI: 5
VIT: 5
INT: 10
statPoints: 0
maxHP: 100

↓ RESET (custo: 500 gold) ↓

Level 10 (Depois do Reset):
STR: 5   (voltou ao inicial)
AGI: 5   (voltou ao inicial)
VIT: 5   (voltou ao inicial)
INT: 5   (voltou ao inicial)
statPoints: 27 (9 levels * 3 = 27 pontos)
maxHP: 100
Gold: -500

Agora pode redistribuir os 27 pontos!
```

---

## 🐛 BUGS CORRIGIDOS

### **1. VIT Não Aumentava maxHP** ✅
**Problema:** VIT aumentava mas maxHP ficava em 50  
**Solução:** Implementado cálculo `maxHP = 50 + (VIT * 10)`

### **2. Stats Auto-Incrementavam** ✅
**Problema:** STR aumentava automaticamente no level up  
**Solução:** Agora dá pontos para distribuir manualmente

### **3. Sem Controle do Jogador** ✅
**Problema:** Jogador não escolhia seus stats  
**Solução:** Sistema completo de distribuição manual

---

## 🎯 ESTRATÉGIAS RECOMENDADAS

### **Guerreiro (Tank)**
```
Prioridade: VIT > STR > DEF
VIT: Alto (muito HP)
STR: Médio (dano decente)
AGI: Baixo
INT: Baixo

Build: 40 VIT, 30 STR, 10 AGI, 5 INT
maxHP: ~450 HP
```

### **Guerreiro (DPS)**
```
Prioridade: STR > AGI > VIT
STR: Alto (muito dano)
AGI: Médio (velocidade)
VIT: Baixo/Médio
INT: Baixo

Build: 50 STR, 20 AGI, 15 VIT, 5 INT
Dano: ~100 por hit
```

### **Mago**
```
Prioridade: INT > VIT > AGI
INT: Alto (dano mágico)
VIT: Médio (sobrevivência)
AGI: Baixo
STR: Baixo

Build: 50 INT, 20 VIT, 10 AGI, 10 STR
Craft: Excelente
```

### **Arqueiro**
```
Prioridade: AGI > STR > VIT
AGI: Alto (velocidade + esquiva)
STR: Médio (dano)
VIT: Baixo/Médio
INT: Baixo

Build: 40 AGI, 30 STR, 15 VIT, 5 INT
Velocidade: Máxima
```

---

## 📊 TABELA DE CUSTOS

| Level | Pontos Acumulados | Custo Reset |
|-------|-------------------|-------------|
| 1     | 0                 | 100 gold    |
| 5     | 12                | 100 gold    |
| 10    | 27                | 100 gold    |
| 15    | 42                | 500 gold    |
| 20    | 57                | 500 gold    |
| 25    | 72                | 1000 gold   |
| 50    | 147               | 1000 gold   |

---

## 🚀 PRÓXIMOS PASSOS

### **Frontend:**
1. [ ] Criar tela de distribuição de pontos
2. [ ] Botões +/- para cada stat
3. [ ] Preview do maxHP ao aumentar VIT
4. [ ] Botão de Reset com confirmação
5. [ ] Mostrar statPoints disponíveis
6. [ ] Notificação ao subir de nível

### **Melhorias Futuras:**
- [ ] Presets de builds (Tank, DPS, Mago, etc)
- [ ] Calculadora de builds
- [ ] Simulador de stats
- [ ] Skills baseadas em stats
- [ ] Requisitos de stats para equipamentos

---

## 🔍 TESTES

### **Checklist:**
- [ ] Level up dá 3 pontos
- [ ] Distribuir pontos funciona
- [ ] VIT aumenta maxHP corretamente
- [ ] HP aumenta junto com maxHP
- [ ] Reset devolve todos pontos
- [ ] Reset cobra gold correto
- [ ] Não pode gastar mais pontos que tem
- [ ] Equipamentos ainda funcionam
- [ ] Stats totais atualizam

### **Como Testar:**
```bash
cd backend
npm run dev

# 1. Criar personagem
# 2. Fazer batalha e upar
# 3. Verificar statPoints
# 4. Distribuir pontos via API
# 5. Ver maxHP aumentar
# 6. Resetar stats
# 7. Verificar pontos devolvidos
```

---

**Implementado em:** 16 de Outubro de 2025  
**Versão:** 2.0.0  
**Status:** ✅ Backend Completo | ⏳ Frontend Pendente
