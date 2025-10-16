# ⚡ DEPLOY ULTRA-RÁPIDO - 5 MINUTOS

## 🚀 FRONTEND NO VERCEL

### Via Web (Clique e Pronto):
1. 🌐 Acesse: https://vercel.com/new
2. 🔐 Login com GitHub
3. 📦 Selecione repositório `easycraft`
4. ⚙️ Configure:
   ```
   Root Directory: frontend
   Framework: Vite
   Build: npm run build
   Output: dist
   ```
5. 🔑 Adicione variável:
   ```
   VITE_API_BASE_URL = http://localhost:3001/api
   ```
6. 🚀 Clique em "Deploy"
7. ⏰ Aguarde 2 minutos
8. ✅ PRONTO! Copie a URL

---

## 🎮 TESTANDO

Depois do deploy:
1. Abra a URL que o Vercel deu
2. **IMPORTANTE**: O jogo vai funcionar PARCIALMENTE
3. **Por quê?** Backend ainda está local (localhost:3001)

### O que funciona SEM backend:
- ✅ Interface visual
- ✅ Páginas de login/registro (UI)
- ✅ Navegação

### O que NÃO funciona (ainda):
- ❌ Login real
- ❌ Criar personagem
- ❌ Jogar

---

## 🔧 PRÓXIMO PASSO

Depois do frontend no ar, precisamos:
1. 🚂 Deploy Backend no Railway
2. 🔗 Conectar frontend ao backend
3. 🎉 Jogo 100% funcional!

---

## 📊 STATUS ATUAL

```
✅ Frontend preparado para deploy
⏳ Vercel CLI instalando...
⏸️ Aguardando deploy
```

---

**🎯 DICA**: Use a **Opção Web** se for sua primeira vez. É mais visual e fácil!
