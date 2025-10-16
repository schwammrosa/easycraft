# 📦 Dependências Necessárias para o Novo Sistema de UI

## ⚠️ AÇÃO NECESSÁRIA

Execute este comando no diretório `frontend`:

```bash
npm install clsx tailwind-merge
```

## 📋 Detalhes das Dependências

### **clsx** (v2.x)
- **Uso**: Utilitário para construção condicional de classNames
- **Tamanho**: ~1KB
- **Onde é usado**: `utils/cn.ts`

### **tailwind-merge** (v2.x)
- **Uso**: Merge inteligente de classes Tailwind (resolve conflitos)
- **Tamanho**: ~8KB
- **Onde é usado**: `utils/cn.ts`

## 🔍 Por que essas libs?

```tsx
// Sem as libs (problemático)
<div className={`base-class ${isActive ? 'active' : ''} ${error ? 'error' : ''}`} />
// Pode ter conflitos: "bg-red-500 bg-blue-500" - qual ganha?

// Com clsx + tailwind-merge (ideal)
<div className={cn('base-class', isActive && 'active', error && 'error')} />
// Resolve conflitos automaticamente
```

## ✅ Após Instalar

1. Reinicie o dev server:
```bash
npm run dev
```

2. Teste o Dashboard refatorado em:
```
http://localhost:5173/dashboard
```

3. Verifique se não há erros no console

## 📊 Tamanho Total Adicionado

- **clsx**: ~1KB
- **tailwind-merge**: ~8KB
- **TOTAL**: ~9KB (minificado + gzipped)

**Impacto no bundle**: Mínimo (< 0.5% do bundle total)
