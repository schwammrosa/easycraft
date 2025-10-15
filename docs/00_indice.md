# 📚 EasyCraft - Índice de Documentação

## Navegação Rápida

Este é o índice completo da documentação do projeto EasyCraft. Use este guia para encontrar rapidamente as informações que você precisa.

---

## 📖 Documentos Principais

### 1. [Visão Geral do Projeto](01_visao_geral.md)
**O que é**: Elevator pitch, objetivos, público-alvo e diferenciais  
**Para quem**: Stakeholders, investidores, novos membros do time  
**Tempo de leitura**: 10 minutos

**Conteúdo**:
- Elevator pitch
- Objetivos do projeto
- Público-alvo
- Diferenciais competitivos
- Pilares de gameplay
- Modelo de negócio
- Visão de futuro

---

### 2. [Mecânicas Detalhadas](02_mecanicas_detalhadas.md)
**O que é**: Especificação completa de todas as mecânicas de jogo  
**Para quem**: Game designers, desenvolvedores  
**Tempo de leitura**: 30 minutos

**Conteúdo**:
- Sistema de personagem (criação, aparência)
- Sistema de atributos (STR, AGI, VIT, INT, DEF)
- Sistema de combate automático
- Sistema de inventário e equipamentos
- Sistema de craft
- Sistema de coleta de recursos
- Sistema de mercado (player-to-player + NPCs)
- Sistema de missões/quests
- Sistema de progressão (XP, níveis)
- Sistema econômico completo
- Loops de gameplay

---

### 3. [Requisitos Técnicos](03_requisitos_tecnicos.md)
**O que é**: Stack tecnológico e requisitos de infraestrutura  
**Para quem**: Desenvolvedores, DevOps, arquitetos  
**Tempo de leitura**: 20 minutos

**Conteúdo**:
- Stack recomendado (Frontend + Backend)
- Banco de dados e cache
- Infraestrutura e deploy
- Dependências principais
- Estrutura de diretórios
- Variáveis de ambiente
- Docker configuration
- Requisitos de performance
- Testing strategy
- Monitoramento e logs
- Backup e recovery

---

### 4. [Especificação da API](04_api_specification.md)
**O que é**: Documentação completa de todos os endpoints REST  
**Para quem**: Desenvolvedores frontend e backend  
**Tempo de leitura**: 40 minutos

**Conteúdo**:
- Informações gerais (base URL, headers, response pattern)
- Autenticação (register, login, refresh, logout)
- Personagens (CRUD completo)
- Batalhas (start, history)
- Inventário (get, equip, unequip)
- Craft (recipes, create)
- Mercado (listings, buy, sell, NPCs)
- Missões (available, accept, complete)
- Coleta (areas, collect)
- Rate limiting

---

### 5. [Database Schema](05_database_schema.sql)
**O que é**: Schema completo do PostgreSQL com todas as tabelas  
**Para quem**: Desenvolvedores backend, DBAs  
**Tempo de leitura**: 30 minutos (análise)

**Conteúdo**:
- Extensions e enums
- Tabelas de autenticação (users)
- Tabelas de personagens (characters, character_stats)
- Tabelas de itens (items, inventory, equipment)
- Tabelas de craft (craft_recipes, recipe_materials)
- Tabelas de batalhas (battles, battle_loot)
- Tabelas de mercado (shop_listings, shop_transactions)
- Tabelas de NPCs (npc_buyers, npc_buyer_prices)
- Tabelas de quests (quests, character_quests)
- Tabelas de coleta (gathering_areas, gathering_resources)
- Triggers e functions
- Índices para performance
- Seed data inicial

---

### 6. [UI/UX Design](06_ui_design.md)
**O que é**: Guia completo de design visual e experiência do usuário  
**Para quem**: Designers, desenvolvedores frontend  
**Tempo de leitura**: 35 minutos

**Conteúdo**:
- Princípios de design
- Paleta de cores completa
- Layout e estrutura (grid, spacing, typography)
- Telas detalhadas (10 telas principais)
- Componentes reutilizáveis
- Estados de UI (loading, empty, error, success)
- Notificações e feedback
- Animações e transições
- Responsividade (desktop/tablet/mobile)
- Acessibilidade (WCAG AA)
- Performance (otimizações)

---

### 7. [Roadmap Completo](07_roadmap.md)
**O que é**: Planejamento detalhado de desenvolvimento por sprints  
**Para quem**: Project managers, desenvolvedores, stakeholders  
**Tempo de leitura**: 45 minutos

**Conteúdo**:
- **Fase 0**: Preparação (setup, assets, devops) - 3-5 dias
- **Fase 1**: MVP Core (4 sprints, 4 semanas)
  - Sprint 1: Autenticação e personagens
  - Sprint 2: Inventário e itens
  - Sprint 3: Batalhas automáticas
  - Sprint 4: Marketplace básico
  - Sprint 5: Polish e deploy
- **Fase 2**: Expansão (5 sprints, 5 semanas)
  - NPCs compradores, Craft, Coleta, Missões, Balanceamento
- **Fase 3**: Features sociais (6 sprints, 6 semanas)
  - Chat, Rankings, Guildas, Eventos, Monetização
- Métricas e KPIs por fase
- Riscos e mitigações

---

### 8. [Fluxos de Usuário](08_fluxos_usuario.md)
**O que é**: Jornadas detalhadas do jogador em cada funcionalidade  
**Para quem**: UX designers, desenvolvedores, QA testers  
**Tempo de leitura**: 35 minutos

**Conteúdo**:
- Primeiro acesso (onboarding completo)
- Primeira batalha (vitória e derrota)
- Gerenciar inventário
- Usar marketplace (vender e comprar)
- Craftar item
- Coletar recursos
- Completar quest
- Loop de progressão diário
- Subir de nível
- Fluxos de erro (conexão, sessão, validações)
- Métricas por fluxo

---

### 9. [Game Design Document](09_game_design.md)
**O que é**: Balanceamento econômico e progressão do jogo  
**Para quem**: Game designers, balanceadores  
**Tempo de leitura**: 25 minutos

**Conteúdo**:
- Sistema econômico (faucets e sinks)
- Preços de referência (materiais, equipamentos, consumíveis)
- Inflação e controle
- Balanceamento de combate (fórmulas, stats de inimigos)
- Progressão (tabela XP, stats por level)
- Receitas de craft por tier
- Sistema de quests (tipos, recompensas)
- Drop tables por inimigo
- Métricas de balanceamento
- KPIs e ajustes

---

## 🎯 Guias Rápidos por Perfil

### Para Desenvolvedores Backend
1. [Requisitos Técnicos](03_requisitos_tecnicos.md) - Stack e dependências
2. [Database Schema](05_database_schema.sql) - Estrutura do banco
3. [Especificação da API](04_api_specification.md) - Endpoints
4. [Mecânicas Detalhadas](02_mecanicas_detalhadas.md) - Lógica de negócio

### Para Desenvolvedores Frontend
1. [UI/UX Design](06_ui_design.md) - Design system
2. [Especificação da API](04_api_specification.md) - Integração
3. [Fluxos de Usuário](08_fluxos_usuario.md) - Jornadas
4. [Requisitos Técnicos](03_requisitos_tecnicos.md) - Stack frontend

### Para Game Designers
1. [Mecânicas Detalhadas](02_mecanicas_detalhadas.md) - Sistemas
2. [Game Design Document](09_game_design.md) - Balanceamento
3. [Fluxos de Usuário](08_fluxos_usuario.md) - Experiência
4. [Visão Geral](01_visao_geral.md) - Objetivos

### Para UI/UX Designers
1. [UI/UX Design](06_ui_design.md) - Design completo
2. [Fluxos de Usuário](08_fluxos_usuario.md) - Jornadas
3. [Mecânicas Detalhadas](02_mecanicas_detalhadas.md) - Funcionalidades
4. [Visão Geral](01_visao_geral.md) - Contexto

### Para Project Managers
1. [Roadmap Completo](07_roadmap.md) - Planejamento
2. [Visão Geral](01_visao_geral.md) - Objetivos e escopo
3. [Requisitos Técnicos](03_requisitos_tecnicos.md) - Recursos necessários
4. [Game Design Document](09_game_design.md) - Métricas

### Para QA Testers
1. [Fluxos de Usuário](08_fluxos_usuario.md) - Casos de teste
2. [Especificação da API](04_api_specification.md) - Validações
3. [Mecânicas Detalhadas](02_mecanicas_detalhadas.md) - Regras de negócio
4. [Game Design Document](09_game_design.md) - Balanceamento

---

## 📊 Documentos por Fase do Projeto

### Planejamento (Pré-desenvolvimento)
- ✅ [Visão Geral](01_visao_geral.md)
- ✅ [Roadmap Completo](07_roadmap.md)
- ✅ [Game Design Document](09_game_design.md)

### Design (Semana 0)
- ✅ [UI/UX Design](06_ui_design.md)
- ✅ [Fluxos de Usuário](08_fluxos_usuario.md)
- ✅ [Mecânicas Detalhadas](02_mecanicas_detalhadas.md)

### Desenvolvimento (Fase 1+)
- ✅ [Requisitos Técnicos](03_requisitos_tecnicos.md)
- ✅ [Database Schema](05_database_schema.sql)
- ✅ [Especificação da API](04_api_specification.md)

### Todos os Estágios
- ✅ README.md (raiz do projeto)
- ✅ Este índice

---

## 🔍 Busca Rápida por Tópico

### Autenticação
- [API Specification § Autenticação](04_api_specification.md#-autenticação)
- [Database Schema § Users](05_database_schema.sql)
- [Fluxos § Primeiro Acesso](08_fluxos_usuario.md#1--primeiro-acesso-onboarding)

### Batalhas
- [Mecânicas § Sistema de Combate](02_mecanicas_detalhadas.md#️-sistema-de-combate-automático)
- [API Specification § Batalhas](04_api_specification.md#️-batalhas)
- [Game Design § Balanceamento](09_game_design.md#️-balanceamento-de-combate)
- [Fluxos § Primeira Batalha](08_fluxos_usuario.md#2-️-primeira-batalha)

### Economia
- [Mecânicas § Sistema Econômico](02_mecanicas_detalhadas.md#-sistema-econômico)
- [Game Design § Sistema Econômico](09_game_design.md#-sistema-econômico)
- [Database Schema § Shop](05_database_schema.sql)

### Inventário
- [Mecânicas § Sistema de Inventário](02_mecanicas_detalhadas.md#-sistema-de-inventário)
- [API Specification § Inventário](04_api_specification.md#-inventário)
- [Fluxos § Gerenciar Inventário](08_fluxos_usuario.md#3--gerenciar-inventário)

### Craft
- [Mecânicas § Sistema de Craft](02_mecanicas_detalhadas.md#️-sistema-de-craft)
- [API Specification § Craft](04_api_specification.md#️-craft)
- [Game Design § Receitas](09_game_design.md#️-receitas-de-craft)
- [Fluxos § Craftar Item](08_fluxos_usuario.md#5-️-craftar-item)

### Marketplace
- [Mecânicas § Sistema de Mercado](02_mecanicas_detalhadas.md#-sistema-de-mercado)
- [API Specification § Mercado](04_api_specification.md#-mercado)
- [Fluxos § Usar Marketplace](08_fluxos_usuario.md#4--usar-marketplace)

### Personagens
- [Mecânicas § Sistema de Personagem](02_mecanicas_detalhadas.md#-sistema-de-personagem)
- [API Specification § Personagens](04_api_specification.md#-personagens)
- [UI Design § Character Creation](06_ui_design.md#3-character-creation)

---

## 📝 Como Usar Esta Documentação

### Para Início Rápido
1. Leia o [README.md](../README.md) na raiz
2. Explore a [Visão Geral](01_visao_geral.md)
3. Consulte o [Roadmap](07_roadmap.md) para entender as fases

### Para Implementação
1. Escolha um módulo no roadmap
2. Consulte as [Mecânicas](02_mecanicas_detalhadas.md) para entender a lógica
3. Veja a [API Specification](04_api_specification.md) para endpoints
4. Use o [Database Schema](05_database_schema.sql) para estrutura
5. Siga o [UI Design](06_ui_design.md) para interface

### Para Entender o Sistema
1. Comece com [Visão Geral](01_visao_geral.md)
2. Aprofunde em [Mecânicas Detalhadas](02_mecanicas_detalhadas.md)
3. Veja como funciona em [Fluxos de Usuário](08_fluxos_usuario.md)
4. Entenda o balanceamento em [Game Design](09_game_design.md)

---

## 🔄 Atualizações

### Versão Atual: 1.0.0
**Data**: Outubro 2025  
**Status**: Documentação inicial completa

### Histórico
- **v1.0.0** (Out 2025): Documentação completa para início do desenvolvimento

### Manutenção
Esta documentação deve ser atualizada conforme o projeto evolui:
- **Semanal**: Durante desenvolvimento ativo
- **Mensalmente**: Durante manutenção
- **Ad-hoc**: Quando features mudam significativamente

---

## ❓ FAQ da Documentação

**P: Por onde começar?**  
R: Leia o README.md e depois a Visão Geral (01).

**P: Documentação está desatualizada?**  
R: Verifique a versão no topo de cada documento.

**P: Falta alguma informação?**  
R: Abra uma issue no repositório ou contate o time.

**P: Posso contribuir com a documentação?**  
R: Sim! Siga o guia de contribuição e abra um PR.

**P: Preciso ler tudo?**  
R: Não. Use os "Guias Rápidos por Perfil" acima.

---

## 📞 Suporte

- **Issues**: [GitHub Issues]
- **Discussões**: [GitHub Discussions]
- **Discord**: [Link do servidor]
- **Email**: docs@easycraft.com

---

**Última atualização**: Outubro 2025  
**Mantido por**: EasyCraft Team  
**Licença**: MIT

---

[⬆️ Voltar ao topo](#-easycraft---índice-de-documentação)
