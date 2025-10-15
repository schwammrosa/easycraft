# 🚂 DEPLOY BACKEND NO RAILWAY - GUIA COMPLETO

## 🎯 Passo a Passo (10 minutos)

### 1. Criar Conta no Railway
1. Acesse: **https://railway.app**
2. Clique em **"Start a New Project"**
3. Login com GitHub

---

### 2. Criar Novo Projeto
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Conecte sua conta GitHub (se ainda não conectou)
4. Selecione o repositório **"easycraft"**

---

### 3. Configurar Banco de Dados PostgreSQL
1. No mesmo projeto, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway vai criar automaticamente
4. Clique no banco criado
5. Vá em **"Variables"**
6. Copie a variável **`DATABASE_URL`** (vamos usar depois)

---

### 4. Configurar o Backend

#### 4.1 Clique no serviço do backend
- Se não criou ainda, clique em **"+ New"** → **"GitHub Repo"**

#### 4.2 Configure o Root Directory
1. Settings → **Root Directory**: `backend`
2. Settings → **Build Command**: `npm install && npm run build`
3. Settings → **Start Command**: `node dist/server.js`

#### 4.3 Adicionar Variáveis de Ambiente
Vá em **"Variables"** e adicione:

```bash
# Database (copie do PostgreSQL que você criou)
DATABASE_URL=<copie_do_postgres_do_railway>

# JWT Secrets (CRIE NOVOS - importante!)
JWT_ACCESS_SECRET=seu_super_secret_production_min_32_caracteres_aqui
JWT_REFRESH_SECRET=seu_super_refresh_secret_production_min_32_chars

# Security
BCRYPT_ROUNDS=12
NODE_ENV=production

# CORS (URL do seu frontend Vercel)
CORS_ORIGIN=https://easycraft.vercel.app

# Server
PORT=3001
```

#### 4.4 Deploy!
- Railway vai fazer deploy automaticamente
- Aguarde 3-5 minutos
- Você vai receber uma URL tipo: `https://backend-production-xxxx.up.railway.app`

---

### 5. Rodar Migrations no Railway

**IMPORTANTE**: Depois do deploy, precisamos rodar as migrations!

#### Opção 1: Via Railway CLI (Recomendado)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Selecionar projeto
railway link

# Rodar migrations
railway run npx prisma migrate deploy

# Rodar seed (dados iniciais)
railway run npx prisma db seed
```

#### Opção 2: Adicionar ao package.json
Adicione um script de build que rode as migrations:
```json
"scripts": {
  "build": "tsc && npx prisma generate && npx prisma migrate deploy"
}
```

---

### 6. Conectar Frontend ao Backend

1. Acesse: **https://vercel.com/dashboard**
2. Clique no projeto **easycraft**
3. Vá em **Settings** → **Environment Variables**
4. Edite `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://backend-production-xxxx.up.railway.app/api
   ```
   (substitua pela URL que o Railway te deu)
5. Clique em **Save**
6. Vá em **Deployments** → **Redeploy**

---

### 7. Testar!

1. Acesse seu jogo: **https://easycraft.vercel.app**
2. Registre uma nova conta
3. Crie um personagem
4. **JOGUE!** 🎮

---

## ✅ CHECKLIST

- [ ] Conta Railway criada
- [ ] PostgreSQL adicionado
- [ ] Backend deployado
- [ ] Migrations rodadas
- [ ] Seed executado
- [ ] Frontend conectado ao backend
- [ ] Testado e funcionando!

---

## 🚨 PROBLEMAS COMUNS

### "Cannot connect to database"
- Verifique se a `DATABASE_URL` está correta
- Certifique-se que o PostgreSQL está rodando

### "CORS error"
- Verifique se `CORS_ORIGIN` tem a URL exata do Vercel
- Não esqueça o `https://`

### "Migrations not run"
- Execute `railway run npx prisma migrate deploy`
- Verifique logs no Railway

---

## 🎉 PRÓXIMO PASSO

Depois que tudo estiver funcionando:
1. Convide amigos para testar
2. Monitore logs no Railway
3. Ajuste conforme feedback

---

**BOA SORTE! SEU JOGO VAI ESTAR 100% ONLINE! 🚀**
