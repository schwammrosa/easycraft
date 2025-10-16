# 🧪 GUIA DE DESENVOLVIMENTO - EASYCRAFT

Comandos rápidos para desenvolvimento e testes.

---

## 🚀 Quick Start

### Setup Inicial
```bash
# 1. Gerar Prisma Client
npm run prisma:generate

# 2. Aplicar migrations
npm run prisma:migrate

# 3. Popular banco de dados
npm run seed:all
```

### Desenvolvimento Diário
```bash
# Iniciar servidor
npm run dev

# Abrir Prisma Studio
npm run prisma:studio
```

---

## 🌱 Seeds - Popular Banco

### Seed Completo (Recomendado)
```bash
npm run seed:all
```

### Seeds Específicos
```bash
npm run seed:items       # Items craftáveis
npm run seed:enemies     # Inimigos
npm run seed:quests      # Missões
npm run seed:crafting    # Receitas de crafting
npm run seed:gathering   # Nodos de coleta
npm run seed:dungeons    # Dungeons
```

---

## 🛠️ Ferramentas de Desenvolvimento

### Adicionar Recursos de Teste
```bash
# Adicionar materiais completos ao personagem
npm run dev:test-resources

# Dar materiais específicos
npm run dev:give-materials
```

**O que `dev:test-resources` adiciona:**
- 50x Iron Ore, Wood, Leather
- 30x Coal, Cloth
- 40x Herb
- 20x Crystal
- 25x Magic Essence
- 15x Mythril Ore
- 10x Dragon Scale
- 5000 Gold

---

## 🔍 Verificações

### Validar Dados
```bash
npm run check:items       # Verificar items
npm run check:recipes     # Verificar receitas
npm run check:characters  # Verificar personagens
```

---

## 🧪 Testes

### Testes de Funcionalidades DB
```bash
npm run test:db       # Testar crafting de poções
npm run test:stats    # Testar cálculo de stats
```

---

## 💾 Prisma Comandos

### Migrations
```bash
npm run prisma:migrate          # Criar nova migration
npm run prisma:migrate:deploy   # Aplicar migrations (produção)
npm run prisma:migrate:reset    # Resetar banco (CUIDADO!)
```

### Outras Ferramentas
```bash
npm run prisma:generate   # Gerar Prisma Client
npm run prisma:studio     # Abrir Prisma Studio (GUI)
```

---

## 🎮 Workflow de Teste Recomendado

### 1️⃣ Setup
```bash
npm run prisma:migrate    # Aplicar migrations
npm run seed:all          # Popular dados
```

### 2️⃣ Criar Personagem
- Abrir `http://localhost:5173`
- Criar conta e personagem

### 3️⃣ Adicionar Recursos de Teste
```bash
npm run dev:test-resources
```

### 4️⃣ Testar Features
- `/crafting` - Testar crafting
- `/gathering` - Testar coleta
- `/battle` - Testar farm mode
- `/dungeons` - Testar dungeons
- `/inventory` - Verificar items

### 5️⃣ Verificar Dados
```bash
npm run prisma:studio    # Ver dados no navegador
```

---

## 🔄 Reset Completo

**CUIDADO: Apaga TODOS os dados!**

```bash
# Reset e re-seed
npm run prisma:migrate:reset

# Ou manual:
npm run prisma:migrate:reset
npm run seed:all
```

---

## 📁 Estrutura Organizada

A pasta `prisma/` foi refatorada:

```
prisma/
├── schema.prisma              # Schema
├── migrations/                # Migrations
├── seeds/                     # Seeds (13 arquivos)
├── scripts/                   # Scripts utilitários
│   ├── dev/                  # Dev tools (4 arquivos)
│   ├── checks/               # Verificações (10 arquivos)
│   └── fixes/archived/       # Fixes antigos (7 arquivos)
└── tests/                     # Testes DB (2 arquivos)
```

**Documentação completa:**
- `prisma/README.md` - Overview geral
- `prisma/seeds/README.md` - Detalhes de seeds
- `prisma/scripts/README.md` - Detalhes de scripts
- `prisma/tests/README.md` - Detalhes de testes

---

## 💡 Dicas Rápidas

### Ver Logs do Servidor
```bash
npm run dev
# Logs aparecem no console
```

### Debugar Query Prisma
Adicione ao `.env`:
```env
DEBUG=prisma:query
```

### Resetar Apenas Seeds
```bash
# Não apaga dados, apenas re-popula
npm run seed:all
```

### Ver Estrutura do Banco
```bash
npm run prisma:studio
# Abre no navegador: http://localhost:5555
```

---

## 🆘 Problemas Comuns

### "Table not found"
```bash
npm run prisma:migrate
```

### "Items não aparecem no jogo"
```bash
npm run seed:items
npm run check:items
```

### "Personagem sem HP"
- Já foi corrigido em `fix-character-hp.ts` (arquivado)
- Se ainda ocorrer, verificar cálculo de stats

### "Receitas não funcionam"
```bash
npm run check:recipes
npm run seed:crafting
```

---

## 📚 Mais Informações

Ver documentação completa em:
- `prisma/README.md`
- Cada subpasta tem seu próprio README.md

---

**Última atualização:** 16/10/2025  
**Versão:** 2.0 (Estrutura Refatorada)

**Happy Coding! 🚀**
