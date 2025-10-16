# 🌲 Sistema de Coleta v2.0 - Sistema de Gold

## 🎯 Mudanças Implementadas

### **O Que Foi Mudado:**

1. ✅ **Energia → Gold**: Sistema agora usa gold ao invés de energia
2. ✅ **Cobrança Antecipada**: Gold é cobrado ANTES de iniciar a coleta
3. ✅ **Penalidade de 50%**: Cancelar coleta perde 50% de tudo (antes era 30% só de XP)
4. ✅ **Reembolso**: Ao cancelar, recebe 50% do gold gasto de volta

---

## 📋 Detalhes das Mudanças

### **1. Sistema de Cobrança**

**Antes:**
- Cobrava energia por coleta DURANTE a coleta
- Usuário não sabia custo total

**Depois:**
- Calcula custo total: `goldCost * maxGathers`
- Cobra TODO o gold ANTES de iniciar
- Mostra custo total no modal
- Verifica se tem gold suficiente
- Se não tiver gold → erro antes de iniciar

**Exemplo:**
```
Nodo: Carvalho (5g por coleta)
Quantidade: 20 coletas
Custo Total: 100g (cobrado antes de iniciar)
```

---

### **2. Penalidade de Cancelamento (50%)**

**Antes:**
- Perdia 30% da XP acumulada
- Itens ficavam intactos

**Depois:**
- Perde 50% da XP acumulada
- Perde 50% dos itens coletados
- Recebe reembolso de 50% do gold gasto

**Exemplo:**
```
Gold gasto: 100g
XP ganha: 200 XP
Itens coletados: 40x wood

CANCELOU:
- Perde: 100 XP (50%)
- Perde: 20x wood (50%)
+ Recebe: 50g de volta (50% de reembolso)
```

---

## 🔧 Arquivos Modificados

### **Backend:**

1. **Migration SQL** (`migrations/20251016180000_change_gathering_to_gold`)
   - Rename: `energy_cost` → `gold_cost`
   - Rename: `energy_used` → `gold_spent`
   - Add: `gold_refunded` column

2. **Schema Prisma** (`schema.prisma`)
   - GatherNode: `energyCost` → `goldCost`
   - GatherSession: `energyUsed` → `goldSpent`, + `goldRefunded`

3. **Seed** (`seed-gather-nodes.ts`)
   - Todas as 15 nodes com `goldCost`

4. **Types** (`gathering.types.ts`)
   - GatherNodeWithDrops: `energyCost` → `goldCost`
   - GatherSessionProgress: + `goldSpent`, + `goldRefunded`
   - GatherResult: `energyUsed` → `goldUsed`

5. **Service** (`gathering.service.ts`)
   - Calcula custo total antes de iniciar
   - Verifica se tem gold suficiente
   - Cobra gold ANTES da sessão
   - Cria sessão com `goldSpent`

6. **Worker** (`gatherWorker.ts`)
   - Implementa penalidade de 50%
   - Remove 50% XP
   - Remove 50% itens do inventário
   - Reembolsa 50% gold
   - Mensagem detalhada de cancelamento

### **Frontend:**

7. **Service** (`gathering.service.ts`)
   - GatherNode: `energyCost` → `goldCost`

8. **Page** (`Gathering.tsx`)
   - Label: "Energia" → "Gold/Coleta"
   - Modal: Mostra custo total
   - Verifica gold disponível
   - Alerta se gold insuficiente

---

## 📊 Comparação

| Item | Antes (v1.0) | Depois (v2.0) |
|------|--------------|---------------|
| **Recurso usado** | Energia | Gold |
| **Quando cobra** | Durante coleta | Antes de iniciar |
| **Usuário vê custo total?** | ❌ Não | ✅ Sim |
| **Penalidade cancelamento** | 30% XP | 50% XP + 50% Items |
| **Reembolso ao cancelar** | ❌ Nenhum | ✅ 50% do gold |
| **Verifica antes** | ❌ Não | ✅ Sim (gold suficiente) |

---

## 💰 Custos dos Nodos (Gold)

| Nodo | Nível | Gold/Coleta | XP |
|------|-------|-------------|-----|
| **Wood** |
| Carvalho Comum | 1 | 5g | 5 XP |
| Pinheiro | 3 | 6g | 8 XP |
| Árvore Ancestral | 8 | 10g | 20 XP |
| **Ore** |
| Cobre | 1 | 6g | 6 XP |
| Ferro | 2 | 8g | 10 XP |
| Carvão | 3 | 6g | 8 XP |
| Mithril | 10 | 15g | 35 XP |
| **Herb** |
| Erva Curativa | 1 | 4g | 4 XP |
| Flor Mágica | 5 | 8g | 15 XP |
| Raiz Ancestral | 9 | 12g | 25 XP |
| **Crystal** |
| Cristal de Mana | 6 | 12g | 20 XP |
| Cristal do Vazio | 12 | 20g | 50 XP |
| **Leather** |
| Caça Selvagem | 2 | 8g | 10 XP |
| Fera Exótica | 7 | 14g | 25 XP |
| Ninho de Dragão | 15 | 25g | 60 XP |

---

## 🚀 Como Testar

### **1. Rodar Migration + Generate:**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### **2. Reiniciar Backend:**
```bash
npm run dev
```

### **3. Reiniciar Frontend:**
```bash
cd frontend
npm run dev
```

### **4. Testar no Jogo:**

**Cenário 1: Coleta Normal**
1. Vá para Coleta (🌲)
2. Selecione um nodo
3. Configure quantidade (ex: 10)
4. Veja o custo total (ex: 50g)
5. Veja seu gold atual
6. Clique em "Iniciar Coleta"
7. Gold é cobrado imediatamente
8. Coleta inicia

**Cenário 2: Gold Insuficiente**
1. Selecione nodo caro
2. Configure quantidade alta (ex: 100)
3. Veja "⚠️ Insuficiente!"
4. Não consegue iniciar

**Cenário 3: Cancelar Coleta**
1. Inicie uma coleta
2. Aguarde coletar alguns items
3. Clique "Cancelar Coleta"
4. Recebe mensagem com:
   - XP perdida (-50%)
   - Items perdidos (-50%)
   - Gold reembolsado (+50%)

---

## 📝 Mensagens do Sistema

### **Erro - Gold Insuficiente:**
```
Gold insuficiente! Necessário: 100g, Disponível: 50g
```

### **Cancelamento:**
```
⚠️ COLETA CANCELADA! Penalidade de 50%:
- Perdeu 25 XP
- Perdeu itens: -10x wood, -5x herb
+ Reembolso: 50g (50% do custo)
```

---

## 🎯 Benefícios

1. **Mais Realista**: Gold é recurso principal do jogo
2. **Transparência**: Usuário sabe quanto vai gastar
3. **Decisão Consciente**: Pode avaliar se vale a pena
4. **Economia Balanceada**: Gold tem mais utilidade
5. **Penalidade Justa**: 50% incentiva completar coletas
6. **Reembolso**: Não perde tudo ao cancelar

---

## ⚠️ Importante

### **Antes de Rodar em Produção:**

1. **Backup do Banco**:
   ```bash
   pg_dump easycraft > backup_before_gathering_v2.sql
   ```

2. **Teste Local Primeiro**

3. **Comunique Jogadores**:
   - Sistema de coleta mudou
   - Agora usa gold
   - Penalidade de 50% ao cancelar

---

## 📊 Status

**Desenvolvido**: 16/10/2025  
**Versão**: 2.0.0  
**Breaking Changes**: ✅ SIM (requer migration)  
**Testado**: ⏳ Aguardando migration  
**Deploy Ready**: ✅ SIM (após migration)

---

## 🔄 Comandos de Deploy

### **Local:**
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

### **Produção (Render):**
```bash
# Fazer push do código
git add .
git commit -m "feat: gathering v2.0 - sistema de gold"
git push

# Render vai rodar automaticamente:
# - npm run build
# - npx prisma generate
# - npx prisma migrate deploy
```

---

**🌲 Gathering System v2.0 - Agora com economia de Gold! 💰**
