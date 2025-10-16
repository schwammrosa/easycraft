# ⚔️ SISTEMA DE ATRIBUTOS E EQUIPAMENTOS

## 📊 Visão Geral

O EasyCraft possui um sistema de atributos base + equipamentos que calculam os stats totais do personagem. Cada equipamento pode adicionar bônus em diferentes atributos.

---

## 🎯 ATRIBUTOS DO PERSONAGEM

### **Stats Base (CharacterStats)**
```typescript
str  (Strength/Força)     - Afeta dano físico
agi  (Agility/Agilidade)  - Afeta velocidade e esquiva
vit  (Vitality/Vitalidade)- Afeta HP máximo
int  (Intelligence)       - Afeta dano mágico
def  (Defense/Defesa)     - Reduz dano recebido
```

### **Stats Totais (Calculados)**
```typescript
totalStr = str base + bônus de equipamentos
totalAgi = agi base + bônus de equipamentos
totalVit = vit base + bônus de equipamentos
totalInt = int base + bônus de equipamentos
totalDef = def base + bônus de equipamentos
```

---

## 📈 VALORES INICIAIS

### **Ao Criar Personagem:**
```typescript
INITIAL_STAT_VALUE = 5
INITIAL_DEFENSE = 2
INITIAL_HP = 50
INITIAL_GOLD = 100
```

### **Primeira Criação:**
```
STR: 5 → totalStr: 5
AGI: 5 → totalAgi: 5
VIT: 5 → totalVit: 5
INT: 5 → totalInt: 5
DEF: 2 → totalDef: 2

HP:  50/50
Gold: 100
Level: 1
```

---

## 🛡️ COMO EQUIPAMENTOS AFETAM STATS

### **Formato dos Attributes (JSON):**
```json
{
  "str": 2,
  "agi": 1,
  "def": 3,
  "vit": 2,
  "int": 0
}
```

### **Cálculo Automático:**
```typescript
// Quando EQUIPA um item:
1. Busca todos equipamentos atuais
2. Soma os bônus de cada item aos stats base
3. Atualiza totalStr, totalAgi, totalVit, totalInt, totalDef

// Quando DESEQUIPA um item:
1. Recalcula sem o item
2. Atualiza os totais
```

---

## 📋 EXEMPLOS DE EQUIPAMENTOS

### **ARMAS (weapon)**

#### **Espada Curta** (Iniciante)
```json
{
  "str": 2,
  "agi": 1
}
```
- Dano físico +2
- Velocidade +1

#### **Espada de Ferro**
```json
{
  "str": 5,
  "agi": 2
}
```
- Dano físico +5
- Velocidade +2

#### **Espada Longa**
```json
{
  "str": 8,
  "agi": 3
}
```
- Dano físico +8
- Velocidade +3

#### **Cajado de Madeira** (Mago)
```json
{
  "int": 3
}
```
- Dano mágico +3

#### **Cajado Arcano** (Mago Avançado)
```json
{
  "int": 7,
  "vit": 2
}
```
- Dano mágico +7
- Vitalidade +2

#### **Arco Curto** (Arqueiro)
```json
{
  "agi": 4,
  "str": 1
}
```
- Velocidade +4
- Dano físico +1

#### **Arco Longo** (Arqueiro Avançado)
```json
{
  "agi": 7,
  "str": 3
}
```
- Velocidade +7
- Dano físico +3

---

### **CAPACETES (head)**

#### **Capacete de Couro**
```json
{
  "def": 2,
  "vit": 1
}
```
- Defesa +2
- Vitalidade +1

#### **Capacete de Ferro**
```json
{
  "def": 4,
  "vit": 2
}
```
- Defesa +4
- Vitalidade +2

#### **Capacete de Aço**
```json
{
  "def": 6,
  "vit": 3,
  "str": 1
}
```
- Defesa +6
- Vitalidade +3
- Força +1

#### **Capuz Mágico**
```json
{
  "int": 4,
  "def": 1
}
```
- Int +4
- Defesa +1

#### **Coroa Arcana**
```json
{
  "int": 7,
  "vit": 2
}
```
- Int +7
- Vitalidade +2

---

### **ARMADURAS (torso)**

#### **Armadura de Couro**
```json
{
  "def": 3,
  "agi": 1
}
```
- Defesa +3
- Agilidade +1

#### **Armadura de Ferro**
```json
{
  "def": 6,
  "vit": 3
}
```
- Defesa +6
- Vitalidade +3

#### **Armadura de Aço**
```json
{
  "def": 10,
  "vit": 5,
  "str": 2
}
```
- Defesa +10
- Vitalidade +5
- Força +2

#### **Túnica Mágica**
```json
{
  "int": 5,
  "def": 2
}
```
- Int +5
- Defesa +2

#### **Colete de Couro Reforçado**
```json
{
  "agi": 6,
  "def": 3,
  "vit": 2
}
```
- Agilidade +6
- Defesa +3
- Vitalidade +2

---

### **CALÇAS (legs)**

#### **Calças de Couro**
```json
{
  "def": 2,
  "agi": 1
}
```
- Defesa +2
- Agilidade +1

#### **Calças de Ferro**
```json
{
  "def": 5,
  "vit": 2
}
```
- Defesa +5
- Vitalidade +2

#### **Calças de Aço**
```json
{
  "def": 8,
  "vit": 4,
  "str": 1
}
```
- Defesa +8
- Vitalidade +4
- Força +1

#### **Calças Arcanas**
```json
{
  "int": 4,
  "def": 2
}
```
- Int +4
- Defesa +2

#### **Calças de Couro Leve**
```json
{
  "agi": 7,
  "def": 3
}
```
- Agilidade +7
- Defesa +3

---

### **BOTAS (feet)**

#### **Botas de Couro**
```json
{
  "agi": 1,
  "def": 1
}
```
- Agilidade +1
- Defesa +1

#### **Botas de Ferro**
```json
{
  "def": 3,
  "vit": 1
}
```
- Defesa +3
- Vitalidade +1

#### **Botas de Aço**
```json
{
  "def": 5,
  "vit": 2,
  "str": 1
}
```
- Defesa +5
- Vitalidade +2
- Força +1

#### **Botas Arcanas**
```json
{
  "int": 3,
  "agi": 1
}
```
- Int +3
- Agilidade +1

#### **Botas de Corrida**
```json
{
  "agi": 5,
  "def": 2
}
```
- Agilidade +5
- Defesa +2

---

## 🎮 EXEMPLO PRÁTICO

### **Guerreiro Level 1 - Sem Equipamentos**
```
Stats Base:
├─ STR: 5
├─ AGI: 5
├─ VIT: 5
├─ INT: 5
└─ DEF: 2

Stats Totais:
├─ totalStr: 5
├─ totalAgi: 5
├─ totalVit: 5
├─ totalInt: 5
└─ totalDef: 2
```

### **Guerreiro Level 1 - Com Equipamentos Iniciantes**
```
Equipamentos:
├─ Espada Curta (str+2, agi+1)
├─ Capacete de Couro (def+2, vit+1)
├─ Armadura de Couro (def+3, agi+1)
├─ Calças de Couro (def+2, agi+1)
└─ Botas de Couro (agi+1, def+1)

Stats Base:
├─ STR: 5
├─ AGI: 5
├─ VIT: 5
├─ INT: 5
└─ DEF: 2

Cálculo:
├─ totalStr: 5 + 2 = 7
├─ totalAgi: 5 + 1 + 1 + 1 + 1 = 9
├─ totalVit: 5 + 1 = 6
├─ totalInt: 5 + 0 = 5
└─ totalDef: 2 + 2 + 3 + 2 + 1 = 10

Stats Totais:
├─ totalStr: 7  (+2)
├─ totalAgi: 9  (+4)
├─ totalVit: 6  (+1)
├─ totalInt: 5  (+0)
└─ totalDef: 10 (+8)
```

### **Guerreiro Level 5 - Equipamentos Avançados**
```
Equipamentos:
├─ Espada Longa (str+8, agi+3)
├─ Capacete de Aço (def+6, vit+3, str+1)
├─ Armadura de Aço (def+10, vit+5, str+2)
├─ Calças de Aço (def+8, vit+4, str+1)
└─ Botas de Aço (def+5, vit+2, str+1)

Stats Base (após distribuir pontos):
├─ STR: 10  (5 inicial + 5 pontos distribuídos)
├─ AGI: 7   (5 inicial + 2 pontos distribuídos)
├─ VIT: 8   (5 inicial + 3 pontos distribuídos)
├─ INT: 5   (não investiu)
└─ DEF: 2   (base, não aumenta por pontos)

Cálculo:
├─ totalStr: 10 + 8 + 1 + 2 + 1 + 1 = 23
├─ totalAgi: 7 + 3 = 10
├─ totalVit: 8 + 3 + 5 + 4 + 2 = 22
├─ totalInt: 5 + 0 = 5
└─ totalDef: 2 + 6 + 10 + 8 + 5 = 31

Stats Totais:
├─ totalStr: 23  (+13 de equipamentos)
├─ totalAgi: 10  (+3 de equipamentos)
├─ totalVit: 22  (+14 de equipamentos)
├─ totalInt: 5   (+0 de equipamentos)
└─ totalDef: 31  (+29 de equipamentos)
```

---

## 🔧 COMO O SISTEMA FUNCIONA (Técnico)

### **1. Ao Equipar Item (inventory.service.ts)**
```typescript
async equipItem(characterId: number, itemId: number, slot: string) {
  // 1. Verifica se item existe
  // 2. Desequipa item anterior do slot (se houver)
  // 3. Equipa novo item
  // 4. RECALCULA STATS ← IMPORTANTE!
  await this.recalculateStats(characterId);
}
```

### **2. Ao Desequipar Item**
```typescript
async unequipItem(characterId: number, slot: string) {
  // 1. Remove equipamento do slot
  // 2. RECALCULA STATS ← IMPORTANTE!
  await this.recalculateStats(characterId);
}
```

### **3. Cálculo de Stats (inventory.service.ts)**
```typescript
private async recalculateStats(characterId: number) {
  // 1. Busca stats base
  const stats = await prisma.characterStats.findUnique({
    where: { characterId }
  });

  // 2. Busca todos equipamentos
  const equipment = await prisma.equipment.findMany({
    where: { characterId },
    include: { inventory: { include: { item: true } } }
  });

  // 3. Inicia com stats base
  let totalStr = stats.str;
  let totalAgi = stats.agi;
  let totalVit = stats.vit;
  let totalInt = stats.int;
  let totalDef = stats.def;

  // 4. Soma bônus de cada equipamento
  for (const equip of equipment) {
    const attrs = equip.inventory.item.attributes;
    totalStr += attrs.str || 0;
    totalAgi += attrs.agi || 0;
    totalVit += attrs.vit || 0;
    totalInt += attrs.int || 0;
    totalDef += attrs.def || 0;
  }

  // 5. Atualiza no banco
  await prisma.characterStats.update({
    where: { characterId },
    data: { totalStr, totalAgi, totalVit, totalInt, totalDef }
  });
}
```

---

## 🎯 USO EM COMBATE

### **Cálculo de Dano (battle.service.ts)**
```typescript
// Usa os TOTALS, não os base!
const charStats = {
  str: character.stats.totalStr,
  agi: character.stats.totalAgi,
  def: character.stats.totalDef
};

// Dano = (STR * 2) - (DEF / 2)
damage = Math.max(1, Math.floor((charStr * 2) - (enemyDef / 2)));
```

### **Por que usar totalStats?**
- ✅ Inclui bônus de equipamentos
- ✅ Atualizado automaticamente
- ✅ Reflete poder real do personagem
- ❌ Se usar stats base, equipamentos não funcionam!

---

## 🐛 POSSÍVEIS BUGS

### **Verificar:**
1. ✅ recalculateStats() é chamado ao equipar?
2. ✅ recalculateStats() é chamado ao desequipar?
3. ✅ Combate usa totalStr/totalAgi/totalDef?
4. ✅ Atributos dos itens estão corretos no banco?
5. ⚠️ Frontend mostra total ou base?

### **Bug Comum:**
```typescript
// ❌ ERRADO
damage = character.stats.str; // Ignora equipamentos!

// ✅ CORRETO
damage = character.stats.totalStr; // Inclui equipamentos!
```

---

## 📊 RESUMO

| Atributo | Base | Aumenta com | Afeta |
|----------|------|-------------|-------|
| **STR** | 5 | Pontos + Equipamentos | Dano físico |
| **AGI** | 5 | Pontos + Equipamentos | Velocidade, esquiva |
| **VIT** | 5 | Pontos + Equipamentos | HP máximo |
| **INT** | 5 | Pontos + Equipamentos | Dano mágico |
| **DEF** | 2 | Apenas Equipamentos | Redução de dano |

### **Total = Base + Equipamentos**
```
totalStr = str (base) + sum(equipamentos.str)
totalAgi = agi (base) + sum(equipamentos.agi)
totalVit = vit (base) + sum(equipamentos.vit)
totalInt = int (base) + sum(equipamentos.int)
totalDef = def (base) + sum(equipamentos.def)
```

---

**Documentado em:** 16 de Outubro de 2025  
**Versão:** 1.0.0  
**Status:** ✅ Sistema funcionando corretamente
