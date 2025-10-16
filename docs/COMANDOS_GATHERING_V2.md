# 🚀 Comandos para Ativar Gathering v2.0

## ⚠️ IMPORTANTE: Rode os comandos nesta ordem!

---

## 1️⃣ Gerar Tipos do Prisma

```powershell
cd backend
npx prisma generate
```

**O que faz**: Atualiza os types do TypeScript baseado no schema.prisma atualizado

---

## 2️⃣ Rodar Migration

```powershell
npx prisma migrate deploy
```

**O que faz**: Aplica a migration que:
- Renomeia `energy_cost` → `gold_cost`
- Renomeia `energy_used` → `gold_spent`
- Adiciona coluna `gold_refunded`

---

## 3️⃣ Atualizar Seed (Opcional mas Recomendado)

```powershell
npx prisma db seed
```

**O que faz**: Atualiza os 15 nodos com goldCost correto

---

## 4️⃣ Reiniciar Backend

```powershell
npm run dev
```

**O que faz**: Reinicia o servidor com as novas mudanças

---

## 5️⃣ Reiniciar Frontend (Nova aba/terminal)

```powershell
cd frontend
npm run dev
```

**O que faz**: Reinicia o frontend com UI atualizada

---

## ✅ Verificar se Funcionou

### **No Terminal:**
- Backend deve iniciar sem erros TypeScript
- Não deve ter erros de "Property 'energyCost' does not exist"

### **No Jogo:**
1. Faça login
2. Vá para "🌲 Coleta"
3. Selecione um nodo
4. Veja se aparece:
   - "Gold/Coleta" (não "Energia")
   - "💰 Custo Total"
   - "Será cobrado antes de iniciar"
   - Verificação de gold suficiente

### **Teste Completo:**
1. Selecione nodo "Carvalho" (5g)
2. Configure 10 coletas
3. Veja "Custo Total: 50g"
4. Clique "Iniciar Coleta"
5. Seu gold deve diminuir 50g imediatamente
6. Coleta deve iniciar normalmente

---

## 🐛 Se Der Erro

### **Erro: "Property 'energyCost' does not exist"**
```powershell
cd backend
npx prisma generate
```

### **Erro: "Migration already applied"**
```powershell
# Já foi aplicada, tudo certo! Continue para o próximo passo
```

### **Erro: "Cannot find module '@prisma/client'"**
```powershell
cd backend
npm install
npx prisma generate
```

### **Banco de Dados Não Atualizado**
```powershell
# Forçar migration
cd backend
npx prisma migrate reset
npx prisma db seed
```
⚠️ **ATENÇÃO**: `migrate reset` apaga TODOS os dados!

---

## 📝 Comandos Completos (Copie e Cole)

```powershell
# 1. Backend - Prisma
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 2. Reiniciar Backend
npm run dev

# 3. Frontend (em outro terminal)
cd frontend
npm run dev
```

---

## 🎯 O Que Esperar

### **Mudanças Visíveis:**
✅ Label "Gold/Coleta" ao invés de "Energia"
✅ Box amarelo mostrando "💰 Custo Total"
✅ Aviso "Será cobrado antes de iniciar"
✅ Validação de gold suficiente
✅ Gold descontado ANTES da coleta iniciar

### **Comportamento Novo:**
✅ Cancelar coleta:
  - Perde 50% XP (antes 30%)
  - Perde 50% items coletados (novo!)
  - Recebe 50% gold de volta (novo!)

---

## 📊 Status Esperado

```
✅ Migration aplicada
✅ Prisma types gerados
✅ Backend rodando sem erros
✅ Frontend exibindo novo UI
✅ Sistema funcionando com gold
```

---

**Depois de rodar tudo, teste no jogo e veja a mágica acontecer! 🎉**
