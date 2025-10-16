# 🚀 Quick Start - Adicionar Imagens de Personagens

## ✅ Backend já está configurado!

O código foi atualizado e está pronto para servir imagens.

---

## 📍 Onde Colocar as Imagens

```
backend/assets/characters/
├── head/variant1.png ← Coloque aqui
├── head/variant2.png ← Coloque aqui
├── head/variant3.png ← (até variant6.png)
├── arms/variant1.png ← Coloque aqui
├── legs/variant1.png ← Coloque aqui
└── feet/variant1.png ← Coloque aqui
```

**As pastas já foram criadas!** ✅

---

## 📐 Tamanho das Imagens

```
✅ RECOMENDADO: 128x128 pixels
✅ Formato: PNG com fundo transparente
✅ 24 imagens no total (6 variantes × 4 partes)
```

### Alternativas de Tamanho:
- **Pixel Art Retro**: 64x64px
- **HD**: 256x256px
- **Alta Qualidade**: 512x512px

---

## 🎨 Onde Encontrar Imagens para Teste

### 1️⃣ **Placeholder Rápido** (Para testar já):
```
https://via.placeholder.com/128/FF6B6B/FFFFFF?text=Head1
https://via.placeholder.com/128/4ECDC4/FFFFFF?text=Arms1
https://via.placeholder.com/128/45B7D1/FFFFFF?text=Legs1
https://via.placeholder.com/128/96CEB4/FFFFFF?text=Feet1
```

### 2️⃣ **Assets Gratuitos**:
- https://opengameart.org/
- https://itch.io/game-assets/free
- https://kenney.nl/

### 3️⃣ **Pixel Art Generators**:
- https://www.piskelapp.com/
- https://lospec.com/pixel-editor

---

## 🧪 Como Testar

1. **Adicione pelo menos 1 imagem** (variant1.png) em cada pasta
2. **Reinicie o backend**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Teste a URL diretamente no navegador**:
   ```
   http://localhost:3001/assets/characters/head/variant1.png
   ```
4. **Deve aparecer a imagem!** 🎉

---

## 🔗 Acessar as Imagens

### Local:
```
http://localhost:3001/assets/characters/head/variant1.png
http://localhost:3001/assets/characters/arms/variant2.png
```

### Produção:
```
https://easycraft-backend.onrender.com/assets/characters/head/variant1.png
```

---

## 📖 Documentação Completa

Para instruções detalhadas, veja:
- **`docs/COMO_ADICIONAR_IMAGENS.md`** - Guia completo
- **`backend/assets/README.md`** - Info sobre a pasta assets

---

## ✅ Checklist Rápido

- [x] ✅ Backend configurado (express.static adicionado)
- [x] ✅ Pastas criadas automaticamente
- [ ] ⏳ Adicionar suas imagens PNG nas pastas
- [ ] ⏳ Testar no navegador
- [ ] ⏳ Atualizar frontend para usar as imagens

---

**Próximo Passo**: Adicione suas imagens e teste! 🚀
