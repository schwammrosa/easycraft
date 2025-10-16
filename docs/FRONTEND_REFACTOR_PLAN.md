# 🎨 Frontend Refactor Plan - EasyCraft

**Data**: 16/10/2025  
**Status**: Em Progresso  
**Objetivo**: Padronizar, organizar e melhorar visual do frontend

---

## 📋 Problemas Identificados

### 🎨 Cores e Visual
- [ ] Falta `bg-dark` no tailwind.config (usado mas não definido)
- [ ] Cores hardcoded inconsistentes (`green-600`, `gray-600` ao invés de tokens)
- [ ] Toast usa cores genéricas ao invés das accent colors
- [ ] Paleta limitada - faltam variações de tons
- [ ] Contraste baixo em alguns textos (`text-text-secondary`)

### 🧩 Componentes Faltantes
- [ ] **Navbar** - Header consistente com navegação
- [ ] **PageLayout** - Wrapper para layout padronizado
- [ ] **Button** - Componente reutilizável com variantes
- [ ] **Card** - Componente de card padronizado
- [ ] **Badge** - Para tags, stats, labels
- [ ] **Modal** - Modal padronizado (muitos inline)
- [ ] **EmptyState** - Estado vazio padronizado
- [ ] **ProgressBar** - Barra de progresso reutilizável

### 🔧 Desorganização
- [ ] Código duplicado em modais
- [ ] Botões com 15+ variações de estilo inline
- [ ] Espaçamentos inconsistentes (mix de valores)
- [ ] Loading states diferentes em cada página
- [ ] Sem sistema de grid spacing consistente

### ♿ Acessibilidade
- [ ] Falta `aria-labels` em botões de ação
- [ ] Falta `role` e `aria-*` em modais
- [ ] Contraste WCAG não verificado
- [ ] Falta indicadores de loading visuais

---

## 🎯 Soluções Planejadas

### **Fase 1: Design System** ⭐ PRIORIDADE
1. **Expandir Tailwind Config**
   - Adicionar cores faltantes (`bg-dark`, `bg-darker`)
   - Criar sistema de spacing consistente
   - Adicionar shadows e bordas padronizadas
   - Definir breakpoints responsivos claros

2. **Criar Design Tokens** (`src/styles/tokens.ts`)
   - Cores semânticas (success, error, warning, info)
   - Tamanhos (spacing, font-size, border-radius)
   - Shadows e elevações
   - Transições e animações

### **Fase 2: Componentes Base**
3. **Button Component** (`src/components/ui/Button.tsx`)
   - Variantes: primary, secondary, danger, success, ghost
   - Tamanhos: sm, md, lg
   - Estados: loading, disabled
   - Com ícones opcionais

4. **Card Component** (`src/components/ui/Card.tsx`)
   - Card padrão com header, body, footer
   - Variantes: default, highlighted, glass

5. **Modal Component** (`src/components/ui/Modal.tsx`)
   - Modal base reutilizável
   - Overlay animado
   - Fechar com ESC e click fora
   - Acessível (focus trap, aria-labels)

6. **Badge Component** (`src/components/ui/Badge.tsx`)
   - Para stats, níveis, quantidades
   - Variantes de cor

### **Fase 3: Layout Components**
7. **Navbar** (`src/components/layout/Navbar.tsx`)
   - Header consistente
   - Breadcrumbs
   - User info
   - Navegação principal

8. **PageLayout** (`src/components/layout/PageLayout.tsx`)
   - Wrapper com navbar
   - Container max-width consistente
   - Padding padrão
   - Breadcrumbs automáticos

9. **EmptyState** (`src/components/EmptyState.tsx`)
   - Estado vazio padronizado
   - Com ícone e mensagem
   - Call-to-action opcional

### **Fase 4: Refatoração de Páginas**
10. **Atualizar todas as páginas**
    - Usar PageLayout wrapper
    - Substituir botões inline por Button component
    - Substituir modais inline por Modal component
    - Usar Card component
    - Padronizar loading states

### **Fase 5: Polish e Melhorias**
11. **Melhorias visuais**
    - Adicionar micro-animações
    - Melhorar feedback visual
    - Hover states consistentes
    - Focus states para acessibilidade

12. **Responsividade**
    - Testar em mobile
    - Ajustar grid layouts
    - Menu mobile collapse

---

## 🎨 Nova Paleta de Cores

### Cores Base (Melhoradas)
```javascript
bg: {
  darker: '#0a0a14',  // NOVO - Fundo mais escuro
  dark: '#111122',    // NOVO - Fundo escuro alternativo
  main: '#1a1a2e',    // Mantido
  panel: '#16213e',   // Mantido
  input: '#0f3460',   // Mantido
  hover: '#1a4478',   // NOVO - Hover states
}

primary: {
  darker: '#1a2938',  // NOVO
  dark: '#2c3e50',    // Mantido
  medium: '#34495e',  // Mantido
  light: '#4a6278',   // Mantido
}

accent: {
  gold: '#f39c12',    // Mantido
  goldDark: '#d68910', // NOVO
  green: '#27ae60',   // Mantido
  greenDark: '#1e8449', // NOVO
  red: '#e74c3c',     // Mantido
  redDark: '#c0392b',  // NOVO
  blue: '#3498db',    // Mantido
  blueDark: '#2980b9', // NOVO
  purple: '#9b59b6',  // Mantido
  purpleDark: '#8e44ad', // NOVO
  orange: '#e67e22',  // NOVO
}

semantic: { // NOVO
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
}
```

---

## 📦 Estrutura de Arquivos Proposta

```
frontend/src/
├── components/
│   ├── ui/                    # NOVO - Componentes UI base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/                # NOVO - Componentes de layout
│   │   ├── Navbar.tsx
│   │   ├── PageLayout.tsx
│   │   └── Sidebar.tsx (futuro)
│   ├── game/                  # NOVO - Componentes específicos do jogo
│   │   ├── StatBar.tsx
│   │   ├── ItemCard.tsx
│   │   ├── CharacterAvatar.tsx
│   │   └── InventorySlot.tsx
│   ├── AnimatedNumber.tsx     # Mantido
│   ├── EmptyState.tsx         # NOVO
│   ├── LoadingSkeleton.tsx    # Mantido
│   ├── LoadingSpinner.tsx     # Mantido (melhorar)
│   ├── Toast.tsx              # Mantido (atualizar cores)
│   ├── Tooltip.tsx            # Mantido
│   └── Tutorial.tsx           # Mantido
├── styles/                    # NOVO
│   ├── tokens.ts              # Design tokens
│   └── animations.css         # Animações customizadas
└── utils/                     # NOVO
    └── cn.ts                  # className merge utility
```

---

## ✅ Checklist de Implementação

### Fase 1: Design System
- [ ] Atualizar `tailwind.config.js` com nova paleta
- [ ] Criar `src/styles/tokens.ts`
- [ ] Criar `src/utils/cn.ts` (className utility)
- [ ] Adicionar bg-dark ao config

### Fase 2: Componentes UI
- [ ] Criar `Button.tsx`
- [ ] Criar `Card.tsx`
- [ ] Criar `Modal.tsx`
- [ ] Criar `Badge.tsx`
- [ ] Criar `ProgressBar.tsx`
- [ ] Criar `EmptyState.tsx`

### Fase 3: Layout
- [ ] Criar `Navbar.tsx`
- [ ] Criar `PageLayout.tsx`
- [ ] Atualizar `Toast.tsx` com novas cores

### Fase 4: Refatorar Páginas (uma de cada vez)
- [ ] Dashboard.tsx
- [ ] Inventory.tsx
- [ ] Battle.tsx
- [ ] BattleFarm.tsx
- [ ] Quests.tsx
- [ ] Crafting.tsx
- [ ] Marketplace.tsx
- [ ] Dungeons.tsx
- [ ] Gathering.tsx
- [ ] CharacterSelection.tsx
- [ ] CharacterCreation.tsx
- [ ] Login.tsx
- [ ] Register.tsx

### Fase 5: Polish
- [ ] Testar responsividade mobile
- [ ] Verificar acessibilidade (contraste, aria-labels)
- [ ] Adicionar micro-animações
- [ ] Documentar componentes

---

## 📊 Métricas de Sucesso

- ✅ 0 cores hardcoded (todas via tokens)
- ✅ 0 botões inline (todos via Button component)
- ✅ 0 modais inline (todos via Modal component)
- ✅ Todas as páginas com PageLayout
- ✅ Contraste WCAG AAA
- ✅ Mobile responsivo 100%
- ✅ Componentes documentados

---

## 🚀 Próximos Passos Imediatos

1. ✅ Criar este documento
2. ⏭️ Atualizar `tailwind.config.js`
3. ⏭️ Criar componentes UI base
4. ⏭️ Criar PageLayout e Navbar
5. ⏭️ Refatorar Dashboard (teste piloto)
6. ⏭️ Aplicar para todas as páginas

---

**Estimativa de Tempo**: 4-6 horas  
**Impacto**: 🔥 ALTO - Melhora significativa em UX e manutenibilidade
