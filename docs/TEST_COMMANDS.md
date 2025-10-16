# 🧪 TEST COMMANDS - EASYCRAFT

Comandos para facilitar testes durante desenvolvimento.

---

## 📦 Adicionar Recursos de Teste para Crafting

Adiciona materiais ao inventário do primeiro personagem para testar o sistema de crafting.

### Comando:
```bash
npx ts-node prisma/seed-test-resources.ts
```

### O que adiciona:
- **50x** Iron Ore (Minério de Ferro)
- **50x** Wood (Madeira)
- **50x** Leather (Couro)
- **30x** Coal (Carvão)
- **40x** Herb (Erva)
- **30x** Cloth (Tecido)
- **20x** Crystal (Cristal)
- **25x** Magic Essence (Essência Mágica)
- **15x** Mythril Ore (Minério de Mithril)
- **10x** Dragon Scale (Escama de Dragão)
- **5000** Gold

---

## 🗄️ Outros Comandos Úteis

### Resetar Seeds
```bash
# Re-seed items
npx ts-node prisma/seed-items.ts

# Re-seed enemies
npx ts-node prisma/seed-enemies.ts

# Re-seed quests
npx ts-node prisma/seed-quests.ts

# Re-seed crafting recipes
npx ts-node prisma/seed-crafting.ts

# Re-seed crafting items (resultados de receitas)
npx ts-node prisma/seed-crafting-items.ts

# Add missing materials (coal, herb, crystal, etc.)
npx ts-node prisma/seed-missing-materials.ts
```

### Database Management
```bash
# Reset database (cuidado!)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Check Character Inventory
```bash
# Abrir Prisma Studio e navegar para:
# - Characters (ver personagens)
# - Inventory (ver inventário)
```

---

## 🎮 Workflow de Teste Recomendado

1. **Criar personagem** no jogo (`/characters`)
2. **Adicionar recursos** de teste:
   ```bash
   npx ts-node prisma/seed-test-resources.ts
   ```
3. **Ir para Crafting** (`/crafting`)
4. **Testar receitas** disponíveis
5. **Verificar inventário** (`/inventory`)

---

## 📝 Notas

- O script adiciona recursos ao **primeiro personagem** encontrado no banco
- Se já existir o item, a quantidade é **somada**
- O gold é sempre **adicionado** (não substitui)
- Use `npx prisma studio` para verificar os dados visualmente

---

## 🔄 Reset Rápido para Testes

Se quiser começar do zero:

```bash
# 1. Reset banco (apaga tudo)
npx prisma migrate reset

# 2. Re-seed todos os dados
npx ts-node prisma/seed-items.ts
npx ts-node prisma/seed-enemies.ts
npx ts-node prisma/seed-quests.ts
npx ts-node prisma/seed-crafting.ts
npx ts-node prisma/seed-crafting-items.ts

# 3. Criar personagem no jogo

# 4. Adicionar recursos de teste
npx ts-node prisma/seed-test-resources.ts
```

---

**Happy Testing! 🚀**
