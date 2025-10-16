# 🗃️ Fixes Arquivados - Histórico de Correções

Scripts de correção one-off que já foram executados e estão arquivados para referência histórica.

## ⚠️ IMPORTANTE

**NÃO EXECUTE** esses scripts novamente a menos que:
- Você saiba exatamente o que está fazendo
- Você entende o contexto original do problema
- Você precisa aplicar a correção em um novo ambiente

Esses scripts foram criados para resolver problemas específicos em momentos específicos do desenvolvimento.

## 📜 Histórico de Fixes

### 1. fix-character-hp.ts
**Data:** Outubro 2025  
**Problema:** Personagens com HP incorreto após criação  
**Solução:** Recalculou HP baseado em stats (vit × 10)  
**Status:** ✅ Aplicado e resolvido

### 2. fix-characters-hp-and-stats.ts
**Data:** Outubro 2025  
**Problema:** HP e stats desatualizados em múltiplos personagens  
**Solução:** Recalculou HP e normalizou stats de todos personagens  
**Status:** ✅ Aplicado e resolvido

### 3. fix-crafting-items.ts
**Data:** Outubro 2025  
**Problema:** Items craftáveis com dados inconsistentes  
**Solução:** Corrigiu slots, tipos e atributos de items craftáveis  
**Status:** ✅ Aplicado e resolvido

### 4. fix-gathering-items.ts
**Data:** 16/10/2025  
**Problema:** Items de gathering não existiam no banco, causando erro ao coletar  
**Solução:** Criou/atualizou todos os 15 items de gathering materials  
**Detalhes:**
- Wood: oak_wood, pine_wood, ancient_wood
- Ore: copper_ore, iron_ore, coal, mythril_ore
- Herb: healing_herb, magic_flower, ancient_root
- Crystal: mana_crystal, void_crystal
- Leather: wild_leather, exotic_leather, dragon_leather
**Status:** ✅ Aplicado e resolvido

### 5. fix-item-slots.ts
**Data:** Outubro 2025  
**Problema:** Slots de items incorretos (materiais em slot weapon, etc.)  
**Solução:** Corrigiu slots para 'material' ou 'consumable' conforme tipo  
**Status:** ✅ Aplicado e resolvido

### 6. fix-recipe-ingredients.ts
**Data:** Outubro 2025  
**Problema:** Receitas com ingredientes não existentes no banco  
**Solução:** Atualizou códigos de ingredientes para items válidos  
**Status:** ✅ Aplicado e resolvido

### 7. clean-material-slots.ts
**Data:** Outubro 2025  
**Problema:** Materiais com slots inválidos (weapon, armor, etc.)  
**Solução:** Limpou e normalizou slots para 'material'  
**Status:** ✅ Aplicado e resolvido

## 📊 Estatísticas

- **Total de fixes:** 7
- **Período:** Outubro 2025
- **Tipos de problemas:**
  - HP/Stats: 2 fixes
  - Items: 3 fixes
  - Recipes: 1 fix
  - Gathering: 1 fix

## 🔍 Padrões Identificados

### Causas Comuns
1. **Falta de validação** na criação de dados
2. **Seeds desatualizados** com dados inconsistentes
3. **Mudanças no schema** sem migração de dados
4. **Referências quebradas** entre tabelas

### Lições Aprendidas
1. ✅ Validar dados na criação (Zod schemas)
2. ✅ Testar seeds antes de aplicar
3. ✅ Criar migrations para mudanças de schema
4. ✅ Verificar foreign keys antes de inserir

## 🛡️ Prevenção

Para evitar precisar de novos fixes:

1. **Validação forte** - Usar Zod em todas entradas
2. **Testes de integração** - Testar fluxos completos
3. **Seeds atualizados** - Manter seeds sincronizados com schema
4. **Verificações automáticas** - Usar check scripts regularmente

## 📝 Template para Novos Fixes

Se precisar criar um novo fix, use este template:

```typescript
// fix-description.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDescription() {
  console.log('🔧 Fixing: [DESCRIPTION]');
  
  try {
    // 1. Buscar dados problemáticos
    const problematic = await prisma.model.findMany({
      where: { /* critério */ }
    });
    
    console.log(`📊 Found ${problematic.length} records to fix`);
    
    // 2. Corrigir cada um
    for (const item of problematic) {
      await prisma.model.update({
        where: { id: item.id },
        data: { /* correção */ }
      });
      console.log(`✓ Fixed: ${item.name}`);
    }
    
    console.log('✅ Fix completed!');
  } catch (error) {
    console.error('❌ Fix failed:', error);
    throw error;
  }
}

fixDescription()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Documentar no package.json
```json
{
  "scripts": {
    "fix:description": "ts-node prisma/scripts/fixes/fix-description.ts"
  }
}
```

### Após Aplicar
1. ✅ Verificar se resolveu o problema
2. ✅ Documentar neste README.md
3. ✅ Mover para `archived/`
4. ✅ Remover do package.json (ou prefixar com `archived:`)

---

**Última atualização:** 16/10/2025  
**Próximo review:** Quando houver novo fix
