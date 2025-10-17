# 🎉 DEPLOY COMPLETO - EASYCRAFT ONLINE!

## ✅ Status Atual

```
Frontend:  https://easycraft.vercel.app ✅ ONLINE
Backend:   https://easycraft-backend.onrender.com ✅ ONLINE
Database:  PostgreSQL no Render ✅ ONLINE
Custo:     R$ 0,00/mês (100% GRÁTIS!)
```

---

## 📊 Arquitetura de Produção

```
┌─────────────────────────────────────────────────┐
│              USUÁRIOS (Web)                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         VERCEL (Frontend - React)               │
│  • React + TypeScript + Vite                    │
│  • TailwindCSS + Lucide Icons                   │
│  • Zustand + Axios                              │
│  • Deploy automático do GitHub                  │
│  • HTTPS gratuito                               │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│       RENDER (Backend - Node.js)                │
│  • Express + TypeScript                         │
│  • Prisma ORM                                   │
│  • JWT Authentication                           │
│  • CORS configurado                             │
│  • Auto-deploy do GitHub                        │
└─────────────────┬───────────────────────────────┘
                  │ PostgreSQL
                  ▼
┌─────────────────────────────────────────────────┐
│     RENDER (PostgreSQL Database)                │
│  • PostgreSQL 16                                │
│  • Backups automáticos                          │
│  • 1GB storage (tier gratuito)                  │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Variáveis de Ambiente

### **Frontend (Vercel)**
```env
VITE_API_BASE_URL=https://easycraft-backend.onrender.com/api
```

### **Backend (Render)**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=***
JWT_REFRESH_SECRET=***
CORS_ORIGIN=https://easycraft.vercel.app
```

---

## 🚀 Deploy Automático (CI/CD)

### **Fluxo de Deploy:**

1. **Fazer mudanças localmente**
   ```bash
   git add .
   git commit -m "feat: nova feature"
   git push
   ```

2. **Render detecta mudanças** (backend)
   - Build automático
   - Testes (se configurados)
   - Deploy em produção
   - ~5-10 minutos

3. **Vercel detecta mudanças** (frontend)
   - Build automático
   - Preview deploy
   - Deploy em produção
   - ~2-3 minutos

---

## ⚠️ Limitações do Tier Gratuito

### **Render (Backend):**
- ❌ App "dorme" após 15min sem uso
- ⏰ Cold start: ~30 segundos
- 💾 512MB RAM
- ⏱️ 750h/mês de uptime
- 🔒 Shell não disponível

### **Vercel (Frontend):**
- ✅ Sempre ativo (não dorme!)
- ✅ 100GB bandwidth/mês
- ✅ Unlimited builds
- ✅ Edge Network global

### **PostgreSQL (Render):**
- 💾 1GB storage
- 🔄 Mantido por 90 dias
- 📊 Sem backups manuais no tier gratuito

---

## 🔧 Comandos Úteis

### **Popular Banco de Dados (Seed)**
```bash
# Via PowerShell (local)
Invoke-WebRequest -Uri "https://easycraft-backend.onrender.com/api/admin/seed" -Method POST

# Ou acesse no navegador
https://easycraft-backend.onrender.com/api/admin/seed
```

### **Ver Logs do Backend**
1. Acesse: https://dashboard.render.com
2. Clique em **easycraft-backend**
3. Clique em **Logs**

### **Ver Logs do Frontend**
1. Acesse: https://vercel.com/dashboard
2. Clique em **easycraft**
3. Clique em **Deployments** → **Build Logs**

### **Forçar Redeploy**
```bash
# Backend (Render)
- Dashboard → Manual Deploy → Deploy latest commit

# Frontend (Vercel)
- Dashboard → Deployments → (...) → Redeploy
```

---

## 🧪 Testar Endpoints

### **Health Check**
```bash
curl https://easycraft-backend.onrender.com/api/health
```

### **Registrar Usuário**
```bash
curl -X POST https://easycraft-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123","username":"testuser"}'
```

### **Listar Itens**
```bash
curl https://easycraft-backend.onrender.com/api/items
```

---

## 📈 Monitoramento

### **Métricas do Render**
- CPU Usage
- Memory Usage
- Request/Response times
- Error rates

### **Métricas do Vercel**
- Page Load times
- Build duration
- Bandwidth usage
- Edge locations

---

## 🐛 Troubleshooting

### **Erro 404 no Frontend**
**Causa:** Cache do navegador
**Solução:** Ctrl+Shift+R ou aba anônima

### **Erro 500 no Backend**
**Causa:** Erro no servidor
**Solução:** Ver logs no Render Dashboard

### **CORS Error**
**Causa:** CORS_ORIGIN errado
**Solução:** Verificar variável no Render

### **Database Connection Error**
**Causa:** DATABASE_URL errada
**Solução:** Verificar variável no Render

### **Cold Start (30s delay)**
**Causa:** Backend dormiu (tier gratuito)
**Solução:** Aguardar 30s ou usar UptimeRobot

---

## 💡 Melhorias Futuras

### **Tier Pago ($20-30/mês):**
- ✅ Sem cold starts
- ✅ Mais RAM/CPU
- ✅ Shell access
- ✅ Backups manuais
- ✅ Mais storage

### **Alternativas (Médio Prazo):**
- **Railway**: $5/mês - sem cold starts
- **Fly.io**: $5-10/mês - global edge
- **Digital Ocean**: $20+/mês - mais controle

---

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Render](https://render.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 🎮 Próximos Passos

Ver arquivo: `PROXIMOS_PASSOS.md`

---

**Deploy realizado em:** 16 de Outubro de 2025  
**Status:** ✅ ONLINE E FUNCIONANDO  
**Custo:** R$ 0,00/mês
