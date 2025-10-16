# 🚀 Guia de Setup - EasyCraft

Guia completo para configurar o projeto localmente ou em produção.

---

## 📋 Pré-requisitos

### Obrigatórios
```bash
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 15.0
```

### Opcionais (Recomendados)
```bash
Docker >= 20.10.0
Docker Compose >= 2.0.0
Git >= 2.30.0
```

---

## 🏠 Setup Local

### Opção 1: Docker (Recomendado)

**Vantagens:**
- Setup automático
- Ambientes isolados
- Sem configuração manual de banco
- Hot reload funcionando

**Passos:**

1. **Clone o repositório**
```bash
git clone https://github.com/schwammrosa/easycraft.git
cd easycraft
```

2. **Suba os containers**
```bash
docker-compose up -d
```

3. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: localhost:5432

4. **Popular banco de dados**
```bash
# Dentro do container backend
docker exec -it easycraft-backend npm run prisma:seed
```

**Comandos úteis:**
```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild
docker-compose up -d --build

# Acessar bash do backend
docker exec -it easycraft-backend bash
```

---

### Opção 2: Setup Manual

**Vantagens:**
- Controle total
- Melhor para debugging
- Sem overhead do Docker

#### Backend

1. **Entre na pasta**
```bash
cd backend
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
```

Edite `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/easycraft"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_REFRESH_SECRET="outro-secret-super-seguro"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL (CORS)
FRONTEND_URL="http://localhost:5173"
```

4. **Execute migrations**
```bash
npx prisma migrate dev
```

5. **Popular banco de dados**
```bash
npm run prisma:seed
```

6. **Inicie o servidor**
```bash
npm run dev
```

Backend rodando em: http://localhost:3001

#### Frontend

1. **Entre na pasta**
```bash
cd frontend
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
```

Edite `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

4. **Inicie o dev server**
```bash
npm run dev
```

Frontend rodando em: http://localhost:5173

---

## 🌐 Deploy em Produção

### Frontend (Vercel)

1. **Conecte ao GitHub**
- Acesse: https://vercel.com
- Importe o repositório
- Selecione pasta `frontend`

2. **Configure variáveis**
```env
VITE_API_URL=https://seu-backend.onrender.com/api
```

3. **Deploy**
- Build command: `npm run build`
- Output directory: `dist`
- Deploy automático via Git push

**URL final:** https://seu-projeto.vercel.app

---

### Backend + Database (Render)

#### Database

1. **Crie PostgreSQL**
- Acesse: https://dashboard.render.com
- New → PostgreSQL
- Nome: `easycraft-db`
- Region: Ohio (free tier)
- Plan: Free

2. **Copie URL de conexão**
```
postgresql://user:pass@host:5432/dbname
```

#### Backend

1. **Crie Web Service**
- New → Web Service
- Conecte ao GitHub
- Selecione repositório
- Root directory: `backend`

2. **Configure:**
```
Name: easycraft-backend
Region: Ohio
Branch: main
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm run start
```

3. **Variáveis de ambiente:**
```env
DATABASE_URL=<URL_DO_POSTGRESQL_RENDER>
JWT_SECRET=<GENERATE_RANDOM_SECRET>
JWT_REFRESH_SECRET=<GENERATE_ANOTHER_SECRET>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://seu-projeto.vercel.app
```

4. **Deploy**
- Create Web Service
- Aguardar build (~5-10min)
- Migrations rodam automaticamente

5. **Popular banco**
```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "https://seu-backend.onrender.com/api/admin/seed" -Method POST

# Linux/Mac
curl -X POST https://seu-backend.onrender.com/api/admin/seed
```

**URL final:** https://seu-backend.onrender.com

---

## 🧪 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Inicia produção
npm run test         # Roda testes
npm run prisma:seed  # Popular banco
npm run create-floors # Criar dungeon floors
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Checar erros
npm run lint:fix     # Corrigir erros
```

---

## 🗄️ Comandos do Banco

### Prisma

```bash
# Gerar client
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Reset banco (DEV ONLY!)
npx prisma migrate reset

# Seed banco
npx prisma db seed
```

---

## 🔍 Troubleshooting

### Erro: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Erro: "Cannot connect to database"
```bash
# Verifique se PostgreSQL está rodando
# Windows (services.msc)
# Linux
sudo systemctl status postgresql

# Teste conexão
psql -h localhost -U postgres
```

### Erro: "Module not found"
```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Prisma Client did not initialize"
```bash
npx prisma generate
```

### Frontend não conecta ao Backend
1. Verifique CORS no backend (`backend/src/index.ts`)
2. Confirme `VITE_API_URL` no frontend `.env`
3. Certifique que backend está rodando

### Migrations falhando no Render
- Render aplica migrations automaticamente
- Se falhar, check logs no dashboard
- Pode precisar fazer rollback manual

---

## 📦 Estrutura de Pastas

```
easycraft/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── character/
│   │   │   ├── battle/
│   │   │   ├── inventory/
│   │   │   └── ...
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── hooks/
│   └── package.json
│
├── docs/
├── docker-compose.yml
└── README.md
```

---

## 🔐 Segurança

### Produção
- ✅ Use secrets fortes (min 32 chars)
- ✅ HTTPS obrigatório
- ✅ Rate limiting ativo
- ✅ Validação de inputs
- ✅ Sanitização de dados
- ✅ CORS configurado

### Desenvolvimento
- ⚠️ Nunca commite `.env`
- ⚠️ Use `.env.example` como template
- ⚠️ Rotate secrets regularmente
- ⚠️ Não exponha endpoints admin em produção

---

## 📞 Suporte

### Problemas Comuns
- [GitHub Issues](https://github.com/schwammrosa/easycraft/issues)
- [Documentação](README.md)
- [API Testing](../backend/API_TESTING.md)

### Community
- Discord: [Link]
- Forum: [Link]

---

**Última Atualização:** 16/10/2025  
**Versão do Guia:** 1.0.0
