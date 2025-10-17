# 🏗️ Decisões Arquiteturais - EasyCraft

**Data de Criação**: 17/10/2025  
**Última Atualização**: 17/10/2025  
**Status**: ✅ ATIVO

---

## 📋 Índice

1. [Stack Tecnológico Atual](#-stack-tecnológico-atual)
2. [Decisões de Arquitetura](#-decisões-de-arquitetura)
3. [Dependências Removidas](#-dependências-removidas)
4. [Padrões de Código](#-padrões-de-código)
5. [Estrutura do Projeto](#-estrutura-do-projeto)

---

## 🛠️ Stack Tecnológico Atual

### Frontend (Vercel)
```json
{
  "core": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  },
  "ui": {
    "tailwindcss": "^3.3.6",
    "lucide-react": "^0.303.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "state": {
    "zustand": "^4.4.7"
  },
  "routing": {
    "react-router-dom": "^6.20.1"
  },
  "http": {
    "axios": "^1.6.2"
  }
}
```

**Decisão**: Arquitetura **simples e direta** sem camadas de abstração desnecessárias.

---

### Backend (Render)
```json
{
  "core": {
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "express-async-errors": "^3.1.1"
  },
  "database": {
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0"
  },
  "security": {
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "validation": {
    "zod": "^3.22.4"
  },
  "logging": {
    "pino": "^8.16.2",
    "pino-pretty": "^10.2.3"
  }
}
```

**Decisão**: Backend **stateless** com JWT, logging estruturado com Pino, validação com Zod.

---

### Database (Render PostgreSQL)
- **Engine**: PostgreSQL 16
- **ORM**: Prisma
- **Migrations**: Gerenciadas pelo Prisma
- **Storage**: 1GB (tier gratuito)
- **Backups**: Automáticos (90 dias)

**Decisão**: PostgreSQL por ser **robusto, gratuito e bem suportado** pelo Prisma.

---

## 🎯 Decisões de Arquitetura

### 1. State Management: Zustand vs React Query

**Decisão**: ✅ **Zustand** apenas  
**Alternativa Rejeitada**: ❌ React Query

**Motivo**:
- Projeto **não precisa de cache complexo** de dados
- **Zustand** é suficiente para estado global (auth, personagem)
- Requisições HTTP via **Axios direto** são simples e previsíveis
- **Menos dependências** = menos complexidade

**Quando Reavaliar**:
- Se houver necessidade de cache sofisticado
- Se polling em tempo real aumentar significativamente
- Se precisar de stale-while-revalidate patterns

---

### 2. Caching: Redis vs Sem Cache

**Decisão**: ❌ **Sem Redis** (por enquanto)  
**Alternativa Planejada**: Redis (Fase 3)

**Motivo**:
- **Tier gratuito** não justifica complexidade adicional
- **PostgreSQL** é rápido o suficiente para escala atual
- **Custo x Benefício**: Redis exigiria infraestrutura paga
- **KISS Principle**: Keep It Simple, Stupid

**Quando Implementar**:
- Quando ultrapassar 1000 usuários ativos
- Se response time médio > 500ms
- Para session storage (ao invés de JWT)
- Para leaderboards em tempo real

---

### 3. Rate Limiting: express-rate-limit vs Sem Limite

**Decisão**: ❌ **Sem rate limiting** (por enquanto)  
**Alternativa Planejada**: Implementar em Fase 2

**Motivo**:
- **Tier gratuito Render** já tem proteção DDoS básica
- **Poucos usuários** no MVP não justificam
- **JWT** já previne alguns ataques
- **Validação Zod** protege contra payloads maliciosos

**Quando Implementar**:
- Ao detectar abuso de API
- Antes de abrir para público geral
- Para proteger endpoints críticos (auth, marketplace)

**Implementação Futura**:
```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas, tente novamente mais tarde'
});

app.use('/api/auth/login', authLimiter);
```

---

### 4. Logging: Console.log vs Pino

**Decisão**: ✅ **Pino** (logging estruturado)  
**Alternativa Rejeitada**: ❌ Console.log em produção

**Motivo**:
- **Logs estruturados** são mais fáceis de parsear
- **Performance**: Pino é extremamente rápido
- **Produção ready**: JSON logs para análise
- **Debug**: Pretty print em desenvolvimento

**Padrão**:
```typescript
import { logger } from './config/logger';

// ❌ NÃO FAZER
console.log('User logged in:', userId);
console.error('Error:', error);

// ✅ FAZER
logger.info({ userId }, 'User logged in');
logger.error({ error }, 'Login failed');
```

---

### 5. Loading States: LoadingSkeleton vs LoadingSpinner

**Decisão**: ✅ **LoadingSpinner** apenas  
**Alternativa Rejeitada**: ❌ LoadingSkeleton

**Motivo**:
- **Skeleton screens** nunca foram implementados
- **Spinner** é suficiente e mais simples
- **UX**: Não há necessidade de skeletons elaborados
- **Consistência**: Um padrão de loading apenas

**Componentes de Loading**:
- `LoadingSpinner.tsx` - Usado em todas as páginas
- `AnimatedNumber.tsx` - Animação de números (stats, XP)
- `ProgressBar.tsx` - Para barras de progresso (XP, HP)

---

## ❌ Dependências Removidas

### Frontend

#### @tanstack/react-query (^5.14.2)
**Motivo da Remoção**:
- Nunca foi usado no projeto
- Planejado no roadmap inicial, mas substituído por Zustand
- ~15MB economizados

**Evidência**:
```bash
# Busca em todo o projeto retornou 0 resultados
grep -r "@tanstack/react-query" frontend/src/
# (nenhum resultado)
```

---

### Backend

#### ioredis (^5.3.2)
**Motivo da Remoção**:
- Redis não está configurado no docker-compose
- Nunca foi implementado
- Tier gratuito não suporta Redis externo

**Evidência**:
```bash
grep -r "ioredis" backend/src/
# (nenhum resultado)
```

#### express-rate-limit (^7.1.5)
**Motivo da Remoção**:
- Nunca foi implementado
- Proteção DDoS já vem do Render
- Planejado para Fase 2

**Evidência**:
```bash
grep -r "express-rate-limit" backend/src/
# (nenhum resultado)
```

---

### Componentes

#### LoadingSkeleton.tsx (70 linhas)
**Motivo da Remoção**:
- Nunca foi importado em nenhuma página
- `LoadingSpinner` já cumpre a função
- Código morto sem referências

**Evidência**:
```bash
grep -r "LoadingSkeleton" frontend/src/pages/
# (nenhum resultado)
```

---

## 📐 Padrões de Código

### Frontend

#### State Management
```typescript
// Zustand Store
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

#### HTTP Requests
```typescript
// Direto com Axios - sem React Query
import { api } from './api';

export const characterService = {
  async getCharacters(): Promise<Character[]> {
    const response = await api.get('/characters');
    return response.data.data.characters;
  },
};
```

#### Loading States
```typescript
// Padrão simples com useState
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someAction();
  } finally {
    setLoading(false);
  }
};
```

---

### Backend

#### Error Handling
```typescript
// ❌ NÃO USAR console.error
try {
  // ...
} catch (error) {
  console.error('Error:', error); // ❌
}

// ✅ USAR logger.error
try {
  // ...
} catch (error) {
  logger.error({ error, userId }, 'Failed to create character'); // ✅
}
```

#### Validation
```typescript
// Sempre usar Zod
import { z } from 'zod';

const createCharacterSchema = z.object({
  name: z.string().min(3).max(20),
  classType: z.enum(['WARRIOR', 'MAGE', 'ARCHER']),
});

// No controller
const validatedData = createCharacterSchema.parse(req.body);
```

#### Service Layer
```typescript
// Serviços sempre retornam dados limpos
class CharacterService {
  async createCharacter(userId: number, data: CreateCharacterDTO) {
    // Lógica de negócio
    const character = await prisma.character.create({...});
    
    // Converter BigInt para Number antes de retornar
    return this.sanitizeCharacter(character);
  }
  
  private sanitizeCharacter(char: any) {
    return JSON.parse(
      JSON.stringify(char, (_key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      )
    );
  }
}
```

---

## 📁 Estrutura do Projeto

### Frontend
```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # UI primitivos (Button, Card, Modal)
│   ├── layout/         # Layout (Navbar, PageLayout)
│   └── *               # Componentes específicos
├── pages/              # Páginas (rotas)
├── services/           # API clients (axios)
├── store/              # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utilitários (cn, helpers)
├── hooks/              # Custom hooks
└── App.tsx             # Router principal
```

### Backend
```
backend/src/
├── modules/            # Módulos por feature
│   ├── auth/
│   ├── character/
│   ├── inventory/
│   ├── battle/
│   └── ...
├── middleware/         # Express middlewares
├── config/             # Configurações (logger, etc)
├── utils/              # Utilitários (jwt, helpers)
└── server.ts           # Entry point
```

### Módulo Pattern (Backend)
```
modules/character/
├── character.controller.ts    # HTTP handlers
├── character.service.ts       # Business logic
├── character.routes.ts        # Express routes
├── character.types.ts         # TypeScript types
└── character.validation.ts    # Zod schemas
```

---

## 🔄 Quando Reavaliar Decisões

### Métricas para Mudança de Stack

#### Implementar React Query
- [ ] Mais de 10 endpoints com polling
- [ ] Necessidade de cache sofisticado
- [ ] Performance issues com fetch manual

#### Implementar Redis
- [ ] Mais de 1000 usuários ativos
- [ ] Response time médio > 500ms
- [ ] Necessidade de leaderboards real-time

#### Implementar Rate Limiting
- [ ] Detectar abuso de API
- [ ] Antes de lançamento público
- [ ] Ataques de força bruta

#### Substituir Zustand
- [ ] Estado global muito complexo
- [ ] Necessidade de devtools avançado
- [ ] Mais de 10 stores diferentes

---

## 📝 Changelog de Decisões

### 17/10/2025
- ✅ Removido `@tanstack/react-query` (não usado)
- ✅ Removido `ioredis` (não implementado)
- ✅ Removido `express-rate-limit` (posposto para Fase 2)
- ✅ Removido `LoadingSkeleton.tsx` (código morto)
- ✅ Consolidado padrões de logging (Pino apenas)
- ✅ Documentado decisão de state management (Zustand)

---

## 🎯 Princípios Arquiteturais

1. **KISS**: Keep It Simple, Stupid
2. **YAGNI**: You Aren't Gonna Need It
3. **DRY**: Don't Repeat Yourself
4. **Separation of Concerns**: Módulos bem definidos
5. **Fail Fast**: Validações early, errors explícitos
6. **Data-Driven**: Decisões baseadas em métricas, não suposições

---

**Mantido por**: EasyCraft Team  
**Revisão**: A cada mudança significativa de stack ou arquitetura
