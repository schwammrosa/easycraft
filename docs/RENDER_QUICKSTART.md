# ⚡ DEPLOY NO RENDER - SUPER RÁPIDO (5 MINUTOS)

## 🎯 MÉTODO 1: Via Web (MAIS FÁCIL)

### 1️⃣ Criar Database (2 min)
1. Acesse: https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Configure:
   - Name: `easycraft-db`
   - Database: `easycraft`
   - Plan: **Free**
4. **Create Database**
5. **Copie a Internal Database URL** (ícone de copiar)

---

### 2️⃣ Criar Web Service (3 min)
1. **New +** → **Web Service**
2. Conecte ao GitHub → repositório **easycraft**
3. Configure:

```
Name: easycraft-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run start:migrate
Instance Type: Free
```

---

### 3️⃣ Environment Variables

Clique em **"Advanced"** e adicione:

```bash
NODE_ENV = production

DATABASE_URL = <COLE_A_URL_QUE_VOCÊ_COPIOU_NO_PASSO_1>

JWT_ACCESS_SECRET = <GERE_UMA_CHAVE_ALEATORIA_32_CHARS>
JWT_REFRESH_SECRET = <GERE_OUTRA_CHAVE_DIFERENTE_32_CHARS>

CORS_ORIGIN = https://easycraft.vercel.app
```

**💡 Para gerar secrets seguros:**
```javascript
// Cole no console do navegador (F12):
console.log(crypto.randomUUID() + crypto.randomUUID())
// Copie o resultado para JWT_ACCESS_SECRET
// Rode de novo e copie para JWT_REFRESH_SECRET
```

---

### 4️⃣ Deploy!
1. Clique em **"Create Web Service"**
2. ⏰ Aguarde 5-10 minutos
3. Acompanhe os logs
4. ✅ Quando aparecer "Your service is live" → PRONTO!

---

## 🔗 Pós-Deploy

### 1. Copie a URL do Backend
Exemplo: `https://easycraft-backend.onrender.com`

### 2. Executar Seed (Dados Iniciais)

No Render Dashboard → **Shell** (menu superior):
```bash
cd backend
npx prisma db seed
```

### 3. Atualizar Frontend

No **Vercel Dashboard**:
1. Projeto easycraft → **Settings** → **Environment Variables**
2. Edite `VITE_API_BASE_URL`
3. Novo valor: `https://easycraft-backend.onrender.com/api`
4. **Save**
5. **Deployments** → **Redeploy**

---

## ✅ TESTAR

Acesse: `https://easycraft-backend.onrender.com/api/health`

Deve retornar:
```json
{"status":"ok"}
```

Depois teste o jogo:
`https://easycraft.vercel.app`

---

## 🎉 PRONTO!

Jogo 100% online e grátis! 🚀

⚠️ **IMPORTANTE**: No tier gratuito, o app "dorme" após 15min inatividade.  
Primeiro acesso após dormir leva ~30 segundos para "acordar".
