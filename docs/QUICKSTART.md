# 🚀 EasyCraft - Guia de Início Rápido

## Para Começar o Desenvolvimento AGORA

Este guia assume que você tem **30 minutos** e quer começar a desenvolver o EasyCraft.

---

## ✅ Checklist de 30 Minutos

### Minutos 0-5: Setup Inicial

```bash
# 1. Clone o projeto (quando existir)
git clone https://github.com/seu-usuario/easycraft.git
cd easycraft

# 2. Subir banco de dados
docker-compose up -d postgres redis
```

**Status**: ✅ Infraestrutura rodando

---

### Minutos 5-10: Backend Setup

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Configurar environment
cp .env.example .env
# Editar .env se necessário (defaults funcionam)

# 3. Rodar migrations
npx prisma migrate dev

# 4. Seed inicial
npx prisma db seed

# 5. Iniciar servidor
npm run dev
```

**Teste**: Abra http://localhost:3001/api/health
**Esperado**: `{"status": "ok"}`

**Status**: ✅ Backend rodando na porta 3001

---

### Minutos 10-15: Frontend Setup

```bash
# Em novo terminal
cd frontend

# 1. Instalar dependências
npm install

# 2. Configurar environment
cp .env.example .env

# 3. Iniciar dev server
npm run dev
```

**Teste**: Abra http://localhost:5173
**Esperado**: Landing page

**Status**: ✅ Frontend rodando na porta 5173

---

### Minutos 15-20: Verificar Funcionamento

1. **Registrar conta**: http://localhost:5173/register
   - Email: test@test.com
   - Senha: Test123!
   
2. **Criar personagem**:
   - Nome: TestHero
   - Escolher aparência
   
3. **Fazer uma batalha**:
   - Dashboard → Batalha → Floresta → Iniciar

**Status**: ✅ Sistema funcionando end-to-end

---

### Minutos 20-25: Explorar Código

```bash
# Estrutura importante
backend/
├── src/modules/auth/         # Autenticação
├── src/modules/character/    # Personagens
├── src/modules/battle/       # Combates
└── src/modules/inventory/    # Inventário

frontend/
├── src/pages/               # Telas principais
├── src/components/          # Componentes reutilizáveis
└── src/services/api.ts      # Cliente HTTP
```

**Status**: ✅ Código explorado

---

### Minutos 25-30: Primeira Contribuição

**Escolha uma task fácil**:

```bash
# Criar branch
git checkout -b feature/minha-feature

# Fazer alteração (exemplo: mudar cor de botão)
# frontend/src/components/Button.tsx

# Commit
git add .
git commit -m "feat: mudança simples para testar workflow"

# Push
git push origin feature/minha-feature
```

**Status**: ✅ Pronto para desenvolver!

---

## 🎯 O Que Fazer Agora?

### Opção 1: Pegar uma Task do Roadmap
Veja [docs/07_roadmap.md](07_roadmap.md) e escolha algo da Sprint atual.

**Tasks fáceis para começar**:
- [ ] Adicionar loading spinner em botão
- [ ] Melhorar mensagem de erro de login
- [ ] Adicionar mais variantes de aparência
- [ ] Criar tela de "Como Jogar"

### Opção 2: Explorar Documentação
- **Game Designer**: [Game Design Document](09_game_design.md)
- **Frontend Dev**: [UI Design](06_ui_design.md) + [Fluxos](08_fluxos_usuario.md)
- **Backend Dev**: [API Spec](04_api_specification.md) + [Database](05_database_schema.sql)
- **Full Stack**: [Mecânicas](02_mecanicas_detalhadas.md)

### Opção 3: Implementar Feature Completa

**Exemplo: Sistema de Chat (Fase 3)**

1. **Backend**:
   - Criar tabela `messages`
   - WebSocket server (Socket.io)
   - Endpoint POST `/api/chat/send`
   - Broadcast para usuários online

2. **Frontend**:
   - Componente `<ChatPanel>`
   - Socket.io client
   - Input com validação
   - Lista de mensagens com scroll

**Tempo estimado**: 4-6 horas

---

## 🛠️ Comandos Úteis

### Backend
```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot reload
npm run build            # Build para produção
npm run test             # Roda testes
npm run test:watch       # Testes em watch mode

# Prisma
npx prisma studio        # UI para banco de dados
npx prisma migrate dev   # Criar migration
npx prisma generate      # Gerar Prisma Client
npx prisma db seed       # Popular banco com dados
```

### Frontend
```bash
# Desenvolvimento
npm run dev              # Inicia Vite dev server
npm run build            # Build para produção
npm run preview          # Preview do build
npm run test             # Roda testes
npm run lint             # ESLint
```

### Docker
```bash
docker-compose up -d              # Subir tudo
docker-compose down               # Derrubar tudo
docker-compose logs -f backend    # Ver logs do backend
docker-compose restart backend    # Reiniciar serviço
docker-compose ps                 # Ver status
```

---

## 🐛 Troubleshooting Rápido

### Backend não conecta no banco
```bash
# Verificar se Postgres está rodando
docker-compose ps

# Ver logs
docker-compose logs postgres

# Recriar banco
docker-compose down -v
docker-compose up -d postgres
npx prisma migrate dev
```

### Frontend não conecta na API
1. Verificar `frontend/.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3001/api
   ```
2. Verificar backend rodando: `curl http://localhost:3001/api/health`
3. Verificar CORS no backend (`backend/src/config/cors.ts`)

### Porta já em uso
```bash
# Encontrar processo
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Erro em migration
```bash
# Reset completo do banco (CUIDADO: perde dados)
npx prisma migrate reset

# Ou criar nova migration
npx prisma migrate dev --name fix_issue
```

---

## 📚 Próximos Passos

### Dia 1: Familiarização
- ✅ Setup completo
- [ ] Explorar todas as telas do jogo
- [ ] Ler documentação core (01, 02, 03)
- [ ] Entender fluxo principal (08)

### Semana 1: Primeiras Contribuições
- [ ] Corrigir 1-2 bugs fáceis
- [ ] Adicionar 1 feature pequena
- [ ] Melhorar testes (aumentar coverage)
- [ ] Documentar algo que estava unclear

### Mês 1: Contribuidor Regular
- [ ] Implementar feature média (3-5 dias)
- [ ] Fazer code review de PRs
- [ ] Propor melhorias de arquitetura
- [ ] Ajudar novos contribuidores

---

## 🎓 Recursos de Aprendizado

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### React + Vite
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS](https://tailwindcss.com/docs)

### Node.js + Express
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Docs](https://www.prisma.io/docs/)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Red Blob Games](https://www.redblobgames.com/)

---

## 💬 Comunidade

### Discord
Canal `#dev-backend`, `#dev-frontend`, `#game-design`

### Daily Standup (se aplicável)
- Quando: 10h BRT
- Onde: Discord voice
- Formato: O que fiz / O que farei / Blockers

### Code Review
- Todo PR precisa de 1 aprovação
- Review em até 24h
- Seja construtivo e educado

---

## ✅ Checklist Final

Antes de começar a desenvolver, confirme:

- [ ] Postgres e Redis rodando
- [ ] Backend respondendo em :3001
- [ ] Frontend abrindo em :5173
- [ ] Consegui criar conta e personagem
- [ ] Entendo a estrutura básica do código
- [ ] Sei onde está a documentação relevante
- [ ] Tenho acesso ao repositório (ou fork)
- [ ] Discord/comunicação configurado

---

## 🎉 Pronto!

Você está pronto para contribuir com o EasyCraft!

**Primeira task sugerida**: Escolha algo do [Roadmap Sprint 1](07_roadmap.md#sprint-1-autenticação-e-personagens-semana-1)

**Dúvidas?** 
- Abra uma issue
- Pergunte no Discord
- Veja a documentação completa em `/docs`

**Boa sorte e divirta-se! 🚀**

---

[📚 Ver Documentação Completa](00_indice.md) | [🗺️ Ver Roadmap](07_roadmap.md) | [🏠 Voltar ao README](../README.md)
