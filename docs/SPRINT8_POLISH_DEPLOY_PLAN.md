# 🚀 Sprint 8 – Polish & Deploy

**Meta:** Melhorar UX, preparar deploy estável e observável.
**Duração estimada:** 3–4 horas  
**Status:** Planejado

---

## 🎯 Objetivos
- **Polish UX:** feedbacks visuais, carregamento suave, mensagens claras de erro.
- **Estabilidade:** logs, métricas, health checks, tratamento de erros consistente.
- **Deploy:** pipeline CI/CD, hosting frontend e backend, DB gerenciado, domínio e HTTPS.

---

## 📦 Escopo por área

### Frontend
- **Loading/Estados Vazios**
  - Skeletons nas páginas: `Dungeons`, `Inventory`, `Marketplace`.
  - Empty states com ação recomendada.
- **Feedback & Acessibilidade**
  - Toasts de sucesso/erro padronizados.
  - Botões com estados `loading/disabled`.
  - Tooltips de atributos (ex.: `item.attributes`).
- **Melhorias de UI**
  - Transições básicas em modais/botões.
  - Padronização de cores e espaçamentos.
- **Qualidade**
  - Testes: 3–5 testes de integração com React Testing Library (flows principais).

### Backend
- **CORS/Config**
  - Confirmar `CORS_ORIGIN` via `.env` (dev e prod).
- **Health/Observabilidade**
  - `/api/health` já OK – adicionar `db: up/down` no payload.
  - Logger padronizado por request (requestId).
- **Erros/Segurança**
  - Respostas padronizadas `{ success, error: { code, message } }`.
  - Rate limit básico (login e endpoints públicos).

### DevOps/Deploy
- **Infra**
  - Frontend: Vercel.
  - Backend: Railway/Render.
  - Database: Neon/Supabase Postgres (usar `DATABASE_URL`).
- **CI/CD (GitHub Actions)**
  - Lint + Build + Test.
  - Deploy automático para `main`.
- **Domínio/HTTPS**
  - Domínio custom + certificados gerenciados.
- **Observabilidade**
  - Sentry (frontend+backend) e Google Analytics (frontend).

---

## 🔐 Variáveis de Ambiente

### Backend (`/backend/.env`)
- `DATABASE_URL=...`
- `PORT=3001`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://seu-dominio.com,https://seu-front.vercel.app`
- `JWT_SECRET=...`

### Frontend (`/frontend/.env`)
- `VITE_API_BASE_URL=https://api.seu-dominio.com/api`
- `VITE_ASSETS_BASE_URL=https://api.seu-dominio.com/assets`
- `VITE_SENTRY_DSN=...` (opcional)
- `VITE_ANALYTICS_ID=...` (opcional)

---

## ✅ Checklist de Qualidade

- **Frontend**
  - [ ] Skeletons e states vazios.
  - [ ] Toasts padronizados.
  - [ ] Botões com estado loading.
  - [ ] Tooltips de atributos.
  - [ ] Testes de integração básicos.

- **Backend**
  - [ ] `/api/health` inclui `db: up/down`.
  - [ ] Logs por request com `requestId`.
  - [ ] Rate limit em `/api/auth/*`.
  - [ ] Tratamento de erros consistente.

- **Deploy**
  - [ ] Pipelines no GitHub Actions.
  - [ ] Env vars no provedor.
  - [ ] Domínio + HTTPS ativos.
  - [ ] Sentry/Analytics configurados.

---

## 🔄 Pipeline CI (exemplo)
- Job 1: Lint (root, frontend, backend).
- Job 2: Test (frontend vitest, backend unit se houver).
- Job 3: Build (vite build e ts-node compile check).
- Job 4: Deploy (Vercel + Railway).

---

## 🧪 Smoke Tests pós-deploy
- **Auth:** login/registro ok.
- **Characters:** criar e listar.
- **Dungeons:** entrar, lutar floor 1, finalizar, cooldown aplicado.
- **Marketplace:** listar anúncios, filtrar e comprar 1 item.
- **Crafting:** craft simples (1 receita com materiais do seed).

---

## 📈 Critérios de Conclusão
- Acesso público com domínio e HTTPS.
- Fluxos principais OK (smoke acima).
- Logs de erro visíveis no provedor.
- Sem erros não tratados no console do front.

---

## 🗺️ Plano de Execução (3–4h)
1. **Frontend Polish** (60–90m)
2. **Backend observabilidade e erros** (45–60m)
3. **CI/CD + Deploy** (45–60m)
4. **Smoke tests + ajustes** (30m)

---

## 📌 Notas Técnicas Recentes (Sprint 7 fixes)
- `dungeon.service.ts`: correção de include Prisma para `equipment -> inventory -> item`.
- Agregação de atributos lida do JSON `item.attributes`.
- Simplificação do fluxo de batalha (busca separada de `floor` e `dungeon`).
- Logs adicionais para troubleshooting.
