# 🎯 Sprint 1: Autenticação e Personagens

**Duração**: 1 semana  
**Data Início**: 15/10/2025  
**Status**: 🚧 Em Progresso

---

## 📋 Objetivos do Sprint

### 🎯 Meta Principal
Implementar sistema completo de autenticação e gerenciamento de personagens, permitindo que usuários:
- Se registrem na plataforma
- Façam login/logout
- Criem e gerenciem até 3 personagens
- Visualizem dashboard básico

---

## ✅ Checklist de Implementação

### 📦 Backend - Autenticação (13 tasks)

#### Estrutura e Configuração
- [ ] Criar `src/modules/auth/auth.types.ts`
- [ ] Criar `src/modules/auth/auth.validation.ts` (schemas Zod)
- [ ] Criar `src/modules/auth/auth.service.ts`
- [ ] Criar `src/modules/auth/auth.controller.ts`
- [ ] Criar `src/modules/auth/auth.routes.ts`

#### Endpoints
- [ ] POST `/api/auth/register` - Registrar novo usuário
- [ ] POST `/api/auth/login` - Login e geração de JWT
- [ ] POST `/api/auth/refresh` - Renovar access token
- [ ] POST `/api/auth/logout` - Invalidar refresh token
- [ ] Middleware `authenticate.ts` - Validar JWT

#### Segurança
- [ ] Hash de senha com bcrypt (12 rounds)
- [ ] Rate limiting (100 req/15min)
- [ ] Validação de email único

---

### 📦 Backend - Personagens (12 tasks)

#### Estrutura
- [ ] Criar `src/modules/character/character.types.ts`
- [ ] Criar `src/modules/character/character.validation.ts`
- [ ] Criar `src/modules/character/character.service.ts`
- [ ] Criar `src/modules/character/character.controller.ts`
- [ ] Criar `src/modules/character/character.routes.ts`

#### Endpoints
- [ ] GET `/api/characters` - Listar personagens do usuário
- [ ] POST `/api/characters` - Criar novo personagem
- [ ] GET `/api/characters/:id` - Detalhes do personagem
- [ ] DELETE `/api/characters/:id` - Deletar personagem

#### Lógica
- [ ] Validar nome único
- [ ] Limite de 3 personagens por usuário
- [ ] Criar `character_stats` automaticamente
- [ ] Calcular stats iniciais (5 em cada atributo)

---

### 🎨 Frontend - Autenticação (10 tasks)

#### Estrutura
- [ ] Criar `src/services/api.ts` - Axios client configurado
- [ ] Criar `src/services/auth.service.ts`
- [ ] Criar `src/store/authStore.ts` (Zustand)
- [ ] Criar `src/types/auth.types.ts`

#### Componentes e Páginas
- [ ] `src/pages/Login.tsx` - Tela de login
- [ ] `src/pages/Register.tsx` - Tela de registro
- [ ] `src/components/PrivateRoute.tsx` - Proteção de rotas
- [ ] Configurar React Router

#### Funcionalidades
- [ ] Validação de formulários (email, senha forte)
- [ ] Armazenar tokens no localStorage
- [ ] Auto-refresh de token
- [ ] Redirecionamento após login

---

### 🎨 Frontend - Personagens (8 tasks)

#### Estrutura
- [ ] Criar `src/services/character.service.ts`
- [ ] Criar `src/store/characterStore.ts`
- [ ] Criar `src/types/character.types.ts`

#### Componentes e Páginas
- [ ] `src/pages/CharacterSelection.tsx` - Listagem de personagens
- [ ] `src/pages/CharacterCreation.tsx` - Criar personagem
- [ ] `src/components/CharacterCard.tsx` - Card do personagem
- [ ] `src/components/AvatarPreview.tsx` - Preview por camadas

#### Funcionalidades
- [ ] Seletor de aparência (4 camadas: head, arms, legs, feet)
- [ ] Preview em tempo real
- [ ] Validação (máximo 3 personagens)

---

### 🧪 Testes (5 tasks)

- [ ] Testes unitários: `auth.service.test.ts`
- [ ] Testes unitários: `character.service.test.ts`
- [ ] Teste E2E: Fluxo completo de registro
- [ ] Teste E2E: Login e criar personagem
- [ ] Validar todas as regras de negócio

---

## 📊 Progresso Atual

```
Backend Auth:        [░░░░░░░░░░] 0/13
Backend Character:   [░░░░░░░░░░] 0/12
Frontend Auth:       [░░░░░░░░░░] 0/10
Frontend Character:  [░░░░░░░░░░] 0/8
Testes:             [░░░░░░░░░░] 0/5

TOTAL:              [░░░░░░░░░░] 0/48
```

---

## 🎯 Ordem de Implementação Sugerida

### Dia 1-2: Backend Auth
1. Estrutura de módulos
2. Validações Zod
3. Auth service (register, login, refresh)
4. Auth controller
5. Auth routes
6. Middleware authenticate
7. Testar com Thunder Client/Postman

### Dia 3: Backend Characters
1. Estrutura de módulos
2. Character service (CRUD)
3. Character controller
4. Character routes
5. Regras de negócio
6. Testar endpoints

### Dia 4-5: Frontend Auth
1. Setup Axios + Zustand
2. Auth service
3. Auth store
4. Páginas Login/Register
5. Validações
6. Token management

### Dia 6-7: Frontend Characters
1. Character service
2. Character store
3. Character Selection
4. Character Creation
5. Avatar Preview
6. Integração completa

### Dia 7: Testes e Polish
1. Testes unitários
2. Testes E2E
3. Correção de bugs
4. Validações finais

---

## 🔧 Tecnologias e Bibliotecas

### Backend
- **Express**: Framework web
- **Prisma**: ORM
- **Zod**: Validação de schemas
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: JWT tokens
- **express-rate-limit**: Rate limiting

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **React Router**: Navegação
- **Zustand**: State management
- **Axios**: HTTP client
- **TailwindCSS**: Styling

---

## 📝 Validações Importantes

### Registro
- Email válido e único
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 número
- Confirmação de senha

### Login
- Email existe
- Senha correta
- Retornar access + refresh token

### Criar Personagem
- Nome único (case insensitive)
- Máximo 3 personagens por usuário
- Todas as 4 camadas de aparência selecionadas
- Nome: 3-20 caracteres, alfanumérico

---

## 🎨 Telas a Criar

1. **Landing Page** (já existe)
2. **Register** - Formulário de cadastro
3. **Login** - Formulário de login
4. **Character Selection** - Escolher ou criar personagem
5. **Character Creation** - Customizar aparência
6. **Dashboard** (básico) - Placeholder para próximos sprints

---

## 📋 Definition of Done

Sprint 1 está completo quando:

- [ ] Usuário pode se registrar com email/senha
- [ ] Usuário pode fazer login
- [ ] Token JWT é gerado e validado
- [ ] Refresh token funciona
- [ ] Usuário pode criar até 3 personagens
- [ ] Personagem tem nome único
- [ ] Aparência customizável com preview funcional
- [ ] Character stats são criados automaticamente
- [ ] Todas as validações funcionam
- [ ] Frontend e Backend integrados
- [ ] Testes críticos passando
- [ ] Sem erros no console
- [ ] Documentação atualizada

---

## 🐛 Bugs Conhecidos

Nenhum ainda (Sprint não iniciado)

---

## 📚 Recursos Úteis

- [Documentação da API](docs/04_api_specification.md#-autenticação)
- [Database Schema](docs/05_database_schema.sql)
- [UI Design - Auth](docs/06_ui_design.md#2-loginregister)
- [Fluxos de Usuário](docs/08_fluxos_usuario.md#1--primeiro-acesso-onboarding)

---

## 🎯 Próximo Sprint

**Sprint 2**: Inventário e Itens (Semana 2)

---

**Última atualização**: 15/10/2025 10:00  
**Responsável**: Time EasyCraft
