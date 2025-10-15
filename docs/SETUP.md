# 🚀 Setup Inicial - EasyCraft

## ✅ Estrutura Criada!

A estrutura básica do projeto foi criada com sucesso. Agora vamos instalar e testar.

---

## 📦 Próximos Passos

### 1️⃣ Instalar Dependências do Backend

```powershell
cd backend
npm install
```

**Isso vai instalar**:
- Express (framework web)
- Prisma (ORM)
- TypeScript
- JWT (autenticação)
- E todas outras dependências listadas

**Tempo estimado**: 2-3 minutos

---

### 2️⃣ Configurar Environment do Backend

```powershell
# Ainda na pasta backend
cp .env.example .env
```

O arquivo `.env` já tem valores padrão que funcionam para desenvolvimento local.

---

### 3️⃣ Subir Banco de Dados

```powershell
# Voltar para raiz do projeto
cd ..

# Subir Postgres e Redis com Docker
docker-compose up -d
```

**Isso vai**:
- Criar container do PostgreSQL na porta 5432
- Criar container do Redis na porta 6379
- Dados persistidos em volumes Docker

**Verificar se está rodando**:
```powershell
docker-compose ps
```

Deve mostrar 2 containers rodando (postgres e redis).

---

### 4️⃣ Gerar Prisma Client e Rodar Migrations

```powershell
cd backend

# Gerar o Prisma Client
npx prisma generate

# Rodar migrations (criar tabelas)
npx prisma migrate dev --name init
```

**Isso vai**:
- Criar as tabelas no banco de dados
- Gerar o Prisma Client para usar no código

---

### 5️⃣ Iniciar Backend

```powershell
# Ainda na pasta backend
npm run dev
```

**Você deve ver**:
```
🚀 EasyCraft Backend running on port 3001
📍 Environment: development
🔗 Health check: http://localhost:3001/api/health
```

**Testar**: Abra http://localhost:3001/api/health no navegador.

**Esperado**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-15T...",
  "environment": "development"
}
```

✅ **Backend funcionando!**

---

### 6️⃣ Instalar Dependências do Frontend

**Em um NOVO terminal** (deixe o backend rodando):

```powershell
cd frontend
npm install
```

**Tempo estimado**: 2-3 minutos

---

### 7️⃣ Configurar Environment do Frontend

```powershell
# Ainda na pasta frontend
cp .env.example .env
```

Valores padrão já apontam para `http://localhost:3001/api`.

---

### 8️⃣ Iniciar Frontend

```powershell
# Ainda na pasta frontend
npm run dev
```

**Você deve ver**:
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

O navegador deve abrir automaticamente em http://localhost:5173

**Você verá**:
- Tela com "🎮 EasyCraft"
- "MMORPG Web Minimalista"
- Botão contador funcional
- Link para health check do backend

✅ **Frontend funcionando!**

---

## 🎉 Sucesso!

Se você chegou até aqui, seu ambiente está **100% funcional**!

### 🧪 Teste Final

1. Frontend está rodando? http://localhost:5173 ✅
2. Backend está rodando? http://localhost:3001/api/health ✅
3. Banco de dados está up? `docker-compose ps` ✅

---

## 🗂️ Estrutura Criada

```
easycraft/
├── backend/
│   ├── src/
│   │   ├── server.ts          ✅ Servidor Express básico
│   │   └── config/
│   │       └── logger.ts      ✅ Logger com Pino
│   ├── prisma/
│   │   └── schema.prisma      ✅ Schema do banco
│   ├── package.json           ✅ Dependências
│   ├── tsconfig.json          ✅ Config TypeScript
│   └── .env.example           ✅ Template de environment
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx           ✅ Entry point
│   │   ├── App.tsx            ✅ Componente principal
│   │   └── index.css          ✅ Estilos (Tailwind)
│   ├── index.html             ✅ HTML template
│   ├── package.json           ✅ Dependências
│   ├── tsconfig.json          ✅ Config TypeScript
│   ├── vite.config.ts         ✅ Config Vite
│   ├── tailwind.config.js     ✅ Config Tailwind
│   └── .env.example           ✅ Template de environment
│
├── docker-compose.yml         ✅ Postgres + Redis
├── .gitignore                 ✅ Arquivos ignorados
├── README.md                  ✅ Documentação
└── docs/                      ✅ Documentação completa
```

---

## 🛠️ Comandos Úteis

### Backend
```powershell
cd backend
npm run dev              # Inicia servidor com hot reload
npm run build            # Build para produção
npx prisma studio        # UI visual do banco de dados
npx prisma migrate dev   # Criar nova migration
```

### Frontend
```powershell
cd frontend
npm run dev              # Inicia Vite dev server
npm run build            # Build para produção
npm run preview          # Preview do build de produção
```

### Docker
```powershell
docker-compose up -d              # Subir containers
docker-compose down               # Derrubar containers
docker-compose logs -f backend    # Ver logs (se backend estivesse no Docker)
docker-compose ps                 # Ver status dos containers
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
**Solução**: Execute `npm install` na pasta backend

### Erro: "Port 3001 already in use"
**Solução**: 
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :3001

# Matar o processo (substitua <PID>)
taskkill /PID <PID> /F
```

### Erro: "Cannot connect to database"
**Solução**: Verifique se o Docker está rodando
```powershell
docker-compose ps
docker-compose up -d postgres
```

### Erro no Prisma: "Schema not found"
**Solução**: Certifique-se de estar na pasta `backend` ao rodar comandos do Prisma

---

## 🎯 Próximos Passos

Agora que o ambiente está funcionando, você pode:

1. **Explorar o código**:
   - Veja `backend/src/server.ts` - Servidor básico
   - Veja `frontend/src/App.tsx` - Componente React
   - Veja `backend/prisma/schema.prisma` - Schema do banco

2. **Começar Sprint 1**:
   - Abra [docs/07_roadmap.md](docs/07_roadmap.md#sprint-1-autenticação-e-personagens-semana-1)
   - Escolha uma task para implementar
   - Comece pelo sistema de autenticação

3. **Adicionar funcionalidades**:
   - Criar rotas de API
   - Criar componentes React
   - Conectar frontend com backend

---

## 📚 Documentação

- [Quick Start](docs/QUICKSTART.md) - Guia rápido
- [Roadmap](docs/07_roadmap.md) - Planejamento completo
- [API Specification](docs/04_api_specification.md) - Documentação da API
- [UI Design](docs/06_ui_design.md) - Design system

---

## 🎉 Pronto para Desenvolver!

Ambiente 100% configurado e funcional.

**Primeira task sugerida**: Implementar endpoint POST /api/auth/register

Veja o [Roadmap Sprint 1](docs/07_roadmap.md#sprint-1-autenticação-e-personagens-semana-1) para detalhes.

**Boa sorte! 🚀**
