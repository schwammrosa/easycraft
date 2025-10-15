# 🚀 Guia de Deploy - EasyCraft

## Pré-requisitos
1. Conta no [Railway](https://railway.app)
2. Conta no [Vercel](https://vercel.com)
3. Conta no [Supabase](https://supabase.com) ou [Neon](https://neon.tech)
4. Token de acesso GitHub

---

## 🔧 Passo 1: Configurar Secrets

### Secrets do GitHub
| Secret | Descrição |
|--------|-----------|
| `RAILWAY_TOKEN` | Token Railway (Settings > Tokens) |
| `VERCEL_TOKEN` | Token Vercel (Settings > Tokens) |
| `VERCEL_ORG_ID` | ID da organização Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel |
| `DATABASE_URL` | URL do banco de dados PostgreSQL |
| `JWT_ACCESS_SECRET` | Secret JWT (min 32 chars) |
| `REDIS_URL` | URL do Redis |

---

## 🚀 Passo 2: Deploy Backend (Railway)

1. Crie um novo projeto no Railway
2. Selecione "Deploy from GitHub"
3. Conecte ao repositório do EasyCraft
4. Configure variáveis de ambiente:
   ```
   NODE_ENV=production
   DATABASE_URL=<SUPABASE_URL>
   JWT_ACCESS_SECRET=<SECRET>
   REDIS_URL=<REDIS_URL>
   CORS_ORIGIN=https://easycraft.vercel.app
   ```
5. O deploy será automático após push

---

## 🌐 Passo 3: Deploy Frontend (Vercel)

1. Crie um novo projeto no Vercel
2. Conecte ao repositório do EasyCraft
3. Configurações:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_BASE_URL=https://<SEU_BACKEND>.railway.app
     ```
4. Deploy automático após push

---

## 📊 Passo 4: Configurar Domínio (Opcional)

1. No Vercel: Settings > Domains
2. Adicione seu domínio customizado
3. Configure DNS conforme instruções

---

## 📱 Passo 5: Testar Produção

1. Acesse frontend: `https://easycraft.vercel.app`
2. Teste fluxos:
   - Registro/login
   - Criação de personagem
   - Batalha
   - Marketplace
   - Dungeons
3. Verifique logs no Railway e Vercel

---

## 🛡️ Passo 6: Segurança

1. Habilite HTTPS
2. Configure WAF
3. Monitore com Sentry
4. Backup diário do banco

---

## 🎉 Parabéns! Seu jogo está no ar!
