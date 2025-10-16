# 🚀 DEPLOY RÁPIDO NO VERCEL - PASSO A PASSO

## 🎯 Opção 1: Deploy via Interface Web (MAIS FÁCIL)

### Passo 1: Acessar Vercel
1. Vá para: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Conecte com sua conta GitHub

### Passo 2: Importar Projeto
1. Clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **easycraft**
3. Clique em **"Import"**

### Passo 3: Configurar Projeto
**Configure assim:**

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Passo 4: Variáveis de Ambiente
Adicione esta variável:
```
Name: VITE_API_BASE_URL
Value: http://localhost:3001/api
```

**IMPORTANTE**: Depois que o backend estiver no Railway, você vai mudar para a URL do Railway.

### Passo 5: Deploy!
1. Clique em **"Deploy"**
2. Aguarde ~2 minutos
3. Seu jogo estará ONLINE! 🎉

---

## 🎯 Opção 2: Deploy via CLI (RÁPIDO)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Login
```bash
vercel login
```

### Passo 3: Deploy
```bash
cd D:\Projeto\easycraft\frontend
vercel --prod
```

### Passo 4: Responder Perguntas
```
? Set up and deploy "frontend"? Y
? Which scope? (escolha sua conta)
? Link to existing project? N
? What's your project's name? easycraft
? In which directory is your code located? ./
? Want to override the settings? N
```

### Passo 5: Aguardar
```
✅ Deployment ready!
🔗 https://easycraft-xxx.vercel.app
```

---

## ⚙️ DEPOIS DO DEPLOY

### 1. Configurar Domínio Customizado (Opcional)
1. No painel Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio: `easycraft.com`
3. Configure DNS conforme instruções

### 2. Atualizar API URL
Quando o backend estiver online:
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Edite `VITE_API_BASE_URL`
3. Mude para: `https://seu-backend.railway.app/api`
4. Clique em **"Redeploy"**

### 3. Testar o Jogo
1. Acesse a URL do Vercel
2. Registre uma conta
3. Crie um personagem
4. Jogue! 🎮

---

## ❌ PROBLEMAS COMUNS

### Erro 404
- **Causa**: Configuração de rotas
- **Solução**: Já criamos `vercel.json` com rewrites

### Build Failed
- **Causa**: Erro de TypeScript
- **Solução**: Execute `npm run build` localmente primeiro

### API não conecta
- **Causa**: VITE_API_BASE_URL errado
- **Solução**: Verifique a variável de ambiente

---

## 📊 MONITORAMENTO

### Ver Logs
```bash
vercel logs
```

### Ver Analytics
Dashboard Vercel → Analytics

### Ver Deploy Status
Dashboard Vercel → Deployments

---

## 🎉 PRONTO!

Seu jogo está ONLINE em:
🌐 https://easycraft.vercel.app

**Compartilhe com amigos e comece a receber feedback!**

---

## 🔄 REDEPLOYING

Toda vez que você fizer push pro GitHub, o Vercel vai **automaticamente redesenhar**!

```bash
git add .
git commit -m "feat: nova feature"
git push origin main
# Vercel já está fazendo deploy! 🚀
```

---

**🎊 PARABÉNS! SEU JOGO ESTÁ NO AR! 🎊**
