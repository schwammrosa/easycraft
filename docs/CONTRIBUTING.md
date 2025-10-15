# 🤝 Guia de Contribuição - EasyCraft

Obrigado pelo interesse em contribuir com o EasyCraft! Este guia ajudará você a começar.

---

## 📋 Tabela de Conteúdo

- [Código de Conduta](#-código-de-conduta)
- [Como Posso Contribuir?](#-como-posso-contribuir)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Workflow de Desenvolvimento](#-workflow-de-desenvolvimento)
- [Padrões de Código](#-padrões-de-código)
- [Commits e PRs](#-commits-e-prs)
- [Revisão de Código](#-revisão-de-código)

---

## 📜 Código de Conduta

### Nossa Promessa

Criar um ambiente acolhedor, respeitoso e inclusivo para todos.

### Comportamentos Esperados

✅ Ser respeitoso com diferentes opiniões  
✅ Aceitar críticas construtivas  
✅ Focar no melhor para a comunidade  
✅ Mostrar empatia com outros membros  

### Comportamentos Inaceitáveis

❌ Linguagem ou imagens ofensivas  
❌ Trolling, insultos ou ataques pessoais  
❌ Assédio público ou privado  
❌ Publicar informações privadas de terceiros  

### Aplicação

Violações podem resultar em banimento temporário ou permanente.  
Reportar problemas: conduct@easycraft.com

---

## 🎯 Como Posso Contribuir?

### 🐛 Reportar Bugs

**Antes de reportar**:
1. Verifique se já não foi reportado
2. Use a versão mais recente
3. Tente reproduzir em ambiente limpo

**Template de Bug Report**:
```markdown
**Descrição**: O que aconteceu?
**Esperado**: O que deveria acontecer?
**Passos para reproduzir**:
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Screenshots**: (se aplicável)
**Ambiente**:
- OS: [Windows/Linux/Mac]
- Browser: [Chrome 120]
- Versão: [v1.0.0]
```

---

### 💡 Sugerir Features

**Template de Feature Request**:
```markdown
**Problema**: Qual problema isso resolve?
**Solução proposta**: Como funcionaria?
**Alternativas**: Outras formas de resolver?
**Impacto**: Quem se beneficia?
**Complexidade**: [Baixa/Média/Alta]
```

---

### 🔧 Contribuir com Código

**Tipos de contribuição**:
- 🐛 **Bug fixes**: Corrigir problemas existentes
- ✨ **Features**: Implementar nova funcionalidade
- 📝 **Documentação**: Melhorar docs
- 🎨 **UI/UX**: Melhorias visuais
- ⚡ **Performance**: Otimizações
- ✅ **Testes**: Aumentar coverage

**Para iniciantes**:
- Procure issues com label `good first issue`
- Comece com algo pequeno (typo, CSS, etc)
- Pergunte se tiver dúvidas!

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos

```bash
node >= 18.0.0
npm >= 9.0.0
docker >= 20.10.0
git >= 2.30.0
```

### Setup

1. **Fork o repositório**
   - Vá para https://github.com/easycraft/easycraft
   - Clique em "Fork"

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU-USERNAME/easycraft.git
   cd easycraft
   ```

3. **Adicione o upstream**
   ```bash
   git remote add upstream https://github.com/easycraft/easycraft.git
   ```

4. **Instale dependências**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Configure environment**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   ```

6. **Suba o banco de dados**
   ```bash
   docker-compose up -d postgres redis
   ```

7. **Rode migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

8. **Inicie os servidores**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev
   
   # Frontend (terminal 2)
   cd frontend
   npm run dev
   ```

9. **Verifique funcionamento**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/api/health

---

## 🔄 Workflow de Desenvolvimento

### 1. Mantenha seu fork atualizado

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Crie uma branch

```bash
# Para features
git checkout -b feature/nome-da-feature

# Para bugs
git checkout -b fix/nome-do-bug

# Para docs
git checkout -b docs/o-que-mudou
```

**Convenção de nomes**:
- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração
- `test/` - Adicionar/melhorar testes
- `chore/` - Manutenção (deps, config)

### 3. Faça suas mudanças

- Siga os [padrões de código](#-padrões-de-código)
- Adicione testes se aplicável
- Atualize documentação se necessário
- Teste localmente

### 4. Commit

```bash
git add .
git commit -m "feat: adiciona sistema de chat"
```

Veja [Convenção de Commits](#convenção-de-commits)

### 5. Push

```bash
git push origin feature/nome-da-feature
```

### 6. Abra Pull Request

- Vá para seu fork no GitHub
- Clique em "Compare & pull request"
- Preencha o template
- Submeta!

---

## 📝 Padrões de Código

### TypeScript

**Estilo**:
- Use TypeScript (não JavaScript puro)
- Evite `any`, prefira `unknown` se necessário
- Use interfaces para objetos, types para unions/intersections

**Exemplo**:
```typescript
// ✅ Bom
interface User {
  id: number;
  email: string;
  createdAt: Date;
}

function getUser(id: number): Promise<User> {
  // ...
}

// ❌ Evitar
function getUser(id: any): any {
  // ...
}
```

### Naming

```typescript
// Classes e Interfaces: PascalCase
class CharacterService {}
interface UserData {}

// Funções e variáveis: camelCase
function calculateDamage() {}
const characterLevel = 5;

// Constantes: UPPER_SNAKE_CASE
const MAX_INVENTORY_SLOTS = 50;

// Componentes React: PascalCase
function InventoryPanel() {}

// Arquivos: kebab-case
// character-service.ts
// inventory-panel.tsx
```

### Imports

```typescript
// Ordem:
// 1. External
import React from 'react';
import { useState } from 'react';

// 2. Internal (absoluto)
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';

// 3. Relativo
import { helper } from './utils';
import styles from './styles.module.css';
```

### React

**Componentes funcionais + Hooks**:
```typescript
// ✅ Bom
export function InventoryPanel() {
  const [items, setItems] = useState<Item[]>([]);
  
  return <div>...</div>;
}

// ❌ Evitar class components
class InventoryPanel extends React.Component {}
```

**Props com interface**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Backend

**Estrutura de módulo**:
```
modules/character/
├── character.controller.ts  # Endpoints
├── character.service.ts     # Lógica de negócio
├── character.routes.ts      # Rotas
├── character.validation.ts  # Schemas Zod
└── character.types.ts       # Interfaces
```

**Controllers retornam padrão**:
```typescript
// ✅ Bom
return res.json({
  success: true,
  data: { character }
});

// Erro
return res.status(400).json({
  success: false,
  error: {
    code: 'INVALID_INPUT',
    message: 'Email already exists'
  }
});
```

---

## 💬 Commits e PRs

### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/).

**Formato**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não muda código)
- `refactor`: Refatoração
- `test`: Adicionar/modificar testes
- `chore`: Manutenção

**Exemplos**:
```bash
feat(battle): adiciona sistema de críticos
fix(auth): corrige refresh token expirando
docs(api): atualiza documentação de endpoints
refactor(inventory): simplifica lógica de equip
test(character): adiciona testes de criação
chore(deps): atualiza dependências
```

**Scope** (opcional):
- `auth`, `character`, `battle`, `inventory`, `shop`, `craft`
- `frontend`, `backend`, `database`

**Subject**:
- Imperativo ("adiciona", não "adicionado")
- Minúsculo
- Sem ponto final
- Máximo 50 caracteres

**Body** (opcional):
- Explica o "porquê", não o "como"
- Wrap em 72 caracteres

**Footer** (opcional):
```
Closes #123
Refs #456
BREAKING CHANGE: muda schema de autenticação
```

---

### Template de Pull Request

```markdown
## 📝 Descrição

Breve descrição do que foi feito.

## 🎯 Issue Relacionada

Closes #123

## 🔧 Tipo de Mudança

- [ ] Bug fix (não quebra features existentes)
- [ ] Nova feature (não quebra features existentes)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## ✅ Checklist

- [ ] Código segue padrões do projeto
- [ ] Comentei código complexo
- [ ] Atualizei documentação
- [ ] Adicionei testes
- [ ] Todos os testes passam
- [ ] Não há warnings
- [ ] Testei localmente

## 📸 Screenshots

(se aplicável)

## 🧪 Como Testar

1. Vá para página X
2. Clique em Y
3. Verifique que Z acontece

## 📝 Notas Adicionais

Informações extras para revisores.
```

---

## 👀 Revisão de Código

### Para Revisores

**O que verificar**:
- ✅ Código funciona como esperado
- ✅ Segue padrões do projeto
- ✅ Tem testes adequados
- ✅ Documentação atualizada
- ✅ Não introduz vulnerabilidades
- ✅ Performance é aceitável

**Como revisar**:
- Seja construtivo e educado
- Explique o "porquê" das sugestões
- Pergunte ao invés de ordenar
- Aprove se está bom o suficiente (não precisa ser perfeito)

**Comentários**:
```markdown
// ❌ Ruim
"Isso está errado."

// ✅ Bom
"Aqui poderia usar `Array.map()` ao invés de loop for, 
ficaria mais legível. Exemplo: [código]"
```

### Para Autores

**Respondendo reviews**:
- Agradeça o feedback
- Faça perguntas se não entendeu
- Implemente sugestões ou explique por que não
- Marque conversas como resolvidas

**Depois de aprovação**:
- Squash commits se muitos pequenos
- Merge ou aguarde maintainer
- Delete branch após merge

---

## 🧪 Testes

### Rodando Testes

```bash
# Backend
cd backend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Com coverage

# Frontend
cd frontend
npm run test              # Component tests
npm run test:e2e          # E2E com Playwright
```

### Escrevendo Testes

**Backend (Jest)**:
```typescript
describe('CharacterService', () => {
  it('should create character with valid data', async () => {
    const character = await characterService.create({
      name: 'TestHero',
      userId: 1
    });
    
    expect(character.name).toBe('TestHero');
    expect(character.level).toBe(1);
  });
});
```

**Frontend (Vitest + RTL)**:
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with label', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Coverage Mínimo

- **Lógica crítica**: 80%+ (combate, economia, auth)
- **Services**: 70%+
- **Components**: 60%+
- **Overall**: 70%+

---

## 📚 Recursos

### Documentação do Projeto
- [Visão Geral](docs/01_visao_geral.md)
- [API Specification](docs/04_api_specification.md)
- [UI Design](docs/06_ui_design.md)
- [Quick Start](docs/QUICKSTART.md)

### Tecnologias
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)

### Comunidade
- Discord: [Link]
- GitHub Discussions: [Link]
- Email: dev@easycraft.com

---

## ❓ FAQ

**P: Posso trabalhar em uma issue já atribuída?**  
R: Não, a menos que tenha permissão do assignee.

**P: Quanto tempo leva para meu PR ser revisado?**  
R: Geralmente 24-48 horas. Seja paciente.

**P: Meu PR foi rejeitado, e agora?**  
R: Leia o feedback, faça ajustes, faça push. Não precisa criar novo PR.

**P: Posso trabalhar em múltiplas issues simultaneamente?**  
R: Sim, mas crie branches separadas.

**P: Preciso assinar CLA?**  
R: Não neste momento.

---

## 🎉 Reconhecimento

Contribuidores serão listados em:
- README (Contributors section)
- Changelog (release notes)
- Hall of Fame (website futuro)

Top contribuidores ganham:
- Badge especial no Discord
- Acesso early a features
- Cosméticos exclusivos no jogo

---

**Obrigado por contribuir com o EasyCraft! 🚀**

---

[🏠 README](README.md) | [📚 Documentação](docs/00_indice.md) | [🚀 Quick Start](docs/QUICKSTART.md)
