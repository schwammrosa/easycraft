# 🧪 Tests - Testes de Funcionalidades DB

Testes para validar funcionalidades específicas do banco de dados e regras de negócio.

## 📦 Arquivos

### test-craft-potion.ts
Testa o sistema de crafting de poções.

**O que testa:**
- Criação de receita de poção
- Crafting com materiais suficientes
- Crafting com materiais insuficientes
- Consumo correto de materiais
- Adição do item ao inventário
- Validação de ingredientes

**Executar:**
```bash
npm run test:db
```

### test-stats-calculation.ts
Testa cálculo de stats de personagens.

**O que testa:**
- Cálculo de HP (vit × 10)
- Soma de stats base + equipment
- Atributos de items equipados
- Parsing de JSON attributes
- Validação de stats finais

**Executar:**
```bash
npm run test:stats
```

## 🚀 Como Usar

### Rodar Teste Específico
```bash
# Teste de crafting
npm run test:db

# Teste de stats
npm run test:stats
```

### Rodar Todos os Testes DB
```bash
npm run test:db && npm run test:stats
```

## 📝 Como Criar Novos Testes

### Template de Teste

```typescript
// test-my-feature.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMyFeature() {
  console.log('🧪 Testing: My Feature');
  
  try {
    // 1. Setup - Criar dados de teste
    console.log('\n1️⃣ Setup...');
    const testData = await prisma.model.create({
      data: { /* dados de teste */ }
    });
    
    // 2. Executar - Testar funcionalidade
    console.log('\n2️⃣ Testing...');
    const result = await myFunction(testData);
    
    // 3. Assert - Validar resultado
    console.log('\n3️⃣ Validating...');
    if (result !== expected) {
      throw new Error(`Expected ${expected}, got ${result}`);
    }
    
    // 4. Cleanup - Limpar dados de teste
    console.log('\n4️⃣ Cleanup...');
    await prisma.model.delete({
      where: { id: testData.id }
    });
    
    console.log('\n✅ Test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

testMyFeature()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Adicionar ao package.json

```json
{
  "scripts": {
    "test:my-feature": "ts-node prisma/tests/test-my-feature.ts"
  }
}
```

## 🎯 Boas Práticas

### ✅ Faça
- Criar dados de teste isolados
- Limpar dados após teste (cleanup)
- Testar casos de sucesso E falha
- Logar cada etapa do teste
- Usar nomes descritivos
- Documentar o que está sendo testado

### ❌ Não Faça
- Modificar dados de produção
- Deixar dados de teste no banco
- Pular validações
- Testar múltiplas coisas no mesmo teste
- Depender de dados existentes

## 🔍 Diferença: Tests vs Jest

### Estes Testes (prisma/tests/)
- **Propósito:** Testar funcionalidades DB específicas
- **Escopo:** Banco de dados e Prisma Client
- **Quando:** Durante desenvolvimento de features DB
- **Como:** Scripts TypeScript standalone (`ts-node`)
- **Cleanup:** Manual (dentro do script)

### Jest Tests (src/**/*.test.ts)
- **Propósito:** Testes unitários e integração de API
- **Escopo:** Controllers, Services, Routes
- **Quando:** CI/CD e antes de commits
- **Como:** Framework Jest
- **Cleanup:** Automático (test environment)

## 📊 Coverage

| Feature | Testado | Arquivo |
|---------|---------|---------|
| Crafting System | ✅ | test-craft-potion.ts |
| Stats Calculation | ✅ | test-stats-calculation.ts |
| Battle System | ❌ | - |
| Gathering System | ❌ | - |
| Quest Progress | ❌ | - |
| Marketplace | ❌ | - |

**TODO:** Adicionar testes para features faltantes.

## 🚦 Status dos Testes

### ✅ Passando
- test-craft-potion.ts
- test-stats-calculation.ts

### ⏸️ Pendentes
- test-battle-system.ts
- test-gathering-mechanics.ts
- test-quest-completion.ts

---

**Dica:** Execute os testes sempre após:
- Mudanças no schema
- Aplicar migrations
- Modificar regras de negócio
- Antes de fazer deploy
