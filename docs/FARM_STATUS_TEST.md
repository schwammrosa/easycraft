# 🧪 FARM MODE - TESTE DE STATUS

## 📊 STATUS POSSÍVEIS

### **FarmSessionStatus (Enum)**
```typescript
enum FarmSessionStatus {
  running     // ⚙️ Farm ativo em andamento
  completed   // ✅ Farm concluído normalmente
  cancelled   // ⚠️ Farm cancelado/fugiu
  error       // ❌ Erro durante processamento
}
```

---

## 🔍 CENÁRIOS DE TESTE

### **1. ✅ STATUS: `running`**
**Quando acontece:**
- Farm foi iniciado com sucesso
- Batalhas estão sendo processadas
- Ainda não atingiu condição de parada

**Comportamento esperado:**
- ✅ Polling atualiza a cada 2 segundos
- ✅ Mostra painel "⚔️ Farm em Andamento!"
- ✅ Progresso atualiza em tempo real
- ✅ Botão "🏃 FUGIR" visível
- ✅ Pode navegar para outras páginas

**Como testar:**
```
1. Iniciar farm com 50 batalhas
2. Verificar que painel aparece
3. Navegar para /dashboard
4. Voltar para /battle/farm
5. Verificar que continua mostrando progresso
```

---

### **2. ✅ STATUS: `completed` + REASON: `max_battles`**
**Quando acontece:**
- Completou número máximo de batalhas configurado
- Todas batalhas foram concluídas

**Comportamento esperado:**
- ✅ Status muda para `completed`
- ✅ `stoppedReason`: `"max_battles"`
- ✅ `stoppedMessage`: `"Completou X batalhas com sucesso!"`
- ✅ Polling para automaticamente
- ✅ Modal de resultado aparece
- ✅ Cor azul (sucesso)

**Como testar:**
```
1. Iniciar farm com 5 batalhas
2. Aguardar completar todas
3. Verificar modal de resultado
4. Mensagem deve ser verde/azul (sucesso)
```

---

### **3. ✅ STATUS: `completed` + REASON: `no_potions`**
**Quando acontece:**
- Acabaram as poções configuradas
- HP está abaixo de 30%
- Não é seguro continuar

**Comportamento esperado:**
- ✅ Status muda para `completed`
- ✅ `stoppedReason`: `"no_potions"`
- ✅ `stoppedMessage`: `"Parou após X batalhas: Sem poções e HP baixo (Y%)"`
- ✅ Polling para
- ✅ Modal de resultado aparece
- ✅ Cor azul (parada segura)

**Como testar:**
```
1. Usar personagem com HP baixo (ex: 30%)
2. Configurar poção que você tem apenas 1
3. Configurar usar poção em 40%
4. Iniciar farm
5. Aguardar usar a poção e HP ficar < 30%
6. Deve parar automaticamente
```

---

### **4. ✅ STATUS: `completed` + REASON: `low_hp`**
**Quando acontece:**
- HP caiu abaixo de 20%
- Risco de morrer
- Para automaticamente para segurança

**Comportamento esperado:**
- ✅ Status muda para `completed`
- ✅ `stoppedReason`: `"low_hp"`
- ✅ `stoppedMessage`: `"Parou após X batalhas: HP muito baixo (X/Y)"`
- ✅ Polling para
- ✅ Modal de resultado aparece
- ✅ Cor azul (parada segura)

**Como testar:**
```
1. Usar personagem com HP baixo
2. Não configurar poção
3. Lutar contra inimigo forte
4. Aguardar HP cair < 20%
5. Deve parar automaticamente
```

---

### **5. ✅ STATUS: `completed` + REASON: `died`**
**Quando acontece:**
- Perdeu uma batalha
- HP foi para 1
- Farm encerrado

**Comportamento esperado:**
- ✅ Status muda para `completed`
- ✅ `stoppedReason`: `"died"`
- ✅ `stoppedMessage`: `"Derrotado após X batalhas"`
- ✅ Personagem HP = 1
- ✅ Polling para
- ✅ Modal de resultado aparece
- ✅ Pode mostrar cor vermelha (derrota)

**Como testar:**
```
1. Usar personagem fraco (level 1)
2. Lutar contra inimigo forte (ex: Dragon)
3. Sem poções
4. Aguardar perder batalha
5. Verificar HP = 1
```

---

### **6. ⚠️ STATUS: `cancelled` + REASON: `fled`**
**Quando acontece:**
- Jogador clicou "🏃 FUGIR"
- Confirmou no modal
- Penalidade de 50% aplicada

**Comportamento esperado:**
- ✅ Status muda para `cancelled`
- ✅ `stoppedReason`: `"fled"`
- ✅ `stoppedMessage`: `"⚠️ FUGIU DA BATALHA! Perdeu 50% das recompensas (-X XP, -Y Gold)"`
- ✅ XP e Gold removidos do personagem (50%)
- ✅ Polling para
- ✅ Modal de resultado aparece
- ✅ Cor VERMELHA (penalidade)

**Como testar:**
```
1. Iniciar farm com 50 batalhas
2. Aguardar 5-10 batalhas
3. Clicar "🏃 FUGIR (Perde 50%)"
4. Confirmar no modal
5. Verificar mensagem vermelha de penalidade
6. Verificar XP/Gold reduzidos
```

---

### **7. ❌ STATUS: `error` + REASON: `error`**
**Quando acontece:**
- Erro inesperado durante processamento
- Inimigo não encontrado
- Erro no banco de dados

**Comportamento esperado:**
- ✅ Status muda para `error`
- ✅ `stoppedReason`: `"error"`
- ✅ `stoppedMessage`: `"Erro ao processar farm"` ou `"Inimigo não encontrado"`
- ✅ Polling para
- ✅ Modal de resultado OU mensagem de erro
- ✅ Cor vermelha (erro)

**Como testar:**
```
Difícil testar sem forçar erro, mas pode acontecer se:
1. Inimigo for deletado do banco durante farm
2. Conexão com banco cair
3. Erro de parsing de dados
```

---

## 📋 CHECKLIST DE VALIDAÇÃO

### **Backend**
- [ ] ✅ Status `running` setado ao criar sessão
- [ ] ✅ Status `completed` quando max_battles atingido
- [ ] ✅ Status `completed` quando no_potions
- [ ] ✅ Status `completed` quando low_hp
- [ ] ✅ Status `completed` quando died
- [ ] ✅ Status `cancelled` quando fled
- [ ] ✅ Status `error` quando erro
- [ ] ✅ Penalidade de 50% aplicada ao fugir
- [ ] ✅ HP setado para 1 ao morrer
- [ ] ✅ Mensagens corretas para cada cenário

### **Frontend**
- [ ] ✅ Painel de progresso para `running`
- [ ] ✅ Polling para quando status != `running`
- [ ] ✅ Modal de resultado para `completed`
- [ ] ✅ Modal de resultado para `cancelled` (vermelho)
- [ ] ✅ Modal de resultado para `error`
- [ ] ✅ Botão FUGIR só visível quando `running`
- [ ] ✅ Modal de confirmação ao fugir
- [ ] ✅ Cálculo de penalidade mostrado
- [ ] ✅ Impede iniciar novo farm se já tem ativo
- [ ] ✅ Navegação livre durante farm

---

## 🎯 TESTES PRIORITÁRIOS

### **1. Ciclo Completo (Sucesso)**
```
1. Iniciar farm (5 batalhas, com poção)
2. Verificar painel em tempo real
3. Aguardar completar
4. Verificar modal de sucesso
```

### **2. Fugir com Penalidade**
```
1. Iniciar farm (50 batalhas)
2. Aguardar 10 batalhas
3. Clicar FUGIR
4. Confirmar
5. Verificar penalidade aplicada
6. Verificar XP/Gold reduzidos
```

### **3. Morrer em Batalha**
```
1. Personagem fraco vs inimigo forte
2. Sem poções
3. Aguardar morrer
4. Verificar HP = 1
5. Verificar modal
```

### **4. Múltiplos Farms (Deve Impedir)**
```
1. Iniciar farm
2. Tentar iniciar outro farm
3. Deve mostrar erro
4. Aguardar primeiro farm terminar
5. Tentar iniciar novo farm
6. Deve funcionar
```

---

## 🐛 BUGS CONHECIDOS

### **CORRIGIDO:**
- ✅ Status sempre `completed` (corrigido para usar `cancelled` e `error`)
- ✅ JSON.parse error em itens vazios (corrigido com try/catch)

### **A TESTAR:**
- ⏳ Polling continua após navegar para outra página?
- ⏳ Penalidade de 50% calculada corretamente?
- ⏳ Level up durante farm atualiza corretamente?
- ⏳ Items dropados aparecem no resultado?

---

## 📊 MATRIZ DE STATUS

| Status | Reason | Quando | Modal | Cor |
|--------|--------|--------|-------|-----|
| `running` | - | Durante farm | Painel | Dourado |
| `completed` | `max_battles` | Completou tudo | Sim | Azul/Verde |
| `completed` | `no_potions` | Sem poções + HP baixo | Sim | Azul |
| `completed` | `low_hp` | HP < 20% | Sim | Azul |
| `completed` | `died` | Perdeu batalha | Sim | Azul/Vermelho |
| `cancelled` | `fled` | Fugiu | Sim | Vermelho |
| `error` | `error` | Erro inesperado | Sim | Vermelho |

---

**ÚLTIMA ATUALIZAÇÃO:** 16/10/2025 11:32
