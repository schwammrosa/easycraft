# 🎮 EasyCraft - MMORPG Web Minimalista

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-playable-brightgreen)
![Progress](https://img.shields.io/badge/progress-90%25-success)

**Um MMORPG baseado em navegador focado em progressão e economia, sem complexidade gráfica**

[Visão Geral](#-visão-geral) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentação](#-documentação)

</div>

---

## 📋 Visão Geral

EasyCraft é um MMORPG web minimalista que foca em mecânicas de progressão, sistema de craft, economia entre jogadores e combates automáticos. A interface é baseada em texto e sprites simples, tornando o jogo acessível em qualquer dispositivo.

### 🎯 Principais Características

- ⚔️ **Combate Automático**: Estratégia na preparação, não em reflexos
- 🎨 **Personalização por Camadas**: Customize seu avatar com diferentes partes
- 💰 **Economia Dinâmica**: Mercado entre jogadores + NPCs reguladores
- 🛠️ **Sistema de Craft**: Transforme materiais em itens valiosos
- 📈 **Progressão Significativa**: Cada nível e item fazem diferença
- 🌐 **Cross-Platform**: Jogue em qualquer navegador moderno

---

## ✨ Features

### MVP (Fase 1) - ✅ COMPLETO!
- [x] Sistema de autenticação (JWT)
- [x] Criação de personagens (3 classes)
- [x] Sistema de inventário (40 itens)
- [x] Sistema de equipamentos (6 slots)
- [x] Combates turn-based automáticos (10 inimigos)
- [x] Sistema de XP e level up
- [x] Sistema de Quests (19 missões)
- [x] Sistema de descanso e gestão de HP
- [ ] Sistema de craft básico
- [ ] Marketplace entre jogadores

### Roadmap
- [ ] NPCs compradores (regulação econômica)
- [ ] Sistema de chat em tempo real
- [ ] Rankings e leaderboards
- [ ] Sistema de guildas
- [ ] Eventos temporários
- [ ] Monetização ética (cosméticos)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Auth**: JWT (jsonwebtoken)

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 3
- **State**: Zustand + React Query
- **Routing**: React Router v6

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deploy**: VPS (Nginx reverse proxy)
- **Monitoring**: Pino (logs), Sentry (errors)

---

## 🚀 Quick Start

### Pré-requisitos

```bash
node >= 18.0.0
npm >= 9.0.0
docker >= 20.10.0
docker-compose >= 2.0.0
```

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/easycraft.git
cd easycraft
```

2. **Setup com Docker (Recomendado)**
```bash
docker-compose up -d
```

3. **Setup Manual**

**Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
npx prisma migrate dev
npx prisma db seed
npm run dev
```

**Frontend**:
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env com URL da API
npm run dev
```

4. **Acessar aplicação**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

---

## 📁 Estrutura do Projeto

```
easycraft/
├── backend/                # API Node.js + Express
│   ├── prisma/            # Schema e migrations
│   ├── src/
│   │   ├── modules/       # Features (auth, character, battle, etc)
│   │   ├── middleware/    # Auth, validation, errors
│   │   ├── config/        # Database, Redis, env
│   │   └── utils/         # Helpers
│   └── package.json
├── frontend/              # React + Vite
│   ├── public/
│   │   └── assets/        # Sprites, ícones, imagens
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Rotas principais
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand stores
│   │   └── services/      # API client
│   └── package.json
├── docs/                  # Documentação completa
│   ├── 01_visao_geral.md
│   ├── 02_mecanicas_detalhadas.md
│   ├── 03_requisitos_tecnicos.md
│   ├── 04_api_specification.md
│   ├── 05_database_schema.sql
│   ├── 06_ui_design.md
│   ├── 07_roadmap.md
│   ├── 08_fluxos_usuario.md
│   └── 09_game_design.md
├── docker-compose.yml
└── README.md
```

---

## 📚 Documentação

### Para Desenvolvedores
- [Status do Projeto](docs/PROJECT_STATUS.md) ⭐ **NOVO**
- [Sprint 1 - Auth & Personagens](docs/SPRINT1_COMPLETE.md)
- [Sprint 2 - Inventário](docs/SPRINT2_COMPLETE.md)
- [Sprint 3 - Batalhas](docs/SPRINT3_COMPLETE.md)
- [Sprint 4 - Quests](docs/SPRINT4_COMPLETE.md) ⭐ **NOVO**
- [Database Schema](docs/05_database_schema.sql)

### Para Designers
- [UI/UX Design](docs/06_ui_design.md)
- [Fluxos de Usuário](docs/08_fluxos_usuario.md)

### Para Game Designers
- [Game Design Document](docs/09_game_design.md)

### Gestão de Projeto
- [Roadmap Completo](docs/07_roadmap.md)

---

## 🧪 Testing

```bash
# Backend
cd backend
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:coverage     # Coverage report

# Frontend
cd frontend
npm run test              # Component tests
npm run test:e2e          # Playwright E2E
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [guia de contribuição](CONTRIBUTING.md) antes de submeter PRs.

### Workflow
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Time

- **Lead Developer**: [Seu Nome]
- **Game Designer**: [Nome]
- **UI/UX Designer**: [Nome]

---

## 📞 Contato

- **Discord**: [Link do servidor]
- **Email**: contato@easycraft.com
- **Website**: https://easycraft.com

---

## 🙏 Agradecimentos

- Inspiração: RuneScape, Tibia, Adventure Quest
- Assets: [Fontes dos assets]
- Comunidade: Todos os alpha testers

---

<div align="center">

**[⬆ Voltar ao topo](#-easycraft---mmorpg-web-minimalista)**

Made with ❤️ by EasyCraft Team

</div>
