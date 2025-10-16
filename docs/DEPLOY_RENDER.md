# 🚀 DEPLOY BACKEND NO RENDER - 100% GRÁTIS

## ✅ Por que Render?
- 🆓 **Tier gratuito** (750h/mês)
- 🐘 **PostgreSQL grátis** incluído
- 🔄 **Auto-deploy** do GitHub
- 🌐 **HTTPS** automático
- 📊 **Logs** integrados

## ⚠️ Limitações do Tier Gratuito
- ⏸️ App "dorme" após 15min inatividade
- ⏰ Primeiro acesso leva ~30s (cold start)
- 💾 512MB RAM
- **MAS É PERFEITO PARA TESTES E MVP!**

---

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ Criar Conta no Render
1. Acesse: https://render.com
2. Clique em **"Get Started for Free"**
3. **Sign up** com GitHub
4. Autorize o Render a acessar seus repositórios

---

### 2️⃣ Criar PostgreSQL Database (PRIMEIRO!)

1. No Dashboard, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   ```
   Name: easycraft-db
   Database: easycraft
   User: easycraft_user
   Region: Oregon (US West) ou Frankfurt (EU)
   PostgreSQL Version: 16
   Plan: Free
   ```
3. Clique em **"Create Database"**
4. ⏰ Aguarde ~2 minutos até ficar **"Available"**
5. **COPIE** a **Internal Database URL** (vamos usar depois)
   - Formato: `postgresql://user:password@host:5432/dbname`

---

### 3️⃣ Criar Web Service (Backend)

1. Clique em **"New +"** → **"Web Service"**
2. Conecte ao seu repositório GitHub → **easycraft**
3. Configure:

```
Name: easycraft-backend
Region: Oregon (mesma do DB!)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run start
```

---

### 4️⃣ Configurar Environment Variables

Na seção **Environment**, adicione:

```bash
NODE_ENV=production
PORT=3001

# Database URL (COLE A URL DO PASSO 2!)
DATABASE_URL=postgresql://easycraft_user:senha@dpg-xxxxx.oregon-postgres.render.com/easycraft

# JWT Secrets (GERE NOVOS!)
JWT_ACCESS_SECRET=SUA_CHAVE_SECRETA_MINIMO_32_CARACTERES_AQUI
JWT_REFRESH_SECRET=OUTRA_CHAVE_SECRETA_DIFERENTE_32_CHARS

# CORS (URL DO SEU FRONTEND VERCEL)
CORS_ORIGIN=https://easycraft.vercel.app

# Redis (OPCIONAL - pode deixar vazio por enquanto)
REDIS_URL=
```

**🔑 IMPORTANTE - Gerar Secrets Seguros:**
```javascript
// Cole isso no console do navegador para gerar secrets:
console.log(crypto.randomUUID() + crypto.randomUUID())
```

---

### 5️⃣ Configurar Auto-Deploy

Em **Settings**:
- ✅ Ative **"Auto-Deploy"** (Yes)
- Isso vai redesenhar automaticamente quando você der push!

---

### 6️⃣ Deploy!

1. Clique em **"Create Web Service"**
2. 🕐 Aguarde 5-10 minutos (primeira vez demora mais)
3. Acompanhe os logs em tempo real
4. ✅ Quando ver **"Your service is live"**, está PRONTO!

---

## 🔗 Copiar URL do Backend

Após deploy:
1. Copie a URL do seu backend
   - Formato: `https://easycraft-backend.onrender.com`
2. **GUARDE ESSA URL** - vamos usar no próximo passo!

---

## 🐘 Executar Migrations no Database

⚠️ **IMPORTANTE** - Seu banco está vazio! Precisa criar as tabelas:

### Opção 1: Via Render Shell (Mais Fácil)

1. No Dashboard do **Web Service** → **"Shell"** (menu superior)
2. Execute os comandos:

```bash
cd /opt/render/project/src

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular com dados iniciais (seed)
npx prisma db seed
```

### Opção 2: Via Terminal Local

```bash
# Configure a DATABASE_URL local temporariamente
export DATABASE_URL="postgresql://easycraft_user:senha@dpg-xxxxx.oregon-postgres.render.com/easycraft"

# Execute migrations
cd backend
npx prisma migrate deploy
npx prisma db seed
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

Teste a API:
```
https://easycraft-backend.onrender.com/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-10-15T..."
}
```

---

## 🔗 CONECTAR FRONTEND AO BACKEND

Agora que o backend está online, atualize o frontend:

### 1. Ir ao Vercel Dashboard
- Acesse: https://vercel.com/dashboard
- Clique no projeto **easycraft**

### 2. Atualizar Environment Variable
- **Settings** → **Environment Variables**
- Encontre: `VITE_API_BASE_URL`
- **Edit** e mude para:
  ```
  https://easycraft-backend.onrender.com/api
  ```
- Clique em **Save**

### 3. Redeploy Frontend
- **Deployments** → 3 pontinhos (...) → **Redeploy**
- Aguarde ~1 minuto

---

## 🎮 TESTAR O JOGO COMPLETO!

Agora acesse:
```
https://easycraft.vercel.app
```

Teste:
1. ✅ Registrar conta
2. ✅ Fazer login
3. ✅ Criar personagem
4. ✅ Jogar batalhas
5. ✅ Tudo funcionando!

---

## 📊 MONITORAMENTO

### Ver Logs
- Render Dashboard → Logs (tempo real)

### Métricas
- Dashboard → Metrics (uso de CPU/RAM)

### Restart Manual
- Se travar: Settings → Manual Deploy → Deploy

---

## ⚠️ PROBLEMAS COMUNS

### 1. "Application failed to respond"
- **Causa**: Porta errada
- **Solução**: Certifique-se que `PORT=10000` ou use `process.env.PORT`

### 2. "Database connection failed"
- **Causa**: DATABASE_URL errada
- **Solução**: Copie novamente do Render DB Dashboard

### 3. "CORS error"
- **Causa**: CORS_ORIGIN errado
- **Solução**: Verifique a URL do Vercel

### 4. App muito lento
- **Causa**: Cold start (tier gratuito)
- **Solução**: Normal! Primeiro acesso demora ~30s

---

## 💡 DICAS

### Evitar Cold Starts
Use um serviço de ping:
- https://uptimerobot.com (grátis)
- Faz ping a cada 5 minutos
- Mantém o app "acordado"

### Upgrade (Opcional - $7/mês)
- Remove cold starts
- 512MB → 2GB RAM
- Mais rápido

---

## 🎉 PARABÉNS!

Seu jogo está **100% ONLINE** e **100% GRÁTIS**!

```
✅ Frontend: Vercel (grátis)
✅ Backend: Render (grátis)
✅ Database: PostgreSQL no Render (grátis)
✅ HTTPS: Automático
✅ CI/CD: Auto-deploy do GitHub
```

---

**Total de custo: R$ 0,00/mês** 🎊

**Agora você pode compartilhar o link com amigos!** 🚀
