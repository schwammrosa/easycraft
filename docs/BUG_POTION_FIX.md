# 🐛 Bug Fix: Poção de Vida - Ingredientes Undefined

**Data**: 16/10/2025  
**Status**: 🔧 EM PROGRESSO

## Problema

```
🔴 Final error message: Ingredientes insuficientes:
undefined: undefined necessário, 0 disponível
undefined: undefined necessário, 0 disponível
... (34 linhas repetidas)
```

## Investigação

### 1. Inconsistência no Formato dos Ingredientes

**Descoberta**: Algumas receitas tinham ingredientes salvos como **string** (JSON.stringify) e outras como **object** direto.

```typescript
// Formato 1: String (seed.ts) ❌
ingredients: JSON.stringify([{ itemCode: 'herb', quantity: 5 }])

// Formato 2: Object (seed-crafting.ts) ✅
ingredients: [{ itemCode: 'herb', quantity: 5 }]
```

### 2. Receitas Afetadas

- ❌ `craft_health_potion` - Preparar Poção de Vida (string)
- ❌ `craft_iron_sword` - Forjar Espada de Ferro (string)
- ❌ `craft_leather_armor` - Criar Armadura de Couro (string)

## Correções Aplicadas

### ✅ Script de Fix Criado e Executado

```bash
npx ts-node prisma/fix-recipe-ingredients.ts
```

**Resultado**:
- ✅ 3 receitas corrigidas
- ✅ 24 receitas já estavam corretas
- ✅ Todas as 27 receitas agora têm formato consistente

### ✅ Logging Detalhado Adicionado

**Backend** (`crafting.service.ts`):
```typescript
logger.info('Recipe ingredients raw:', recipe.ingredients);
logger.info('Recipe ingredients type:', typeof recipe.ingredients);
logger.info('Recipe ingredients isArray:', Array.isArray(recipe.ingredients));
logger.info('Ingredients after cast:', ingredients);
logger.info('Checking ingredient:', ingredient);
```

## Status Atual

- ✅ Formato de ingredientes corrigido
- ✅ Logs detalhados adicionados
- 🔧 Aguardando teste no navegador para verificar se problema persiste

## Próximos Passos

1. Testar crafting de poção novamente
2. Verificar logs do backend
3. Identificar se ainda há ingredientes undefined
4. Corrigir problema se identificado

## Scripts Criados

- `prisma/fix-recipe-ingredients.ts` - Corrige formato dos ingredientes
- `prisma/check-potion-recipe.ts` - Verifica receita de poção
- `prisma/list-all-potion-recipes.ts` - Lista todas receitas de poção

## Receitas de Poção Disponíveis

1. **Preparar Poção de Vida** (craft_health_potion)
   - Level: 1
   - Ingredientes: herb x5
   
2. **Preparar Poção Pequena de HP** (craft_potion_hp_small)
   - Level: 1
   - Ingredientes: herb x5, magic_essence x1

3. **Preparar Poção Média de HP** (craft_potion_hp_medium)
   - Level: 4
   - Ingredientes: herb x8, magic_essence x2, crystal x1

4. **Preparar Poção Grande de HP** (craft_potion_hp_large)
   - Level: 8
   - Ingredientes: herb x12, magic_essence x4, crystal x2, dragon_scale x1
