# EasyCraft - Requisitos Técnicos

## 🎯 Stack Tecnológico Recomendado

### Frontend

**Framework**: React 18+ com Vite
- **Justificativa**: Ecosystem maduro, performance, developer experience
- **Alternativas**: Next.js (se precisar SSR), Vue 3

**Styling**: TailwindCSS 3+
- **Justificativa**: Desenvolvimento rápido, consistência, customizável
- **Complementos**: 
  - HeadlessUI ou Radix UI para componentes acessíveis
  - Lucide React para ícones

**State Management**: 
- **Zustand** para estado global (autenticação, personagem selecionado)
- Axios para requisições HTTP (sem cache layer)

**Routing**: React Router v6+

**Build Tool**: Vite (hot reload rápido, otimizado)

---

### Backend

**Runtime**: Node.js 18+ LTS

**Framework**: Express.js 4+ ou NestJS
- **Express**: Simplicidade, flexibilidade, comunidade grande
- **NestJS**: Estrutura opinada, TypeScript nativo, escalável

**Linguagem**: TypeScript (tipagem estática, melhor DX)

**ORM**: Prisma ou TypeORM
- **Prisma**: Schema declarativo, migrações fáceis, type-safety
- **TypeORM**: Mais maduro, suporte a recursos avançados

---

### Banco de Dados

**Principal**: PostgreSQL 15+
- **Justificativa**: 
  - ACID compliance para transações de economia
  - JSONB para dados flexíveis (stats, configurações)
  - Performance excelente
  - Suporte a índices complexos

**Cache/Sessions**: Redis 7+
- Sessões de usuário
- Cache de queries frequentes
- Rate limiting
- Filas (combates, crafts longos)

---

### Infraestrutura e Deploy

**Containerização**: Docker + Docker Compose
- Desenvolvimento local consistente
- Deploy simplificado
- Isolamento de serviços

**Servidor**:
- **Desenvolvimento**: Localhost
- **Staging**: VPS (DigitalOcean, Linode, Hetzner)
- **Produção**: VPS com orquestração ou managed services

**Reverse Proxy**: Nginx
- SSL/TLS termination
- Compressão gzip/brotli
- Servir assets estáticos

**CI/CD**: GitHub Actions (simples e integrado)

---

### Armazenamento de Assets

**Desenvolvimento**: Pasta local `/public/assets`

**Produção**: 
- AWS S3 ou compatível (Backblaze B2, DigitalOcean Spaces)
- CDN na frente (CloudFlare, AWS CloudFront)

---

### Autenticação

**Estratégia**: JWT (JSON Web Tokens)
- Access token: curta duração (15 min)
- Refresh token: longa duração (7 dias), httpOnly cookie

**Hashing**: bcrypt para senhas (cost factor 12)

**Opcional**: OAuth2 (Google, Discord) via Passport.js

---

### Segurança

1. **HTTPS**: Obrigatório em produção (Let's Encrypt)
2. **CORS**: Configurado adequadamente
3. **Rate Limiting**: Express-rate-limit
4. **Helmet**: Headers de segurança
5. **Validação**: Zod ou Joi para validar inputs
6. **SQL Injection**: Prevenir com ORM/Prepared Statements
7. **XSS**: Sanitização de inputs
8. **CSRF**: Tokens em formulários críticos

---

## 📦 Dependências Principais

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "zod": "^3.22.4",
    "express-async-errors": "^3.1.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "lucide-react": "^0.303.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 🏗️ Estrutura de Diretórios

### Backend

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── character/
│   │   ├── battle/
│   │   ├── inventory/
│   │   ├── shop/
│   │   ├── craft/
│   │   └── quest/
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── gameLogic.ts
│   │   └── tokenManager.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Frontend

```
frontend/
├── public/
│   └── assets/
│       ├── heads/
│       ├── arms/
│       ├── legs/
│       ├── feet/
│       └── items/
├── src/
│   ├── components/
│   │   ├── ui/          # Componentes base
│   │   ├── auth/
│   │   ├── character/
│   │   ├── battle/
│   │   ├── inventory/
│   │   ├── shop/
│   │   └── layout/
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── CharacterCreate.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Battle.tsx
│   │   ├── Inventory.tsx
│   │   ├── Shop.tsx
│   │   └── Craft.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCharacter.ts
│   │   └── useApi.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── characterStore.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── Dockerfile
```

---

## ⚙️ Variáveis de Ambiente

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3001
API_PREFIX=/api

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/easycraft"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_ACCESS_SECRET=your_super_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173

# Assets
ASSETS_BASE_URL=http://localhost:3001/assets
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ASSETS_BASE_URL=http://localhost:3001/assets
```

---

## 🐳 Docker Configuration

### docker-compose.yml (Desenvolvimento)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: easycraft
      POSTGRES_USER: easycraft_user
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://easycraft_user:dev_password_123@postgres:5432/easycraft
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:3001/api
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 Requisitos de Performance

### Latência
- **API Response Time**: < 200ms (p95)
- **Page Load**: < 2s (First Contentful Paint)
- **Interactive**: < 3s (Time to Interactive)

### Throughput
- **Concurrent Users (MVP)**: 100-500
- **Requests/segundo**: 100-500 RPS
- **Database Connections**: Pool de 20-50

### Escalabilidade
- Horizontal scaling preparado para fase 2
- Database read replicas para queries pesadas
- Cache Redis para dados frequentes

---

## 🧪 Testing Strategy

### Backend
- **Unit Tests**: Jest + Supertest
- **Integration Tests**: Testcontainers (Postgres/Redis)
- **Coverage**: > 70% em lógica crítica (combate, economia)

### Frontend
- **Unit Tests**: Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright (fluxos principais)

---

## 📈 Monitoramento e Logs

### Logs
- **Development**: Console colorido (pino-pretty)
- **Production**: JSON structured (pino)
- **Levels**: error, warn, info, debug

### Metrics (Futuro)
- Prometheus + Grafana
- Métricas de negócio: sign-ups, battles/day, economy health

### Error Tracking
- Sentry (produção)
- Stack traces completos em desenvolvimento

---

## 🔐 Backup e Recovery

### Database
- **Frequência**: Backup diário completo
- **Retention**: 7 dias rolling
- **Tool**: pg_dump ou managed backup

### Assets
- Versionamento no S3
- Backup semanal

---

## 📱 Compatibilidade

### Browsers (mínimo)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsividade
- Desktop: 1920x1080 (primário)
- Tablet: 768x1024
- Mobile: 375x667 (secundário no MVP)

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Requisitos técnicos definidos
