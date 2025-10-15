# 🧪 Testando a API do EasyCraft

## 🛠️ Ferramentas Recomendadas

### Opção 1: Thunder Client (VS Code Extension) ⚡ **RECOMENDADO**
1. Abra o VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Procure por "Thunder Client"
4. Instale e abra (ícone de raio na barra lateral)

### Opção 2: Postman
- Download: https://www.postman.com/downloads/

### Opção 3: Insomnia
- Download: https://insomnia.rest/download

---

## 📝 Endpoints Disponíveis

### Base URL
```
http://localhost:3001/api
```

---

## 🔐 Autenticação

### 1. Register (Registrar Usuário)
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "jogador1@easycraft.com",
  "password": "Senha123!"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "jogador1@easycraft.com",
      "createdAt": "2025-10-15T..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Erros**:
- 409: Email já existe
- 400: Validação (senha fraca, email inválido)

---

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jogador1@easycraft.com",
  "password": "Senha123!"
}
```

**Response (200)**: Igual ao register

**Erros**:
- 401: Credenciais inválidas

---

### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "SEU_REFRESH_TOKEN_AQUI"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "novo_token...",
      "refreshToken": "novo_refresh..."
    }
  }
}
```

---

### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer SEU_ACCESS_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 🎮 Personagens

**IMPORTANTE**: Todos os endpoints de personagens requerem autenticação!

```
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 5. Listar Personagens
```http
GET /api/characters
Authorization: Bearer SEU_ACCESS_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": 1,
        "name": "HeroMaster",
        "level": 1,
        "xp": 0,
        "gold": 100,
        "hp": 50,
        "maxHp": 50,
        "headVariant": "variant1",
        "armsVariant": "variant2",
        "legsVariant": "variant3",
        "feetVariant": "variant4",
        "stats": {
          "str": 5,
          "agi": 5,
          "vit": 5,
          "int": 5,
          "def": 2,
          "totalStr": 5,
          "totalAgi": 5,
          "totalVit": 5,
          "totalInt": 5,
          "totalDef": 2
        },
        "createdAt": "2025-10-15T...",
        "updatedAt": "2025-10-15T..."
      }
    ]
  }
}
```

---

### 6. Criar Personagem
```http
POST /api/characters
Authorization: Bearer SEU_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "HeroMaster",
  "headVariant": "variant1",
  "armsVariant": "variant2",
  "legsVariant": "variant3",
  "feetVariant": "variant4"
}
```

**Variantes válidas**: variant1, variant2, variant3, variant4, variant5, variant6

**Response (201)**: Retorna o personagem criado com stats

**Erros**:
- 400: Nome já existe
- 400: Máximo de 3 personagens
- 400: Validação (nome inválido, variantes inválidas)

---

### 7. Buscar Personagem por ID
```http
GET /api/characters/1
Authorization: Bearer SEU_ACCESS_TOKEN
```

**Response (200)**: Retorna o personagem com stats

**Erros**:
- 404: Personagem não encontrado
- 400: ID inválido

---

### 8. Deletar Personagem
```http
DELETE /api/characters/1
Authorization: Bearer SEU_ACCESS_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Personagem deletado com sucesso"
}
```

**Erros**:
- 404: Personagem não encontrado

---

## 🔄 Fluxo de Teste Completo

### Passo 1: Registrar
1. POST `/api/auth/register`
2. Copiar o `accessToken` da resposta

### Passo 2: Criar Personagem
1. POST `/api/characters` com header `Authorization: Bearer {accessToken}`
2. Usar variantes válidas

### Passo 3: Listar Personagens
1. GET `/api/characters` com header de auth
2. Ver seu personagem criado

### Passo 4: Ver Detalhes
1. GET `/api/characters/1` com header de auth

### Passo 5: Deletar (opcional)
1. DELETE `/api/characters/1` com header de auth

---

## 📊 Regras de Negócio

### Senha
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número

### Nome do Personagem
- Mínimo 3 caracteres
- Máximo 20 caracteres
- Apenas letras, números e underscore
- Nome único (case insensitive)

### Limites
- **3 personagens** por conta
- **6 variantes** de cada parte do corpo

### Stats Iniciais
- STR, AGI, VIT, INT: **5** cada
- DEF: **2**
- Level: **1**
- XP: **0**
- Gold: **100**
- HP: **50/50**

---

## 🎯 Exemplo de Coleção Thunder Client

Importe este JSON no Thunder Client:

```json
{
  "client": "Thunder Client",
  "collectionName": "EasyCraft API",
  "dateExported": "2025-10-15",
  "version": "1.0",
  "folders": [],
  "requests": [
    {
      "name": "Register",
      "method": "POST",
      "url": "http://localhost:3001/api/auth/register",
      "body": {
        "type": "json",
        "raw": "{\n  \"email\": \"test@easycraft.com\",\n  \"password\": \"Test123!\"\n}"
      }
    },
    {
      "name": "Login",
      "method": "POST",
      "url": "http://localhost:3001/api/auth/login",
      "body": {
        "type": "json",
        "raw": "{\n  \"email\": \"test@easycraft.com\",\n  \"password\": \"Test123!\"\n}"
      }
    },
    {
      "name": "Create Character",
      "method": "POST",
      "url": "http://localhost:3001/api/characters",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{accessToken}}"
        }
      ],
      "body": {
        "type": "json",
        "raw": "{\n  \"name\": \"HeroMaster\",\n  \"headVariant\": \"variant1\",\n  \"armsVariant\": \"variant2\",\n  \"legsVariant\": \"variant3\",\n  \"feetVariant\": \"variant4\"\n}"
      }
    },
    {
      "name": "List Characters",
      "method": "GET",
      "url": "http://localhost:3001/api/characters",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{accessToken}}"
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist de Testes

- [ ] Registrar novo usuário
- [ ] Login com usuário criado
- [ ] Tentar login com senha errada (deve falhar)
- [ ] Criar 1º personagem
- [ ] Criar 2º personagem
- [ ] Criar 3º personagem
- [ ] Tentar criar 4º personagem (deve falhar - limite)
- [ ] Tentar criar personagem com nome repetido (deve falhar)
- [ ] Listar todos os personagens
- [ ] Buscar personagem por ID
- [ ] Deletar personagem
- [ ] Testar refresh token
- [ ] Logout

---

**Backend está pronto e funcionando! 🎉**
