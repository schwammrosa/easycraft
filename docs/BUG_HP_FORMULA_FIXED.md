# 🐛 Bug Fix: Fórmula de HP Incorreta

**Data**: 16/10/2025  
**Status**: ✅ CORRIGIDO  
**Severidade**: ALTA  
**Impacto**: Sistema de atributos e level up

---

## 📋 Descrição do Bug

O sistema estava calculando HP incorretamente, usando uma fórmula diferente da especificada na documentação.

**Exemplo do bug:**
- Personagem Level 1 com 6 VIT
- **HP Esperado**: 65 [(6 × 10) + (1 × 5)]
- **HP Atual**: 110 [50 + (6 × 10)]

---

## 🔍 Causa Raiz

O código estava usando uma constante `BASE_HP = 50` ao invés de considerar o nível na fórmula.

**Fórmula Incorreta:**
```typescript
HP = BASE_HP + (VIT × 10)
HP = 50 + (VIT × 10)
```

**Fórmula Correta (conforme docs/02_mecanicas_detalhadas.md):**
```typescript
HP = (VIT × 10) + (level × 5)
```

---

## 🛠️ Arquivos Corrigidos

### 1. `character-stats.service.ts`
**Mudanças:**
- ✅ Alterado `BASE_HP` para `HP_PER_LEVEL = 5`
- ✅ Método `calculateMaxHP()` agora recebe `level` como parâmetro
- ✅ Fórmula atualizada: `(vit * 10) + (level * 5)`
- ✅ Aplicado em `distributeStatPoints()` e `resetStats()`

### 2. `character.service.ts`
**Mudanças:**
- ✅ `INITIAL_HP` atualizado de `50` para `55`
- ✅ Cálculo: `(5 VIT × 10) + (1 level × 5) = 55`

### 3. `battle.service.ts`
**Mudanças:**
- ✅ Adicionado recálculo de `maxHP` no level up
- ✅ Fórmula: `(totalVit × 10) + (newLevel × 5)`
- ✅ HP aumenta +5 por nível ganho

### 4. `farmWorker.ts`
**Mudanças:**
- ✅ Adicionado recálculo de `maxHP` no level up durante farm mode
- ✅ Mesma lógica do battle.service.ts

### 5. `gatherWorker.ts`
**Mudanças:**
- ✅ Adicionado recálculo de `maxHP` no level up durante coleta
- ✅ Mesma lógica do battle.service.ts

---

## 🔧 Script de Migração

Criado script para corrigir personagens existentes:

**Arquivo:** `backend/prisma/fix-character-hp.ts`

**Execução:**
```bash
cd backend
npm run fix:hp
```

**Funcionalidade:**
- Busca todos os personagens
- Recalcula HP correto baseado em VIT e level
- Mantém proporção do HP atual (evita morte súbita)
- Atualiza `maxHP` e `hp` no banco

---

## 📊 Exemplos de Correção

### Level 1, VIT 5 (inicial)
| Antes | Depois |
|-------|--------|
| HP: 50/100 | HP: 27/55 |

### Level 10, VIT 15
| Antes | Depois |
|-------|--------|
| HP: 100/200 | HP: 100/200 |
| ❌ Incorreto | ✅ Correto |

### Level 1, VIT 6 (após +1 ponto)
| Antes | Depois |
|-------|--------|
| HP: 60/110 | HP: 33/65 |
| ❌ Incorreto | ✅ Correto |

---

## ✅ Validação

### Testes Manuais
- [x] Criar novo personagem → HP inicial 55 ✅
- [x] Adicionar +1 VIT → HP vai para 65 ✅
- [x] Level up → maxHP aumenta +5 ✅
- [x] Level up no farm mode → maxHP atualizado ✅
- [x] Level up na coleta → maxHP atualizado ✅

### Fórmula Validada
```typescript
// Level 1, VIT 5
HP = (5 × 10) + (1 × 5) = 55 ✅

// Level 1, VIT 6
HP = (6 × 10) + (1 × 5) = 65 ✅

// Level 2, VIT 5
HP = (5 × 10) + (2 × 5) = 60 ✅

// Level 10, VIT 15
HP = (15 × 10) + (10 × 5) = 200 ✅
```

---

## 🚀 Deploy

### Local
```bash
cd backend
npm run fix:hp  # Corrigir personagens existentes
npm run dev     # Testar localmente
```

### Produção (Render)
1. Push para main → Auto-deploy
2. Executar via Render Shell:
   ```bash
   npm run fix:hp
   ```
3. Monitorar logs no Render Dashboard

---

## 📝 Notas Adicionais

### Impacto em Personagens Existentes
- Personagens existentes terão HP **reduzido** após a correção
- O script mantém a **proporção** do HP atual (não mata ninguém)
- Recomenda-se avisar players sobre o ajuste

### Progressão Futura
- HP escala melhor com VIT agora
- Level tem impacto menor (+5 por nível)
- Balanceamento está correto conforme design original

### Compatibilidade
- ✅ Compatível com todos os sistemas existentes
- ✅ Sem breaking changes na API
- ✅ Frontend não precisa de alterações

---

## 🎯 Próximos Passos

1. ✅ Corrigir código (FEITO)
2. ⏳ Executar script de migração em produção
3. ⏳ Monitorar feedback dos players
4. ⏳ Ajustar balanceamento se necessário

---

**Corrigido por:** Cascade AI  
**Aprovado por:** Desenvolvedor  
**Versão:** 1.0.1
