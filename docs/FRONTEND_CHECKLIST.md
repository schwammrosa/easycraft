# ✅ Checklist - Frontend Refactor

## 🎯 FASE 1: SETUP E TESTES (AGORA)

### **1. Instalar Dependências**
```bash
cd frontend
npm install clsx tailwind-merge
```
- [ ] Executar comando acima
- [ ] Verificar que instalou sem erros

---

### **2. Testar Dashboard Refatorado**
```bash
npm run dev
```
- [ ] Iniciar dev server
- [ ] Acessar `http://localhost:5173/login`
- [ ] Fazer login
- [ ] Acessar Dashboard
- [ ] Verificar visual melhorado
- [ ] Testar todos os botões de ação
- [ ] Testar botão "Distribuir Pontos" (se tiver)
- [ ] Verificar responsividade (resize da janela)
- [ ] Verificar console (sem erros)

---

### **3. Verificar Componentes Criados**
- [ ] Navbar aparece corretamente
- [ ] Cards com bordas e estilos corretos
- [ ] Botões com hover effects funcionando
- [ ] ProgressBar de HP animando
- [ ] Badges de nível e gold visíveis
- [ ] Ícones Lucide renderizando

---

## 🚀 FASE 2: MIGRAÇÃO DAS PÁGINAS (PRÓXIMO)

### **Ordem Sugerida de Migração:**

#### **Simples (1-2h total)**
- [ ] Login.tsx
- [ ] Register.tsx
- [ ] CharacterSelection.tsx

#### **Médias (3-4h total)**
- [ ] Inventory.tsx
- [ ] Battle.tsx
- [ ] Quests.tsx
- [ ] Crafting.tsx

#### **Complexas (4-5h total)**
- [ ] BattleFarm.tsx
- [ ] Marketplace.tsx
- [ ] Dungeons.tsx
- [ ] Gathering.tsx
- [ ] CharacterCreation.tsx

---

## 📋 PADRÃO DE MIGRAÇÃO

Para cada página:

1. **Adicionar imports**
```tsx
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
// ... outros conforme necessário
```

2. **Substituir wrapper principal**
```tsx
// De: <div className="min-h-screen bg-bg-main p-8">
// Para: <PageLayout title="Título" showBack={true}>
```

3. **Substituir botões inline**
```tsx
// De: <button className="px-4 py-2 bg-accent-blue...">
// Para: <Button variant="primary">
```

4. **Substituir cards/painéis**
```tsx
// De: <div className="bg-bg-panel rounded-lg p-6">
// Para: <Card><CardHeader title="..." /><CardBody>
```

5. **Substituir modais inline**
```tsx
// De: {show && <div className="fixed inset-0...">
// Para: <Modal isOpen={show} onClose={...}>
```

6. **Testar página**
- [ ] Visual correto
- [ ] Funcionalidade preservada
- [ ] Responsivo
- [ ] Sem erros no console

---

## 🎨 MELHORIAS VISUAIS OPCIONAIS

Após migração básica, considerar:

- [ ] Adicionar ícones Lucide nos botões
- [ ] Usar variantes "highlighted" em cards importantes
- [ ] Adicionar EmptyState onde aplicável
- [ ] Melhorar feedback visual (loading states)
- [ ] Adicionar micro-animações
- [ ] Melhorar mensagens de erro/sucesso

---

## 🧪 TESTES FINAIS

### **Desktop**
- [ ] Chrome/Edge (Windows)
- [ ] Firefox
- [ ] Safari (se disponível)

### **Mobile/Tablet**
- [ ] Chrome Mobile (DevTools)
- [ ] Safari Mobile (DevTools)
- [ ] Tablet view (DevTools)

### **Acessibilidade**
- [ ] Navegação por teclado (Tab)
- [ ] Leitores de tela (opcional)
- [ ] Contraste de cores (verificar com DevTools)
- [ ] Focus indicators visíveis

---

## 📊 MÉTRICAS DE SUCESSO

Ao final da migração, você deve ter:

- [ ] 0 cores hardcoded (ex: `bg-green-500` → usar tokens)
- [ ] 0 botões inline (todos via `<Button>`)
- [ ] 0 modais inline (todos via `<Modal>`)
- [ ] 100% páginas com `<PageLayout>`
- [ ] Redução de ~15-20% no total de linhas de código
- [ ] 0 erros no console
- [ ] Visual consistente em todas as páginas

---

## 🐛 TROUBLESHOOTING

### **Erro: "Cannot find module 'clsx'"**
```bash
npm install clsx tailwind-merge
```

### **Erro: "Button is not defined"**
Verificar import:
```tsx
import { Button } from '../components/ui/Button';
```

### **Tailwind classes não funcionam**
```bash
npm run dev # Reiniciar
```

### **Componente não aparece**
Verificar estrutura:
```tsx
<PageLayout title="Teste">  {/* ✅ Correto */}
  <Card>...</Card>
</PageLayout>

// NÃO:
<PageLayout title="Teste" />  {/* ❌ Sem children */}
```

---

## 📖 DOCUMENTAÇÃO

- **Plano Completo**: `docs/FRONTEND_REFACTOR_PLAN.md`
- **Implementação**: `docs/FRONTEND_REFACTOR_COMPLETE.md`
- **Resumo**: `docs/FRONTEND_SUMMARY.md`
- **Dependências**: `frontend/INSTALL_DEPENDENCIES.md`

---

## 🎓 RECURSOS

### **Componentes Criados**
- `Button` → `src/components/ui/Button.tsx`
- `Card` → `src/components/ui/Card.tsx`
- `Modal` → `src/components/ui/Modal.tsx`
- `Badge` → `src/components/ui/Badge.tsx`
- `ProgressBar` → `src/components/ui/ProgressBar.tsx`
- `EmptyState` → `src/components/EmptyState.tsx`
- `PageLayout` → `src/components/layout/PageLayout.tsx`
- `Navbar` → `src/components/layout/Navbar.tsx`

### **Dashboard Refatorado (Exemplo)**
Ver `src/pages/Dashboard.tsx` para referência completa

---

**Data**: 16/10/2025  
**Status**: ✅ Sistema Pronto | ⏳ Migração Pendente
