# 🖼️ Como Adicionar Imagens aos Personagens

## 📋 Resumo

Este guia explica como adicionar imagens/sprites para as partes customizáveis dos personagens (head, arms, legs, feet).

---

## 📁 1. Criar Estrutura de Pastas

**No diretório raiz do projeto (`d:\Projeto\easycraft\backend`), crie:**

```
backend/
├── assets/                    ⬅️ CRIAR ESTA PASTA
│   └── characters/            ⬅️ CRIAR ESTA PASTA
│       ├── head/              ⬅️ CRIAR ESTA PASTA
│       ├── arms/              ⬅️ CRIAR ESTA PASTA
│       ├── legs/              ⬅️ CRIAR ESTA PASTA
│       └── feet/              ⬅️ CRIAR ESTA PASTA
```

**Comando PowerShell (Execute na raiz do projeto):**

```powershell
cd backend
New-Item -Path "assets\characters\head" -ItemType Directory -Force
New-Item -Path "assets\characters\arms" -ItemType Directory -Force
New-Item -Path "assets\characters\legs" -ItemType Directory -Force
New-Item -Path "assets\characters\feet" -ItemType Directory -Force
```

---

## 📐 2. Especificações das Imagens

### **Tamanho Recomendado**
```
Tamanho: 128x128 pixels
Formato: PNG com fundo transparente
DPI: 72 (padrão web)
```

### **Alternativas:**
- **Pixel Art Clássico**: 32x32px ou 64x64px
- **Retro/8-bit**: 64x64px
- **HD**: 256x256px
- **Alta Qualidade**: 512x512px

**👉 Recomendo começar com 128x128px - ótimo equilíbrio!**

---

## 🎨 3. Nomenclatura dos Arquivos

Cada pasta deve conter **6 variantes** nomeadas assim:

### **Head (Cabeça)**
```
backend/assets/characters/head/
├── variant1.png
├── variant2.png
├── variant3.png
├── variant4.png
├── variant5.png
└── variant6.png
```

### **Arms (Braços)**
```
backend/assets/characters/arms/
├── variant1.png
├── variant2.png
├── variant3.png
├── variant4.png
├── variant5.png
└── variant6.png
```

### **Legs (Pernas)**
```
backend/assets/characters/legs/
├── variant1.png
├── variant2.png
├── variant3.png
├── variant4.png
├── variant5.png
└── variant6.png
```

### **Feet (Pés)**
```
backend/assets/characters/feet/
├── variant1.png
├── variant2.png
├── variant3.png
├── variant4.png
├── variant5.png
└── variant6.png
```

**Total: 24 imagens (6 variantes × 4 partes)**

---

## 🌐 4. URLs das Imagens

Após configurar, as imagens estarão disponíveis em:

```
http://localhost:3001/assets/characters/head/variant1.png
http://localhost:3001/assets/characters/head/variant2.png
http://localhost:3001/assets/characters/arms/variant1.png
...
```

**Em produção (Render):**
```
https://easycraft-backend.onrender.com/assets/characters/head/variant1.png
```

---

## 💻 5. Atualizar o Frontend (CharacterCreation.tsx)

Substitua o emoji 🎮 por uma imagem real:

### **Antes:**
```tsx
<div className="w-48 h-48 bg-bg-input rounded-full flex items-center justify-center text-8xl">
  🎮
</div>
```

### **Depois:**
```tsx
<div className="w-48 h-48 bg-bg-input rounded-lg flex items-center justify-center overflow-hidden">
  <img 
    src={`${import.meta.env.VITE_ASSETS_BASE_URL}/characters/head/${headVariant}.png`}
    alt={`Preview ${headVariant}`}
    className="w-full h-full object-contain"
    onError={(e) => {
      // Fallback se imagem não carregar
      e.currentTarget.src = 'https://via.placeholder.com/128?text=No+Image';
    }}
  />
</div>
```

---

## 🔧 6. Atualizar Variáveis de Ambiente

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ASSETS_BASE_URL=http://localhost:3001/assets
```

**Backend `.env`:**
```env
ASSETS_BASE_URL=http://localhost:3001/assets
```

---

## 🎨 7. Onde Encontrar Imagens de Teste

### **Opção 1: Pixel Art Generators**
- https://www.piskelapp.com/ (criar sprites online)
- https://lospec.com/pixel-editor (editor de pixel art)

### **Opção 2: Assets Gratuitos**
- https://itch.io/game-assets/free (assets de jogos grátis)
- https://opengameart.org/ (arte livre para jogos)
- https://kenney.nl/ (assets 2D/3D gratuitos)

### **Opção 3: Placeholder Temporário**
- https://via.placeholder.com/128 (gerar imagens temporárias)
- Usar emojis convertidos para PNG

### **Opção 4: IA Generators**
- DALL-E 3, Midjourney, Stable Diffusion
- Prompt: "pixel art character head sprite, 128x128, transparent background"

---

## 🧪 8. Testar Localmente

1. **Adicionar imagens nas pastas:**
   - Coloque pelo menos 1 variante em cada pasta para teste

2. **Reiniciar o backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Acessar diretamente:**
   ```
   http://localhost:3001/assets/characters/head/variant1.png
   ```

4. **Verificar no frontend:**
   - Acesse a página de criação de personagem
   - Selecione diferentes variantes
   - Veja a imagem mudar em tempo real

---

## 📦 9. Deploy em Produção (Render)

### **No Render, você tem 2 opções:**

### **Opção A: Commit no Git (Recomendado para teste)**
```bash
cd backend
git add assets/
git commit -m "Add character sprites"
git push
```

### **Opção B: Usar Storage Externo (Produção)**
- AWS S3
- Cloudinary
- ImgBB
- Firebase Storage

---

## 🎨 10. Exemplo Completo de Componente

```tsx
// CharacterCreation.tsx - Preview com todas as partes
<div className="relative w-64 h-64 bg-bg-input rounded-lg overflow-hidden">
  {/* Corpo base (opcional) */}
  <img 
    src={`${ASSETS_URL}/characters/base/body.png`}
    className="absolute inset-0 w-full h-full object-contain"
    alt="Body"
  />
  
  {/* Head */}
  <img 
    src={`${ASSETS_URL}/characters/head/${headVariant}.png`}
    className="absolute inset-0 w-full h-full object-contain"
    alt="Head"
  />
  
  {/* Arms */}
  <img 
    src={`${ASSETS_URL}/characters/arms/${armsVariant}.png`}
    className="absolute inset-0 w-full h-full object-contain"
    alt="Arms"
  />
  
  {/* Legs */}
  <img 
    src={`${ASSETS_URL}/characters/legs/${legsVariant}.png`}
    className="absolute inset-0 w-full h-full object-contain"
    alt="Legs"
  />
  
  {/* Feet */}
  <img 
    src={`${ASSETS_URL}/characters/feet/${feetVariant}.png`}
    className="absolute inset-0 w-full h-full object-contain"
    alt="Feet"
  />
</div>
```

---

## ✅ Checklist

- [ ] Criar pasta `backend/assets/characters/head`
- [ ] Criar pasta `backend/assets/characters/arms`
- [ ] Criar pasta `backend/assets/characters/legs`
- [ ] Criar pasta `backend/assets/characters/feet`
- [ ] Adicionar 6 imagens em cada pasta (variant1.png até variant6.png)
- [ ] Verificar que todas são PNG com transparência
- [ ] Verificar tamanho 128x128px
- [ ] Reiniciar backend (`npm run dev`)
- [ ] Testar URL: `http://localhost:3001/assets/characters/head/variant1.png`
- [ ] Atualizar componente CharacterCreation.tsx
- [ ] Testar preview em tempo real

---

## 🐛 Troubleshooting

### **Imagens não aparecem:**
1. Verificar se o backend está rodando
2. Abrir DevTools (F12) → Network → Ver se há erro 404
3. Verificar se os nomes dos arquivos estão corretos (case-sensitive)
4. Verificar se o CORS está configurado

### **Imagens aparecem cortadas:**
- Ajustar `object-contain` ou `object-cover`
- Verificar proporção da imagem (deve ser quadrada 1:1)

### **Performance lenta:**
- Comprimir imagens (usar TinyPNG.com)
- Reduzir resolução para 64x64px ou 128x128px
- Considerar usar sprites sheets no futuro

---

## 📝 Próximos Passos

1. **Sistema de Composição**: Combinar múltiplas partes em uma única imagem
2. **Sprite Sheets**: Otimizar carregamento com uma única imagem
3. **Animações**: Adicionar idle/walk animations
4. **CDN**: Mover para Cloudinary ou S3 em produção
5. **Cache**: Implementar cache de imagens no frontend

---

**Status**: ✅ Backend configurado e pronto para receber imagens
**Próximo**: Adicionar as imagens nas pastas e testar!
