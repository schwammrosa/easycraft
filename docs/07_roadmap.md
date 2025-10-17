# EasyCraft - Roadmap de Desenvolvimento

## 📅 Visão Geral do Projeto

**Duração Total Estimada**: 3-4 meses (MVP + Fase 2)  
**Metodologia**: Iterativa e incremental  
**Lançamento MVP**: 4-6 semanas  

---

## 🎯 Fase 0: Preparação (Semana 0)

**Duração**: 3-5 dias  
**Objetivo**: Setup do projeto e infraestrutura básica

### Tasks

#### 0.1 Setup de Repositório
- [ ] Criar repositório Git (monorepo ou multi-repo)
- [ ] Configurar `.gitignore` e `.env.example`
- [ ] Criar estrutura de pastas (backend + frontend)
- [ ] Documentar README inicial

#### 0.2 Setup Backend
- [ ] Inicializar projeto Node.js + TypeScript
- [ ] Instalar dependências core (Express, Prisma, etc)
- [ ] Configurar Prisma ORM
- [ ] Criar `docker-compose.yml` (Postgres + Redis)
- [ ] Testar conexão com banco de dados

#### 0.3 Setup Frontend
- [x] Inicializar projeto React + Vite + TypeScript
- [x] Configurar TailwindCSS
- [x] Instalar dependências (React Router, Zustand, Axios)
- [x] Criar estrutura de pastas
- [x] Testar build e hot reload

**Nota**: React Query foi planejado mas substituído por Zustand + fetch manual para simplicidade

#### 0.4 Assets Iniciais
- [ ] Criar ou baixar 6 variantes de cada slot (head, arms, legs, feet)
- [ ] Preparar ícones de UI básicos (Gold, XP, HP)
- [ ] Criar 20-30 ícones de itens iniciais
- [ ] Organizar em `/public/assets/`

#### 0.5 DevOps Básico
- [ ] Configurar ESLint + Prettier
- [ ] Setup scripts npm (dev, build, test)
- [ ] Testar `docker-compose up` funcional
- [ ] Documentar comandos de desenvolvimento

**Entregável**: Ambiente de desenvolvimento funcional e documentado

---

## 🚀 Fase 1: MVP Core (Semanas 1-4)

**Objetivo**: Entregar gameplay funcional básico

---

### Sprint 1: Autenticação e Personagens (Semana 1)

**Foco**: Usuário consegue criar conta e personagem

#### Backend
- [ ] Implementar schema de banco (`users`, `characters`, `character_stats`)
- [ ] Criar endpoints de autenticação
  - [ ] POST `/api/auth/register`
  - [ ] POST `/api/auth/login`
  - [ ] POST `/api/auth/refresh`
  - [ ] POST `/api/auth/logout`
- [ ] Middleware de autenticação JWT
- [ ] Implementar hash de senha (bcrypt)
- [ ] Criar endpoints de personagens
  - [ ] GET `/api/characters`
  - [ ] POST `/api/characters`
  - [ ] GET `/api/characters/:id`
  - [ ] DELETE `/api/characters/:id`
- [ ] Validações com Zod
- [ ] Testes unitários de autenticação

#### Frontend
- [ ] Criar páginas
  - [ ] Landing Page
  - [ ] Login/Register
  - [ ] Character Creation
  - [ ] Dashboard (skeleton)
- [ ] Implementar AuthContext/Store
- [ ] Integrar API de autenticação
- [ ] Criar componente AvatarPreview (camadas)
- [ ] Validação de formulários (nome único, senha forte)
- [ ] Protected routes (redirect se não autenticado)
- [ ] Armazenar tokens (localStorage + httpOnly cookie)

#### Critérios de Aceitação
- ✅ Usuário pode se registrar com email/senha
- ✅ Usuário pode fazer login e receber token
- ✅ Token expira e refresha automaticamente
- ✅ Usuário pode criar até 3 personagens
- ✅ Preview do avatar atualiza em tempo real
- ✅ Nome de personagem é único

**Entregável**: Autenticação e criação de personagem funcionais

---

### Sprint 2: Inventário e Itens (Semana 2)

**Foco**: Sistema de itens e inventário básico

#### Backend
- [ ] Implementar schema (`items`, `inventory`, `equipment`)
- [ ] Seed inicial de itens (20-30 itens)
  - [ ] 5 armas
  - [ ] 8 armaduras (2 por slot)
  - [ ] 10 materiais
  - [ ] 5 consumíveis
- [ ] Criar endpoints de inventário
  - [ ] GET `/api/inventory/:characterId`
  - [ ] POST `/api/inventory/equip`
  - [ ] POST `/api/inventory/unequip`
- [ ] Lógica de recálculo de stats ao equipar
- [ ] Trigger de banco para atualizar stats
- [ ] Limites de inventário (slots)

#### Frontend
- [ ] Criar página de Inventário
- [ ] Componente `ItemSlot` com tooltip
- [ ] Componente `EquipmentPanel`
- [ ] Componente `StatsDisplay`
- [ ] Drag & drop de itens (opcional)
- [ ] Modal de confirmação para equipar
- [ ] Feedback visual de stats alterados (+3 STR em verde)

#### Critérios de Aceitação
- ✅ Itens aparecem no inventário com imagem e quantidade
- ✅ Hover em item mostra tooltip com detalhes
- ✅ Equipar item atualiza painel de equipamento
- ✅ Stats recalculam automaticamente
- ✅ Não pode equipar item em slot errado
- ✅ Inventário respeita limite de slots

**Entregável**: Sistema de inventário e equipamento funcional

---

### Sprint 3: Batalhas Automáticas (Semana 3)

**Foco**: Combate e progressão

#### Backend
- [ ] Implementar schema (`battles`, `battle_loot`)
- [ ] Criar catálogo de inimigos (JSON ou tabela)
  - [ ] 10 inimigos (3 áreas x 3-4 mobs)
- [ ] Lógica de combate automático
  - [ ] Cálculo de dano
  - [ ] Ordem de turnos (AGI)
  - [ ] Críticos
  - [ ] Log de batalha
- [ ] Endpoints de batalha
  - [ ] POST `/api/battles/start`
  - [ ] GET `/api/battles/history/:characterId`
- [ ] Sistema de XP e level up
  - [ ] Função `check_level_up()`
  - [ ] Atualizar stats ao subir nível
- [ ] Tabela de loot por inimigo
- [ ] Cooldown de batalha (em caso de derrota)

#### Frontend
- [ ] Criar página de Batalha
- [ ] Tela de seleção de área
- [ ] Animação de loading durante batalha (spinner)
- [ ] Tela de resultado com log
- [ ] Notificação de level up
- [ ] Lista de recompensas
- [ ] Botão "Batalhar novamente"
- [ ] Histórico de batalhas

#### Critérios de Aceitação
- ✅ Jogador seleciona área e inicia batalha
- ✅ Batalha é resolvida no servidor (não hackável)
- ✅ Log mostra turno a turno
- ✅ XP e Gold são creditados
- ✅ Loot vai para inventário
- ✅ Notificação se subiu nível
- ✅ Cooldown de 30s após derrota

**Entregável**: Sistema de combate automático funcional

---

### Sprint 4: Marketplace Básico (Semana 4)

**Foco**: Economia entre jogadores

#### Backend
- [ ] Implementar schema (`shop_listings`, `shop_transactions`)
- [ ] Endpoints de mercado
  - [ ] GET `/api/shop/listings` (com filtros)
  - [ ] POST `/api/shop/list`
  - [ ] POST `/api/shop/buy`
  - [ ] DELETE `/api/shop/listings/:id`
- [ ] Validações
  - [ ] Item não equipado
  - [ ] Quantidade disponível
  - [ ] Ouro suficiente para comprar
  - [ ] Não pode comprar próprio item
- [ ] Taxa de mercado (5%)
- [ ] Transação atômica (compra/venda)
- [ ] Expiração de listings (7 dias)

#### Frontend
- [ ] Criar página de Loja
- [ ] Tab: Mercado de Jogadores
- [ ] Busca e filtros (tipo, preço, nome)
- [ ] Listagem de anúncios
- [ ] Modal de compra com confirmação
- [ ] Modal de criar anúncio
- [ ] Tab: Meus Anúncios (gerenciar)
- [ ] Feedback de transações (toast)

#### Critérios de Aceitação
- ✅ Jogador pode listar itens com preço
- ✅ Outros jogadores veem listagem
- ✅ Compra transfere item e ouro corretamente
- ✅ Vendedor recebe 95% do valor (taxa 5%)
- ✅ Não pode comprar sem ouro suficiente
- ✅ Anúncios expiram após 7 dias
- ✅ Filtros funcionam corretamente

**Entregável**: Marketplace funcional entre jogadores

---

### Sprint 5: Polish e Deploy MVP (Semana 4-5)

**Foco**: Refinar, testar e lançar

#### Tasks
- [ ] Refatoração de código
- [ ] Adicionar loading states em todas páginas
- [ ] Error handling consistente
- [ ] Validações de frontend/backend alinhadas
- [ ] Testes E2E de fluxos principais
  - [ ] Criar conta → personagem → batalha → loot
  - [ ] Equipar item → ver stats alterados
  - [ ] Listar item → outro compra → receber ouro
- [ ] Otimizações de performance
  - [ ] Lazy load de imagens
  - [ ] Code splitting
- [ ] Segurança
  - [ ] Rate limiting
  - [ ] Helmet headers
  - [ ] Validar todas entradas
- [ ] Documentação
  - [ ] README com instruções de setup
  - [ ] API docs (opcional: Swagger)
- [ ] Deploy
  - [ ] VPS ou serviço de cloud
  - [ ] Configurar Nginx reverse proxy
  - [ ] SSL (Let's Encrypt)
  - [ ] CI/CD básico (GitHub Actions)
- [ ] Monitoramento
  - [ ] Logs estruturados
  - [ ] Sentry para errors (opcional)

#### Critérios de Aceitação
- ✅ Aplicação estável sem crashes
- ✅ Todos fluxos principais funcionam
- ✅ Performance aceitável (< 2s load)
- ✅ Deploy acessível publicamente
- ✅ Documentação completa

**Entregável**: MVP online e acessível

---

## 🎮 Fase 2: Expansão de Gameplay (Semanas 6-10)

**Objetivo**: Adicionar profundidade e retenção

---

### Sprint 6: NPCs Compradores (Semana 6)

**Foco**: Dreno de economia

#### Backend
- [ ] Implementar schema (`npc_buyers`, `npc_buyer_prices`, `npc_transactions`)
- [ ] Seed de 2-3 NPCs compradores
- [ ] Endpoints
  - [ ] GET `/api/shop/npc-buyers`
  - [ ] POST `/api/shop/sell-to-npc`
- [ ] Lógica de compra instantânea
- [ ] Log de transações

#### Frontend
- [ ] Tab "Vender para NPC" na Loja
- [ ] Listar itens vendíveis
- [ ] Mostrar preço de compra do NPC
- [ ] Confirmação de venda
- [ ] Histórico de vendas

**Entregável**: NPCs comprando itens automaticamente

---

### Sprint 7: Sistema de Craft (Semana 7)

**Foco**: Criação de itens

#### Backend
- [ ] Implementar schema (`craft_recipes`, `recipe_materials`)
- [ ] Seed de 15-20 receitas
- [ ] Endpoints
  - [ ] GET `/api/craft/recipes`
  - [ ] POST `/api/craft/create`
- [ ] Validar materiais suficientes
- [ ] Consumir materiais e criar item
- [ ] XP por craft (opcional)

#### Frontend
- [ ] Criar página de Craft
- [ ] Listar receitas (disponíveis e bloqueadas)
- [ ] Detalhes de receita (materiais, resultado)
- [ ] Indicador visual de "pode craftar"
- [ ] Modal de confirmação
- [ ] Animação de craft (opcional)

**Entregável**: Sistema de crafting funcional

---

### Sprint 8: Sistema de Coleta (Semana 8)

**Foco**: Obtenção de recursos

#### Backend
- [ ] Implementar schema (`gathering_areas`, `gathering_resources`, `gathering_log`)
- [ ] Seed de 4-5 áreas de coleta
- [ ] Endpoints
  - [ ] GET `/api/gathering/areas`
  - [ ] POST `/api/gathering/collect`
- [ ] Sistema de cooldown
- [ ] Randomização de quantidade coletada
- [ ] Tabela de cooldowns

#### Frontend
- [ ] Criar página de Coleta
- [ ] Listar áreas disponíveis
- [ ] Indicador de cooldown
- [ ] Animação de coleta (spinner)
- [ ] Resultado com itens coletados
- [ ] Timer visual de próxima coleta

**Entregável**: Sistema de coleta de recursos funcional

---

### Sprint 9: Sistema de Missões (Semana 9)

**Foco**: Objetivos guiados

#### Backend
- [ ] Implementar schema (`quests`, `character_quests`)
- [ ] Seed de 10-15 quests
  - [ ] 5 de coleta
  - [ ] 5 de batalha
  - [ ] 3 de craft
- [ ] Endpoints
  - [ ] GET `/api/quests/available/:characterId`
  - [ ] POST `/api/quests/accept`
  - [ ] POST `/api/quests/complete`
  - [ ] GET `/api/quests/active/:characterId`
- [ ] Sistema de progressão de quest
- [ ] Validar objetivos cumpridos
- [ ] Dar recompensas

#### Frontend
- [ ] Criar página de Missões
- [ ] Tabs: Disponíveis, Ativas, Completas
- [ ] Card de quest com objetivos
- [ ] Barra de progresso
- [ ] Botão "Aceitar" e "Completar"
- [ ] Animação de recompensa

**Entregável**: Sistema de missões funcional

---

### Sprint 10: Balanceamento e Polimento (Semana 10)

**Foco**: Ajustar economia e progressão

#### Tasks
- [ ] Análise de dados de jogadores (se houver alpha testers)
- [ ] Ajustar drop rates de loot
- [ ] Balancear XP por nível
- [ ] Ajustar preços de itens
- [ ] Equilibrar stats de inimigos
- [ ] Adicionar mais itens (20-30 novos)
- [ ] Mais receitas de craft (10-15)
- [ ] Mais quests (10-20)
- [ ] Refinar UI/UX baseado em feedback
- [ ] Corrigir bugs reportados
- [ ] Otimizações de performance

**Entregável**: Jogo balanceado e polido

---

## 🌟 Fase 3: Features Sociais e Polimento (Semanas 11-16)

**Objetivo**: Comunidade e engajamento

---

### Sprint 11: Sistema de Chat (Semana 11)

- [ ] Chat global em tempo real (WebSocket)
- [ ] Sistema de mensagens privadas (opcional)
- [ ] Filtro de profanidade
- [ ] Comandos de chat (/help, /whisper)

---

### Sprint 12: Rankings e Leaderboards (Semana 12)

- [ ] Leaderboard de nível
- [ ] Leaderboard de riqueza (gold)
- [ ] Leaderboard de PvE (batalhas vencidas)
- [ ] Perfil público de jogador
- [ ] Badges/Conquistas

---

### Sprint 13: Sistema de Guildas (Semana 13-14)

- [ ] Criar/juntar guilda
- [ ] Chat de guilda
- [ ] Warehouse compartilhado (opcional)
- [ ] Missões de guilda (opcional)
- [ ] Ranking de guildas

---

### Sprint 14: Eventos Temporários (Semana 15)

- [ ] Boss mundial (evento semanal)
- [ ] Double XP weekends
- [ ] Ofertas especiais de NPCs
- [ ] Quests sazonais

---

### Sprint 15: Monetização Ética (Semana 16)

- [ ] Sistema de cosméticos premium
  - [ ] Variantes especiais de aparência
  - [ ] Efeitos visuais (brilhos, auras)
- [ ] VIP/Premium (benefícios de conveniência)
  - [ ] +10 slots de inventário
  - [ ] -20% tempo de craft
  - [ ] Acesso a área VIP (loot equivalente)
- [ ] Gateway de pagamento (Stripe/PayPal)
- [ ] Histórico de compras
- [ ] **Garantia**: Nenhum item pay-to-win

---

## 📊 Métricas e KPIs por Fase

### MVP (Fase 1)
- **Meta**: 50-100 usuários registrados
- **Retenção D1**: 40%
- **Sessões/dia**: 1.5 média
- **Tempo/sessão**: 15 minutos
- **Taxa de criação de personagem**: 80%

### Fase 2
- **Meta**: 200-500 usuários ativos
- **Retenção D7**: 30%
- **Transações no mercado/dia**: 50+
- **Itens craftados/dia**: 100+
- **Quests completadas/dia**: 200+

### Fase 3
- **Meta**: 1000+ usuários ativos
- **Retenção D30**: 20%
- **Guildas ativas**: 20+
- **Mensagens chat/dia**: 500+
- **Conversão para premium**: 2-5%

---

## 🛠️ Ferramentas e Práticas

### Desenvolvimento
- **Git Flow**: feature branches → develop → main
- **Code Review**: PR obrigatório para merge
- **Testes**: Mínimo 70% coverage em lógica core
- **CI/CD**: Deploy automático em push para main

### Comunicação
- **Daily Standup**: Se equipe (5-10 min)
- **Sprint Planning**: Início de cada sprint
- **Retrospective**: Fim de cada sprint
- **Documentação**: Atualizar docs a cada mudança

### Monitoramento
- **Logs**: Pino structured logging
- **Errors**: Sentry (produção)
- **Analytics**: Mixpanel ou PostHog
- **Uptime**: UptimeRobot

---

## 🚧 Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Balanceamento ruim (economia) | Alto | Médio | Testes com alpha testers, ajustes iterativos |
| Performance com muitos users | Alto | Médio | Load testing, caching, otimizações |
| Falta de jogadores (chicken-egg) | Alto | Médio | Marketing, convidar amigos, beta fechado |
| Bugs críticos no lançamento | Médio | Médio | Testes E2E, staging environment |
| Complexidade de features | Médio | Alto | MVP mínimo, adicionar features gradualmente |
| Escopo creep | Médio | Alto | Roadmap fixo, backlog priorizado |

---

## 📝 Notas Finais

- **Flexibilidade**: Roadmap é vivo, ajustar conforme feedback
- **MVP First**: Focar em entregar MVP funcional antes de adicionar features
- **Data-Driven**: Decisões baseadas em métricas, não suposições
- **Comunidade**: Envolver jogadores no desenvolvimento (feedback, sugestões)
- **Diversão**: Se não é divertido desenvolver, não será divertido jogar

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Última Atualização**: Pré-desenvolvimento  
**Status**: Planejamento completo
