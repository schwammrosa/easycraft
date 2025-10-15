# EasyCraft - Design de UI/UX

## 🎨 Princípios de Design

### 1. Minimalismo Funcional
- Interface limpa sem distrações
- Informações importantes sempre visíveis
- Navegação intuitiva e direta

### 2. Feedback Imediato
- Ações do usuário têm resposta visual instantânea
- Loading states claros
- Confirmações para ações irreversíveis

### 3. Acessibilidade
- Contraste adequado (WCAG AA mínimo)
- Textos legíveis (mínimo 14px)
- Navegação por teclado funcional
- Responsivo (desktop-first, mas mobile-friendly)

### 4. Estética Nostálgica
- Inspiração em MMORPGs clássicos (RuneScape, Tibia)
- Pixel art ou sprites simples
- Paleta de cores vibrante mas agradável

---

## 🎭 Paleta de Cores

### Cores Primárias
```css
--primary-dark: #2c3e50      /* Azul escuro (backgrounds) */
--primary-medium: #34495e    /* Azul médio (painéis) */
--primary-light: #4a6278     /* Azul claro (hovers) */
```

### Cores de Acento
```css
--accent-gold: #f39c12       /* Ouro (moeda, destaques) */
--accent-green: #27ae60      /* Verde (sucesso, HP) */
--accent-red: #e74c3c        /* Vermelho (perigo, dano) */
--accent-blue: #3498db       /* Azul (ações, links) */
--accent-purple: #9b59b6     /* Roxo (especial, raro) */
```

### Cores de UI
```css
--bg-main: #1a1a2e           /* Background principal */
--bg-panel: #16213e          /* Painéis/Cards */
--bg-input: #0f3460          /* Inputs */
--text-primary: #eaeaea      /* Texto principal */
--text-secondary: #a8a8a8    /* Texto secundário */
--border: #2c3e50            /* Bordas */
```

### Raridades de Item
```css
--common: #9e9e9e            /* Comum (cinza) */
--uncommon: #4caf50          /* Incomum (verde) */
--rare: #2196f3              /* Raro (azul) */
--epic: #9c27b0              /* Épico (roxo) */
--legendary: #ff9800         /* Lendário (laranja) */
```

---

## 📐 Layout e Estrutura

### Grid System
- Container máximo: 1400px
- Gutter: 16px
- Breakpoints:
  - Desktop: 1024px+
  - Tablet: 768px - 1023px
  - Mobile: < 768px

### Espaçamento
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Tipografia
```css
/* Font Family */
--font-primary: 'Inter', sans-serif
--font-display: 'Press Start 2P', monospace /* Optional pixel font */

/* Font Sizes */
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 32px

/* Font Weights */
--weight-normal: 400
--weight-medium: 500
--weight-bold: 700
```

---

## 📱 Telas e Componentes

### 1. Landing Page

**Objetivo**: Apresentar o jogo e converter visitantes em jogadores

**Elementos**:
- Hero section com logo e tagline
- "Jogar Agora" CTA proeminente
- Preview de gameplay (screenshots)
- Features principais (3-4 cards)
- Testemunhos/estatísticas (fase pós-MVP)
- Footer com links

**Layout**:
```
+--------------------------------+
|          EASYCRAFT             |
|    MMORPG Minimalista Web      |
|   [Jogar Agora] [Sobre]        |
+--------------------------------+
|                                |
|      Hero Image/Animation      |
|                                |
+--------------------------------+
|  [Feature 1] [Feature 2]       |
|  [Feature 3] [Feature 4]       |
+--------------------------------+
```

---

### 2. Login / Register

**Objetivo**: Autenticação rápida e segura

**Elementos**:
- Formulário centralizado
- Toggle entre Login/Register
- Validação em tempo real
- Feedback de erros claro
- Link "Esqueci senha" (futuro)

**Layout**:
```
+--------------------------------+
|          EASYCRAFT             |
|                                |
|   +----------------------+     |
|   |  [Login] [Registrar] |     |
|   |                      |     |
|   |  Email: [_______]    |     |
|   |  Senha: [_______]    |     |
|   |                      |     |
|   |      [Entrar]        |     |
|   +----------------------+     |
|                                |
+--------------------------------+
```

---

### 3. Character Creation

**Objetivo**: Criar personagem de forma visual e interativa

**Elementos**:
- Preview do avatar (centro, grande)
- Seletores de camadas (head, arms, legs, feet)
- Input de nome com validação
- Preview em tempo real ao trocar partes
- Botão "Criar Personagem"

**Layout**:
```
+--------------------------------+
|  Criar Personagem              |
+--------------------------------+
|                |               |
|   AVATAR       |  Cabeça:      |
|   PREVIEW      |  [< > ] 1/6   |
|   [figura]     |               |
|                |  Braços:      |
|                |  [< > ] 1/6   |
|                |               |
|                |  Pernas:      |
|                |  [< > ] 1/6   |
|                |               |
|                |  Pés:         |
|                |  [< > ] 1/6   |
+----------------+---------------+
|  Nome: [____________]          |
|         [Criar Personagem]     |
+--------------------------------+
```

**Interação**:
- Setas < > navegam entre variantes
- Preview atualiza instantaneamente
- Nome valida em tempo real (disponibilidade)

---

### 4. Dashboard / HUD Principal

**Objetivo**: Hub central com acesso a todas funcionalidades

**Elementos**:
- Header: Avatar, Level, XP bar, Gold
- Barra de HP (se aplicável)
- Grid de ações principais (6-8 botões)
- Notificações/Alerts (canto superior direito)
- Chat (lateral direita - futuro)

**Layout**:
```
+----------------------------------------+
| [Avatar] ZéCraft Lv5    🟡 1,200 Gold |
| ████████████░░░ 450/625 XP             |
| ❤️ 55/60 HP                            |
+----------------------------------------+
|                                        |
|  +--------+  +--------+  +--------+    |
|  | ⚔️     |  | 🎒     |  | 🏪     |    |
|  | Batalha|  | Invent.|  | Loja   |    |
|  +--------+  +--------+  +--------+    |
|                                        |
|  +--------+  +--------+  +--------+    |
|  | 🛠️     |  | ⛏️     |  | 🎯     |    |
|  | Craft  |  | Coleta |  | Missões|    |
|  +--------+  +--------+  +--------+    |
|                                        |
+----------------------------------------+
```

---

### 5. Batalha

**Objetivo**: Iniciar combate e visualizar resultado

**Tela de Seleção**:
```
+--------------------------------+
| ⚔️ Selecionar Batalha          |
+--------------------------------+
|                                |
|  [ ] Floresta (Lv 1-3)         |
|      Goblins, Lobos            |
|      Recompensa: Baixa         |
|                                |
|  [ ] Caverna (Lv 4-7)          |
|      Morcegos, Trolls          |
|      Recompensa: Média         |
|                                |
|  [ ] Ruínas (Lv 8+)            |
|      Esqueletos, Espectros     |
|      Recompensa: Alta          |
|                                |
|      [Iniciar Batalha]         |
+--------------------------------+
```

**Tela de Resultado**:
```
+--------------------------------+
| ⚔️ Resultado da Batalha        |
+--------------------------------+
|                                |
|  🎉 VITÓRIA!                   |
|                                |
|  Turno 1: Você atacou! 12 dano|
|  Turno 2: Goblin atacou! 5 dano|
|  Turno 3: Você atacou! CRÍTICO!|
|           24 dano              |
|  Inimigo derrotado!            |
|                                |
|  📊 Recompensas:               |
|  +35 XP   +12 Gold             |
|  +2x Iron Ore                  |
|                                |
|  [Batalhar Novamente] [Voltar] |
+--------------------------------+
```

---

### 6. Inventário

**Objetivo**: Gerenciar itens e equipamentos

**Layout**:
```
+----------------------------------------+
| 🎒 Inventário (12/50 slots)            |
+----------------------------------------+
|  EQUIPADO         |  ITENS             |
|                   |                    |
|   Arma:           | [🗡️][🗡️][  ][  ] |
|   [Iron Sword]    | Iron  Iron          |
|                   | Sword Sword         |
|   Cabeça:         |                    |
|   [Vazio]         | [⛏️][🪵][  ][  ] |
|                   | Iron  Wood          |
|   Torso:          | Pick  x24           |
|   [Vazio]         |                    |
|                   | [🧪][  ][  ][  ] |
|   Pernas:         | HP              |
|   [Vazio]         | Pot.              |
|                   |                    |
|   Pés:            | ...                |
|   [Vazio]         |                    |
|                   |                    |
| STATUS:           |                    |
| STR: 8 (+3)       |  [Filtros▼]        |
| AGI: 6            |  [Ordenar▼]        |
| VIT: 10           |                    |
| INT: 4            |                    |
| DEF: 5            |                    |
+-------------------+--------------------+
```

**Interações**:
- Hover em item: Mostra tooltip com detalhes
- Click: Abre menu contextual (Equipar/Usar/Vender/Dropar)
- Drag & drop para equipar (opcional)

---

### 7. Loja / Marketplace

**Objetivo**: Comprar e vender itens

**Tabs**:
- Mercado de Jogadores
- Vender para NPCs
- Meus Anúncios

**Layout (Mercado de Jogadores)**:
```
+----------------------------------------+
| 🏪 Mercado                              |
| [Mercado] [Vender NPC] [Meus Anúncios] |
+----------------------------------------+
| Buscar: [_________] [Tipo▼] [Preço▼]  |
+----------------------------------------+
|                                        |
| [🗡️] Iron Sword       x1    60 Gold   |
|      Vendedor: PlayerX                 |
|      [Comprar]                         |
|                                        |
| [⛏️] Iron Pickaxe     x1    80 Gold   |
|      Vendedor: Miner99                 |
|      [Comprar]                         |
|                                        |
| [🪵] Wood             x50   100 Gold   |
|      Vendedor: Logger                  |
|      [Comprar]                         |
|                                        |
| ... (mais 17 itens)                    |
|                                        |
| Página 1 de 8   [<] [>]                |
+----------------------------------------+
```

**Modal de Venda**:
```
+--------------------------------+
| Criar Anúncio                  |
+--------------------------------+
| Item: [Iron Ore     ▼]         |
| Quantidade: [5____] (max: 24)  |
| Preço/un: [8______] Gold       |
|                                |
| Total a receber: 40 Gold       |
| Taxa (5%): -2 Gold             |
| Você recebe: 38 Gold           |
|                                |
|    [Cancelar]  [Confirmar]     |
+--------------------------------+
```

---

### 8. Craft

**Objetivo**: Criar itens a partir de materiais

**Layout**:
```
+----------------------------------------+
| 🛠️ Crafting                             |
+----------------------------------------+
| Buscar: [_______] [Categoria▼]         |
+----------------------------------------+
|  RECEITAS        |  DETALHES           |
|                  |                     |
| [✓] Iron Sword   | 🗡️ Iron Sword       |
| [✓] Iron Pick    |                     |
| [✗] Steel Sword  | Materiais:          |
| [✓] HP Potion    | ✓ 3x Iron Ingot    |
|                  | ✓ 1x Wood           |
|                  |                     |
|                  | Resultado:          |
|                  | 1x Iron Sword       |
|                  | +3 STR              |
|                  |                     |
|                  | [Craftar]           |
|                  |                     |
| ✓ Pode craftar   | Tempo: Instantâneo  |
| ✗ Falta material |                     |
+------------------+---------------------+
```

---

### 9. Missões (Quests)

**Objetivo**: Ver e completar missões

**Layout**:
```
+----------------------------------------+
| 🎯 Missões                              |
+----------------------------------------+
| [Disponíveis] [Em Andamento] [Completas]|
+----------------------------------------+
|                                        |
| 🟢 Ferreiro Necessitado        [Ativo] |
|    O ferreiro precisa de minério       |
|    ➤ Coletar 10x Iron Ore (6/10)       |
|    💰 50 Gold  ⭐ 100 XP                |
|                                        |
| 🟡 Caçador Iniciante     [Disponível]  |
|    Derrote 5 Goblins                   |
|    ➤ Derrotar Goblins (0/5)            |
|    💰 100 Gold  ⭐ 150 XP               |
|    [Aceitar]                           |
|                                        |
| ✓ Primeira Batalha        [Completa]   |
|    Vença sua primeira batalha          |
|    💰 20 Gold recebidos                |
|                                        |
+----------------------------------------+
```

---

### 10. Coleta

**Objetivo**: Coletar recursos naturais

**Layout**:
```
+--------------------------------+
| ⛏️ Coleta de Recursos          |
+--------------------------------+
|                                |
| [ ] Mina de Ferro              |
|     Recursos: Iron Ore, Coal   |
|     Cooldown: 10s              |
|     [Coletar]                  |
|                                |
| [ ] Floresta                   |
|     Recursos: Wood, Herbs      |
|     ⏱️ Disponível em: 5s       |
|     [Coletar]                  |
|                                |
| [ ] Lago                       |
|     Recursos: Fish             |
|     Nível 5 necessário         |
|     [Bloqueado]                |
|                                |
+--------------------------------+
```

**Resultado de Coleta**:
```
+--------------------------------+
| ⛏️ Coleta Concluída!           |
+--------------------------------+
|                                |
|  Você coletou:                 |
|  +2x Iron Ore                  |
|  +1x Coal                      |
|                                |
|  Próxima coleta em: 10s        |
|                                |
|      [Continuar Coletando]     |
|            [Voltar]            |
+--------------------------------+
```

---

## 🧩 Componentes Reutilizáveis

### Button
```tsx
// Variantes: primary, secondary, danger, success
// Tamanhos: sm, md, lg
<Button variant="primary" size="md">
  Confirmar
</Button>
```

### Card/Panel
```tsx
<Card title="Inventário" icon="🎒">
  {children}
</Card>
```

### Stat Bar
```tsx
<StatBar 
  label="HP" 
  current={55} 
  max={60} 
  color="green"
/>

<StatBar 
  label="XP" 
  current={450} 
  max={625} 
  color="blue"
  showPercentage
/>
```

### Item Slot
```tsx
<ItemSlot 
  item={ironSword}
  quantity={1}
  onClick={handleClick}
  showTooltip
/>
```

### Avatar Display
```tsx
<AvatarDisplay
  head="head_01"
  arms="arms_03"
  legs="legs_02"
  feet="feet_01"
  size="large"
/>
```

### Modal
```tsx
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmar Ação"
>
  {children}
</Modal>
```

### Toast Notification
```tsx
toast.success("Item equipado com sucesso!");
toast.error("Ouro insuficiente");
toast.info("Nova missão disponível");
```

---

## 📊 Estados de UI

### Loading
- Spinner centralizado para carregamento de página
- Skeleton screens para listas
- Inline spinners para ações

### Empty States
- Mensagem amigável quando não há dados
- CTA para ação relevante
- Ilustração opcional

### Error States
- Mensagem clara do problema
- Sugestão de ação (retry, voltar)
- Evitar jargão técnico

### Success States
- Feedback visual positivo
- Som opcional (futuro)
- Animação sutil (fadeIn, bounce)

---

## 🔔 Notificações e Feedback

### Tipos
1. **Toast**: Notificações temporárias (3-5s)
2. **Alert**: Avisos importantes persistentes
3. **Modal**: Confirmações que bloqueiam ação
4. **Badge**: Contadores (novas mensagens, itens)

### Exemplos
- "Você subiu para o nível 6!" (success toast)
- "Ouro insuficiente para esta compra" (error toast)
- "Tem certeza que deseja deletar este personagem?" (modal de confirmação)
- Badge vermelho com "3" em aba de missões completas

---

## 🎬 Animações e Transições

### Princípios
- **Sutis**: Não distrair do conteúdo
- **Rápidas**: 200-300ms máximo
- **Propositadas**: Guiar atenção

### Transições Comuns
```css
/* Fade In */
.fade-enter { opacity: 0; }
.fade-enter-active { opacity: 1; transition: 200ms; }

/* Slide Down */
.slide-enter { transform: translateY(-20px); opacity: 0; }
.slide-enter-active { 
  transform: translateY(0); 
  opacity: 1; 
  transition: 250ms ease-out; 
}

/* Scale In */
.scale-enter { transform: scale(0.95); opacity: 0; }
.scale-enter-active { 
  transform: scale(1); 
  opacity: 1; 
  transition: 200ms; 
}
```

### Microinterações
- Hover em botões: lift (translateY(-2px))
- Click em botões: press (scale(0.98))
- Item adquirido: bounce
- Dano recebido: shake (horizontal)

---

## 📱 Responsividade

### Desktop (1024px+)
- Layout principal: Sidebar + Content
- Grid de itens: 4-5 colunas
- Tooltips ricos com detalhes

### Tablet (768px - 1023px)
- Layout: Tabs + Content empilhado
- Grid de itens: 3 colunas
- Hamburger menu opcional

### Mobile (< 768px)
- Layout: Single column, stack tudo
- Navegação: Bottom nav ou hamburger
- Grid de itens: 2 colunas
- Tooltips simplificados
- Font sizes: +2px (melhor legibilidade)

---

## ♿ Acessibilidade

### Checklist
- [ ] Contraste mínimo 4.5:1 para texto
- [ ] Foco visível em todos elementos interativos
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Labels em todos inputs
- [ ] Alt text em imagens significativas
- [ ] ARIA labels quando necessário
- [ ] Estrutura semântica (headings h1-h6)
- [ ] Não depender apenas de cor para informação

---

## 🎯 Performance

### Otimizações
- Lazy loading de imagens
- Code splitting por rota
- Virtualização de listas longas (inventário, mercado)
- Debounce em busca/filtros
- Cache de avatares renderizados
- Compressão de assets (WebP para imagens)

### Métricas Alvo
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- TTI (Time to Interactive): < 3.5s
- Bundle size: < 300KB (gzipped)

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Especificação de design completa
