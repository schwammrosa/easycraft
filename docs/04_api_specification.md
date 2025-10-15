# EasyCraft - Especificação de API

## 📡 Informações Gerais

**Base URL**: `http://localhost:3001/api` (desenvolvimento)  
**Protocol**: REST  
**Format**: JSON  
**Authentication**: JWT Bearer Token

### Headers Padrão

```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

### Response Pattern

**Sucesso**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### Status Codes

- `200` OK - Requisição bem sucedida
- `201` Created - Recurso criado
- `400` Bad Request - Dados inválidos
- `401` Unauthorized - Não autenticado
- `403` Forbidden - Sem permissão
- `404` Not Found - Recurso não encontrado
- `409` Conflict - Conflito (ex: nome já existe)
- `429` Too Many Requests - Rate limit excedido
- `500` Internal Server Error - Erro do servidor

---

## 🔐 Autenticação

### POST /auth/register

Cadastrar novo usuário

**Body**:
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Validações**:
- Email válido e único
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 número
- Senhas devem coincidir

**Response 201**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "player@example.com",
      "createdAt": "2025-10-15T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

---

### POST /auth/login

Fazer login

**Body**:
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "player@example.com"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

---

### POST /auth/refresh

Renovar access token

**Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### POST /auth/logout

Fazer logout (invalida tokens)

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 👤 Personagens

### GET /characters

Listar personagens do usuário autenticado

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": 1,
        "name": "ZéCraft",
        "level": 5,
        "xp": 450,
        "gold": 1200,
        "appearance": {
          "head": "head_01",
          "arms": "arms_03",
          "legs": "legs_02",
          "feet": "feet_01"
        },
        "stats": {
          "str": 8,
          "agi": 6,
          "vit": 10,
          "int": 4,
          "def": 5
        },
        "createdAt": "2025-10-10T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /characters

Criar novo personagem

**Headers**: Authorization required

**Body**:
```json
{
  "name": "ZéCraft",
  "appearance": {
    "head": "head_01",
    "arms": "arms_02",
    "legs": "legs_03",
    "feet": "feet_01"
  }
}
```

**Validações**:
- Nome único (3-16 caracteres alfanuméricos)
- Máximo 3 personagens por conta (MVP)
- Variantes de aparência válidas

**Response 201**:
```json
{
  "success": true,
  "data": {
    "character": {
      "id": 2,
      "name": "ZéCraft",
      "level": 1,
      "xp": 0,
      "gold": 100,
      "appearance": { ... },
      "stats": {
        "str": 5,
        "agi": 5,
        "vit": 5,
        "int": 5,
        "def": 2
      }
    }
  }
}
```

---

### GET /characters/:id

Obter detalhes completos do personagem

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "character": {
      "id": 1,
      "name": "ZéCraft",
      "level": 5,
      "xp": 450,
      "xpForNextLevel": 625,
      "gold": 1200,
      "hp": 60,
      "maxHp": 60,
      "appearance": { ... },
      "stats": { ... },
      "equipment": {
        "weapon": {
          "id": 101,
          "name": "Iron Sword",
          "bonuses": {"str": 3}
        },
        "head": null,
        "torso": null,
        "legs": null,
        "feet": null
      }
    }
  }
}
```

---

### DELETE /characters/:id

Deletar personagem

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "message": "Character deleted successfully"
  }
}
```

---

## ⚔️ Batalhas

### POST /battles/start

Iniciar combate automático

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "areaCode": "forest_01"
}
```

**Validações**:
- Personagem pertence ao usuário
- Área existe e está desbloqueada
- Personagem não está em cooldown

**Response 200**:
```json
{
  "success": true,
  "data": {
    "battle": {
      "id": 523,
      "result": "victory",
      "log": [
        "Turn 1: You attack! 12 damage dealt.",
        "Turn 2: Goblin attacks! 5 damage taken.",
        "Turn 3: You attack! CRITICAL! 24 damage dealt.",
        "Enemy defeated!"
      ],
      "rewards": {
        "xp": 35,
        "gold": 12,
        "items": [
          {"itemId": 5, "name": "Iron Ore", "quantity": 2}
        ]
      },
      "characterState": {
        "level": 5,
        "xp": 485,
        "gold": 1212,
        "hp": 55
      },
      "leveledUp": false,
      "duration": 187
    }
  }
}
```

---

### GET /battles/history/:characterId

Histórico de batalhas

**Headers**: Authorization required

**Query Params**:
- `limit` (default: 20, max: 100)
- `offset` (default: 0)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "battles": [
      {
        "id": 523,
        "enemyCode": "goblin",
        "enemyName": "Goblin",
        "result": "victory",
        "xpGained": 35,
        "goldGained": 12,
        "itemsDropped": 2,
        "createdAt": "2025-10-15T11:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

## 🎒 Inventário

### GET /inventory/:characterId

Obter inventário completo

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "inventory": {
      "slots": 50,
      "slotsUsed": 12,
      "items": [
        {
          "id": 1,
          "item": {
            "id": 5,
            "code": "iron_ore",
            "name": "Iron Ore",
            "type": "material",
            "baseValue": 5,
            "imagePath": "/assets/items/iron_ore.png"
          },
          "quantity": 24,
          "equipped": false
        },
        {
          "id": 2,
          "item": {
            "id": 101,
            "code": "iron_sword",
            "name": "Iron Sword",
            "type": "weapon",
            "slot": "weapon",
            "baseValue": 50,
            "attributes": {"str": 3},
            "imagePath": "/assets/items/iron_sword.png"
          },
          "quantity": 1,
          "equipped": true
        }
      ]
    }
  }
}
```

---

### POST /inventory/equip

Equipar item

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "inventoryItemId": 2
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "equipped": true,
    "previousItem": null,
    "newStats": {
      "str": 8,
      "agi": 6,
      "vit": 10,
      "int": 4,
      "def": 5
    }
  }
}
```

---

### POST /inventory/unequip

Desequipar item

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "slot": "weapon"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "unequipped": true,
    "newStats": { ... }
  }
}
```

---

## 🛠️ Craft

### GET /craft/recipes

Listar receitas disponíveis

**Headers**: Authorization required

**Query Params**:
- `characterId` (required)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": 1,
        "code": "iron_sword",
        "name": "Iron Sword",
        "description": "A sturdy iron sword",
        "materials": [
          {
            "itemId": 5,
            "itemCode": "iron_ingot",
            "itemName": "Iron Ingot",
            "quantity": 3
          },
          {
            "itemId": 12,
            "itemCode": "wood",
            "itemName": "Wood",
            "quantity": 1
          }
        ],
        "craftTime": 0,
        "result": {
          "itemId": 101,
          "itemCode": "iron_sword",
          "quantity": 1
        },
        "canCraft": true,
        "unlocked": true
      }
    ]
  }
}
```

---

### POST /craft/create

Craftar item

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "recipeId": 1,
  "quantity": 1
}
```

**Validações**:
- Receita desbloqueada
- Materiais suficientes no inventário
- Espaço no inventário para resultado

**Response 200**:
```json
{
  "success": true,
  "data": {
    "crafted": {
      "itemId": 101,
      "itemName": "Iron Sword",
      "quantity": 1
    },
    "consumed": [
      {"itemId": 5, "quantity": 3},
      {"itemId": 12, "quantity": 1}
    ],
    "inventory": {
      "slotsUsed": 11
    }
  }
}
```

---

## 🏪 Mercado

### GET /shop/listings

Listar anúncios ativos

**Headers**: Authorization required

**Query Params**:
- `itemType` (optional: weapon, armor, material, consumable)
- `itemName` (optional: busca parcial)
- `minPrice`, `maxPrice` (optional)
- `sortBy` (optional: price_asc, price_desc, recent)
- `limit` (default: 20, max: 50)
- `offset` (default: 0)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": 42,
        "seller": {
          "characterId": 5,
          "characterName": "Vendedor123"
        },
        "item": {
          "id": 101,
          "code": "iron_sword",
          "name": "Iron Sword",
          "type": "weapon",
          "imagePath": "/assets/items/iron_sword.png"
        },
        "quantity": 1,
        "pricePerUnit": 60,
        "totalPrice": 60,
        "createdAt": "2025-10-15T10:00:00Z",
        "expiresAt": "2025-10-22T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

### POST /shop/list

Criar anúncio de venda

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "inventoryItemId": 3,
  "quantity": 5,
  "pricePerUnit": 8
}
```

**Validações**:
- Item existe no inventário
- Quantidade disponível
- Item não está equipado
- Preço > 0

**Response 201**:
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": 43,
      "itemId": 5,
      "quantity": 5,
      "pricePerUnit": 8,
      "totalPrice": 40,
      "expiresAt": "2025-10-22T12:00:00Z"
    }
  }
}
```

---

### POST /shop/buy

Comprar item do mercado

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "listingId": 42,
  "quantity": 1
}
```

**Validações**:
- Listing existe e está ativo
- Ouro suficiente
- Espaço no inventário
- Não pode comprar próprio item

**Response 200**:
```json
{
  "success": true,
  "data": {
    "purchase": {
      "itemName": "Iron Sword",
      "quantity": 1,
      "totalPaid": 60,
      "marketFee": 3
    },
    "newGold": 1137,
    "inventory": {
      "slotsUsed": 13
    }
  }
}
```

---

### DELETE /shop/listings/:id

Cancelar anúncio próprio

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "cancelled": true,
    "itemsReturned": {
      "itemId": 5,
      "quantity": 5
    }
  }
}
```

---

### GET /shop/npc-buyers

Ver NPCs compradores e preços

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "npcBuyers": [
      {
        "id": 1,
        "name": "Merchant Bob",
        "buyList": [
          {
            "itemId": 5,
            "itemCode": "iron_ore",
            "itemName": "Iron Ore",
            "pricePerUnit": 4
          },
          {
            "itemId": 101,
            "itemCode": "iron_sword",
            "itemName": "Iron Sword",
            "pricePerUnit": 40
          }
        ]
      }
    ]
  }
}
```

---

### POST /shop/sell-to-npc

Vender item para NPC

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "npcBuyerId": 1,
  "inventoryItemId": 4,
  "quantity": 10
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "sold": {
      "itemName": "Iron Ore",
      "quantity": 10,
      "pricePerUnit": 4,
      "totalReceived": 40
    },
    "newGold": 1177
  }
}
```

---

## 🎯 Missões

### GET /quests/available/:characterId

Listar quests disponíveis

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "quests": [
      {
        "id": 1,
        "code": "gather_iron_ore",
        "title": "Ferreiro Necessitado",
        "description": "O ferreiro local precisa de minério de ferro",
        "type": "collect",
        "objectives": [
          {
            "type": "collect",
            "itemId": 5,
            "itemName": "Iron Ore",
            "targetQuantity": 10,
            "currentQuantity": 0
          }
        ],
        "rewards": {
          "xp": 100,
          "gold": 50,
          "items": [
            {"itemId": 101, "itemName": "Iron Sword", "quantity": 1}
          ]
        },
        "levelRequired": 1,
        "status": "available"
      }
    ]
  }
}
```

---

### POST /quests/accept

Aceitar quest

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "questId": 1
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "quest": {
      "id": 1,
      "status": "in_progress",
      "acceptedAt": "2025-10-15T12:00:00Z"
    }
  }
}
```

---

### POST /quests/complete

Completar quest

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "questId": 1
}
```

**Validações**:
- Quest está in_progress
- Todos objetivos cumpridos

**Response 200**:
```json
{
  "success": true,
  "data": {
    "completed": true,
    "rewards": {
      "xp": 100,
      "gold": 50,
      "items": [...]
    },
    "characterState": {
      "level": 5,
      "xp": 585,
      "gold": 1227,
      "leveledUp": false
    }
  }
}
```

---

## ⛏️ Coleta

### GET /gathering/areas

Listar áreas de coleta

**Headers**: Authorization required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "areas": [
      {
        "id": 1,
        "code": "iron_mine",
        "name": "Iron Mine",
        "type": "mining",
        "resources": [
          {
            "itemId": 5,
            "itemName": "Iron Ore",
            "dropChance": 80,
            "quantityRange": [1, 3]
          }
        ],
        "cooldown": 10,
        "levelRequired": 1
      }
    ]
  }
}
```

---

### POST /gathering/collect

Coletar recurso

**Headers**: Authorization required

**Body**:
```json
{
  "characterId": 1,
  "areaCode": "iron_mine"
}
```

**Validações**:
- Área desbloqueada
- Não está em cooldown

**Response 200**:
```json
{
  "success": true,
  "data": {
    "collected": [
      {"itemId": 5, "itemName": "Iron Ore", "quantity": 2}
    ],
    "nextAvailableAt": "2025-10-15T12:10:00Z"
  }
}
```

---

## 📊 Rate Limiting

| Endpoint Group | Limite | Janela |
|---------------|--------|--------|
| /auth/login | 5 req | 15 min |
| /auth/register | 3 req | 1 hora |
| /battles/* | 30 req | 1 min |
| /gathering/* | 20 req | 1 min |
| /shop/* | 60 req | 1 min |
| Outros | 100 req | 15 min |

**Response 429**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again later.",
    "retryAfter": 120
  }
}
```

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Especificação completa para MVP
