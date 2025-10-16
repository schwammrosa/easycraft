# 🛠️ Scripts - Ferramentas Utilitárias

Scripts auxiliares para desenvolvimento, verificação e manutenção do banco de dados.

## 📂 Estrutura

```
scripts/
├── dev/                    # Ferramentas de desenvolvimento
├── checks/                 # Scripts de verificação
└── fixes/                  # Scripts de correção
    └── archived/          # Fixes já aplicados
```

## 🔨 Dev - Ferramentas de Desenvolvimento

Scripts úteis durante o desenvolvimento.

### Arquivos
- **give-materials.ts** - Adiciona materiais ao inventário
- **add-potion-health.ts** - Adiciona poção de vida específica
- **add-thread-item.ts** - Adiciona item thread (linha)
- **add-all-missing-items.ts** - Adiciona todos items faltantes
- **list-all-potion-recipes.ts** - Lista todas receitas de poção

### Uso
```bash
npm run dev:give-materials    # Dar materiais ao personagem
npm run dev:test-resources    # Adicionar recursos completos de teste
```

## 🔍 Checks - Scripts de Verificação

Verificam integridade e consistência dos dados.

### Arquivos
- **check-items.ts** - Verifica items no banco
- **check-recipes.ts** - Verifica receitas de crafting
- **check-character.ts** - Verifica personagens (v1)
- **check-character-2.ts** - Verifica personagens (v2)
- **check-enemies.ts** - Verifica inimigos
- **check-potion-recipe.ts** - Verifica receitas de poção
- **check-recipe-format.ts** - Verifica formato das receitas
- **check-all-recipe-items.ts** - Verifica todos items em receitas
- **check-missing-potion-items.ts** - Verifica items de poção faltantes
- **check-thread-item.ts** - Verifica item thread

### Uso
```bash
npm run check:items          # Verifica items
npm run check:recipes        # Verifica receitas
npm run check:characters     # Verifica personagens
```

## 🔧 Fixes - Scripts de Correção

Scripts de correção one-off. **Todos já foram arquivados.**

### Arquivados (NÃO EXECUTAR)
- **fix-character-hp.ts** - Corrigiu HP de personagens
- **fix-characters-hp-and-stats.ts** - Corrigiu HP e stats completos
- **fix-crafting-items.ts** - Corrigiu items de crafting
- **fix-gathering-items.ts** - Corrigiu items de gathering
- **fix-item-slots.ts** - Corrigiu slots de items
- **fix-recipe-ingredients.ts** - Corrigiu ingredientes de receitas
- **clean-material-slots.ts** - Limpou slots de materiais

⚠️ **IMPORTANTE**: Esses scripts foram criados para corrigir problemas específicos em momentos específicos. **Não execute** novamente a menos que saiba exatamente o que está fazendo.

Ver histórico completo em `fixes/archived/README.md`.

## 📝 Como Criar Novos Scripts

### Script de Desenvolvimento
```typescript
// prisma/scripts/dev/my-script.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seu código aqui
  console.log('✅ Script executado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Adicionar ao package.json
```json
{
  "scripts": {
    "dev:my-script": "ts-node prisma/scripts/dev/my-script.ts"
  }
}
```

### Executar
```bash
npm run dev:my-script
```

## 🎯 Quando Usar Cada Tipo

### Dev Scripts
- Adicionar dados de teste
- Resetar estado de desenvolvimento
- Ferramentas de debug

### Check Scripts
- Validar dados antes de deploy
- Verificar integridade após migrations
- Debug de problemas de dados

### Fix Scripts
- Corrigir dados corrompidos (ONE-OFF)
- Migrar dados para novo formato (ONE-OFF)
- Sempre arquivar após usar

---

**Dica:** Sempre teste scripts em desenvolvimento antes de usar em produção!
