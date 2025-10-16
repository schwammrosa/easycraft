# 📁 Prisma - Estrutura Organizada

Pasta principal do Prisma com schema, migrations e scripts organizados.

## 📂 Estrutura

```
prisma/
├── schema.prisma              # Schema do banco de dados
├── migrations/                # Histórico de migrations
├── seeds/                     # Scripts de seed (popular DB)
├── scripts/                   # Scripts utilitários
│   ├── dev/                  # Ferramentas de desenvolvimento
│   ├── checks/               # Scripts de verificação
│   └── fixes/                # Scripts de correção
│       └── archived/         # Fixes já aplicados
└── tests/                     # Testes de funcionalidades DB
```

## 🌱 Seeds

Scripts para popular o banco de dados com dados iniciais.

**Comando principal:**
```bash
npm run prisma:seed
# ou
npm run seed:all
```

**Seeds específicos:**
```bash
npm run seed:items       # Items craftáveis
npm run seed:enemies     # Inimigos
npm run seed:quests      # Missões
npm run seed:crafting    # Receitas de crafting
npm run seed:gathering   # Nodos de coleta
npm run seed:dungeons    # Dungeons
```

## 🛠️ Scripts de Desenvolvimento

Ferramentas úteis durante o desenvolvimento.

```bash
npm run dev:give-materials     # Dar materiais ao personagem
npm run dev:test-resources     # Adicionar recursos de teste
```

## 🔍 Scripts de Verificação

Verificar integridade dos dados.

```bash
npm run check:items       # Verificar items
npm run check:recipes     # Verificar receitas
npm run check:characters  # Verificar personagens
```

## 🧪 Testes

Testar funcionalidades específicas do banco.

```bash
npm run test:db       # Testar crafting de poções
npm run test:stats    # Testar cálculo de stats
```

## 💾 Prisma Comandos

Comandos principais do Prisma:

```bash
npm run prisma:generate         # Gerar Prisma Client
npm run prisma:migrate          # Criar nova migration
npm run prisma:migrate:deploy   # Aplicar migrations (produção)
npm run prisma:migrate:reset    # Resetar banco (CUIDADO!)
npm run prisma:studio           # Abrir Prisma Studio
```

## 📋 Workflow Recomendado

### 1️⃣ Setup Inicial
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed:all
```

### 2️⃣ Desenvolvimento
```bash
# Adicionar recursos de teste
npm run dev:test-resources

# Verificar se tudo está OK
npm run check:items
npm run check:recipes

# Abrir Prisma Studio para visualizar
npm run prisma:studio
```

### 3️⃣ Reset Completo
```bash
npm run prisma:migrate:reset   # Apaga tudo
npm run seed:all                # Re-popula
```

## 🔧 Fixes Arquivados

Scripts de correção one-off que já foram executados ficam em `scripts/fixes/archived/`.

**Não execute** esses scripts novamente a menos que saiba o que está fazendo - eles foram criados para corrigir problemas específicos em momentos específicos.

Histórico de fixes aplicados está documentado em `scripts/fixes/archived/README.md`.

## 📖 Mais Informações

- **Seeds**: Ver `seeds/README.md`
- **Scripts**: Ver `scripts/README.md`
- **Tests**: Ver `tests/README.md`
- **Fixes**: Ver `scripts/fixes/archived/README.md`

---

**Última atualização:** 16/10/2025  
**Versão:** 2.0 (Estrutura Refatorada)
