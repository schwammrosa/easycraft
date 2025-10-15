# EasyCraft - Fluxos de Usuário

## 🎯 Mapeamento de Jornadas do Jogador

---

## 1. 🆕 Primeiro Acesso (Onboarding)

### Objetivo
Converter visitante em jogador ativo com personagem criado

### Fluxo

```
1. Landing Page
   └─> Ver features do jogo
   └─> Ler sobre o que é EasyCraft
   └─> [CTA: Jogar Agora]
        │
2. Registro
   └─> Inserir email
   └─> Criar senha (com requisitos visíveis)
   └─> Confirmar senha
   └─> [Criar Conta]
        │
        ├─> ❌ Erro: Email já existe
        │    └─> Sugerir Login
        │
        └─> ✅ Sucesso: Conta criada
             └─> Auto-login com token JWT
                  │
3. Criar Personagem
   └─> Escolher nome (verificação de disponibilidade)
   └─> Customizar aparência
        ├─> Selecionar Cabeça (< > arrows, 1/6)
        ├─> Selecionar Braços (< > arrows, 1/6)
        ├─> Selecionar Pernas (< > arrows, 1/6)
        └─> Selecionar Pés (< > arrows, 1/6)
   └─> Preview em tempo real
   └─> [Criar Personagem]
        │
        ├─> ❌ Erro: Nome já existe
        │    └─> Sugerir alternativas
        │
        └─> ✅ Sucesso: Personagem criado
             └─> Redirect para Dashboard
                  │
4. Dashboard (Primeira Vez)
   └─> Ver tutorial/tooltip (opcional)
   └─> Stats iniciais visíveis
   └─> Quest automática: "Primeira Batalha"
   └─> Sugestão: "Comece com uma batalha!"
```

### Duração Esperada
**2-5 minutos** do landing até dashboard

### Pontos de Fricção
- Senha fraca rejeitada
- Nome de personagem já existe
- Indecisão na customização

### Mitigações
- Indicador de força de senha em tempo real
- Sugestões de nomes disponíveis
- Preview instantâneo ao mudar aparência
- Permitir editar aparência depois (futuro)

---

## 2. ⚔️ Primeira Batalha

### Objetivo
Jogador entende mecânica de combate e ganha primeiras recompensas

### Fluxo

```
1. Dashboard
   └─> Click em [⚔️ Batalha]
        │
2. Seleção de Área
   └─> Ver áreas disponíveis
        ├─> Floresta (Lv 1-3) ✅ Desbloqueada
        ├─> Caverna (Lv 4-7) 🔒 Bloqueada
        └─> Ruínas (Lv 8+) 🔒 Bloqueada
   └─> Click em "Floresta"
   └─> Ver inimigos possíveis: Goblin, Lobo
   └─> [Iniciar Batalha]
        │
3. Loading
   └─> Spinner com texto: "Procurando inimigo..."
   └─> 1-2 segundos
        │
4. Resultado da Batalha
   └─> Animação de reveal (fade in)
   └─> Mostrar resultado: VITÓRIA! / DERROTA
   └─> Log turno-a-turno
        ├─> "Turno 1: Você atacou! 12 dano"
        ├─> "Turno 2: Goblin atacou! 5 dano"
        └─> "Turno 3: Você atacou! CRÍTICO! 24 dano"
   └─> Mostrar recompensas
        ├─> +35 XP (barra de XP anima)
        ├─> +12 Gold (contador anima)
        └─> +2x Iron Ore (ícone com quantidade)
   └─> Botões
        ├─> [Batalhar Novamente]
        └─> [Voltar ao Dashboard]
        │
5. Se Vitória → Quest "Primeira Batalha" completa
   └─> Notificação: "Quest completa! +20 XP, +50 Gold"
   └─> Nova quest desbloqueada
```

### Duração Esperada
**1-2 minutos** por batalha

### Pontos de Atenção
- Primeira batalha deve ser fácil (taxa de vitória ~90%)
- Recompensas generosas para motivar
- Explicar o que fazer com loot

---

## 3. 🎒 Gerenciar Inventário

### Objetivo
Organizar itens e equipar pela primeira vez

### Fluxo

```
1. Dashboard
   └─> Notificação: "Novo item! Visite o inventário"
   └─> Click em [🎒 Inventário]
        │
2. Inventário
   └─> Ver grid de itens
   └─> Ver painel de equipamento (vazio)
   └─> Ver stats atuais (base)
   └─> Hover em "Iron Sword"
        └─> Tooltip aparece
             ├─> Nome: Iron Sword
             ├─> Tipo: Weapon
             ├─> Valor: 50 Gold
             ├─> Atributos: +3 STR
             └─> "Click para opções"
   └─> Click em "Iron Sword"
        └─> Menu contextual
             ├─> [Equipar]
             ├─> [Vender]
             └─> [Descartar]
   └─> Click em [Equipar]
        │
3. Confirmação (opcional se item valioso)
   └─> Modal: "Equipar Iron Sword?"
   └─> Preview de stats
        ├─> STR: 5 → 8 (+3) ✅
   └─> [Cancelar] [Confirmar]
        │
4. Item Equipado
   └─> Animação de item indo para slot
   └─> Stats atualizam (números verdes)
   └─> Toast: "Iron Sword equipada! +3 STR"
   └─> Painel de equipamento mostra item
   └─> Item no inventário marcado como "Equipado"
```

### Duração Esperada
**30-60 segundos** para primeira vez

### Dicas
- Highlight visual em itens equipáveis novos
- Tutorial tooltip na primeira vez
- Mostrar comparação com item atual (futuro)

---

## 4. 🏪 Usar Marketplace

### Objetivo
Vender itens excedentes e comprar de outros jogadores

### Fluxo A: Vender Item

```
1. Inventário
   └─> Muitos Iron Ore (24x)
   └─> Decidir vender
   └─> Click em [🏪 Loja]
        │
2. Marketplace
   └─> Tab ativa: [Mercado de Jogadores]
   └─> Ver outros anúncios (pesquisar preços)
        └─> Iron Ore: 5-8 Gold/unidade
   └─> Click em [+ Criar Anúncio]
        │
3. Modal: Criar Anúncio
   └─> Selecionar item: [Iron Ore ▼]
   └─> Quantidade: [10___] (max: 24)
   └─> Preço/unidade: [7___] Gold
   └─> Cálculo automático
        ├─> Total bruto: 70 Gold
        ├─> Taxa (5%): -3.5 Gold
        └─> Você recebe: 66.5 Gold
   └─> [Cancelar] [Publicar Anúncio]
        │
4. Anúncio Criado
   └─> Toast: "Anúncio publicado!"
   └─> Itens removidos do inventário
   └─> Aparecem em "Meus Anúncios"
   └─> Aguardar compra ou cancelar
```

### Fluxo B: Comprar Item

```
1. Marketplace
   └─> Tab: [Mercado de Jogadores]
   └─> Buscar: "Iron Sword"
   └─> Filtrar por: Armas
   └─> Ordenar: Menor preço
        │
2. Listagem
   └─> Ver anúncios disponíveis
   └─> [🗡️] Iron Sword x1 - 60 Gold
        └─> Vendedor: Player123
        └─> [Comprar]
   └─> Click em [Comprar]
        │
3. Modal: Confirmar Compra
   └─> Item: Iron Sword x1
   └─> Preço: 60 Gold
   └─> Seu ouro: 120 → 60 Gold
   └─> [Cancelar] [Confirmar Compra]
        │
        ├─> ❌ Erro: Ouro insuficiente
        │    └─> Toast: "Você precisa de 60 Gold"
        │
        └─> ✅ Sucesso
             └─> Ouro deduzido
             └─> Item vai para inventário
             └─> Toast: "Iron Sword comprada!"
             └─> Notificação para vendedor (futuro)
```

### Duração Esperada
- **Vender**: 1-2 minutos
- **Comprar**: 30-60 segundos

---

## 5. 🛠️ Craftar Item

### Objetivo
Transformar materiais em item valioso

### Fluxo

```
1. Inventário
   └─> Ver materiais: 3x Iron Ingot, 2x Wood
   └─> Click em [🛠️ Craft]
        │
2. Crafting
   └─> Ver lista de receitas
        ├─> [✅] Iron Sword (pode craftar)
        ├─> [✅] Iron Pickaxe (pode craftar)
        └─> [❌] Steel Sword (falta material)
   └─> Click em "Iron Sword"
        │
3. Detalhes da Receita
   └─> Painel direito
        ├─> Imagem: Iron Sword
        ├─> Materiais necessários:
        │    ├─> ✅ 3x Iron Ingot (você tem: 3)
        │    └─> ✅ 1x Wood (você tem: 2)
        ├─> Resultado: 1x Iron Sword
        ├─> Atributos: +3 STR
        ├─> Tempo: Instantâneo
        └─> [Craftar] ✅ Habilitado
   └─> Click em [Craftar]
        │
4. Confirmação
   └─> Modal (opcional)
        └─> "Craftar Iron Sword?"
        └─> "Consome: 3x Iron Ingot, 1x Wood"
        └─> [Cancelar] [Confirmar]
             │
5. Item Craftado
   └─> Animação de crafting (1s)
   └─> Materiais consumidos
   └─> Iron Sword criada
   └─> Toast: "Iron Sword craftada com sucesso!"
   └─> Item aparece no inventário
   └─> Opcional: +XP por craft
```

### Duração Esperada
**1-2 minutos** incluindo navegar receitas

---

## 6. ⛏️ Coletar Recursos

### Objetivo
Obter materiais brutos para craft

### Fluxo

```
1. Dashboard
   └─> Click em [⛏️ Coleta]
        │
2. Áreas de Coleta
   └─> Ver lista de áreas
        ├─> [✅] Mina de Ferro (disponível)
        ├─> [⏱️] Floresta (cooldown: 5s)
        └─> [🔒] Lago (Lv 5 necessário)
   └─> Click em "Mina de Ferro"
        │
3. Detalhes da Área
   └─> Nome: Mina de Ferro
   └─> Recursos: Iron Ore, Coal
   └─> Cooldown: 10 segundos
   └─> Nível: 1+
   └─> [Coletar] ✅ Disponível
   └─> Click em [Coletar]
        │
4. Coletando
   └─> Loading: "Coletando recursos..."
   └─> Spinner (1-2s para feedback)
        │
5. Resultado
   └─> Modal/Card: "Coleta Completa!"
   └─> Você coletou:
        ├─> +2x Iron Ore
        └─> +1x Coal
   └─> Próxima coleta em: 10s (timer visual)
   └─> [Coletar Novamente] 🔒 Disabled
   └─> [Voltar]
        │
6. Aguardar Cooldown
   └─> Timer decrementa: 9s... 8s... 7s...
   └─> Ao chegar em 0s: Botão habilita
   └─> Notificação (opcional): "Coleta disponível!"
```

### Duração Esperada
**10-15 segundos** por coleta + cooldown

---

## 7. 🎯 Completar Quest

### Objetivo
Seguir objetivos e ganhar recompensas

### Fluxo

```
1. Dashboard
   └─> Badge em [🎯 Missões]: "1" (nova quest)
   └─> Click em [🎯 Missões]
        │
2. Lista de Quests
   └─> Tab: [Disponíveis]
   └─> Ver quest: "Ferreiro Necessitado"
        ├─> Descrição: "O ferreiro precisa de minério"
        ├─> Objetivo: Coletar 10x Iron Ore (0/10)
        ├─> Recompensas: +100 XP, +50 Gold, +1x Iron Sword
        └─> [Aceitar Quest]
   └─> Click em [Aceitar]
        │
3. Quest Ativa
   └─> Quest move para tab [Em Andamento]
   └─> Progresso: 0/10
   └─> Indicador visual na tela (canto)
        │
4. Realizar Objetivo
   └─> Ir para [⛏️ Coleta] → Mina de Ferro
   └─> Coletar Iron Ore múltiplas vezes
   └─> Cada coleta atualiza progresso
        ├─> 2/10... 5/10... 8/10... 10/10 ✅
   └─> Toast: "Objetivo completo! Volte às Missões"
        │
5. Completar Quest
   └─> Voltar para [🎯 Missões]
   └─> Quest mostra: "✅ Pronta para completar"
   └─> Click em quest
   └─> [Completar Quest] ✅ Habilitado
   └─> Click em [Completar]
        │
6. Recompensas
   └─> Animação de recompensa
   └─> Mostrar ganhos:
        ├─> +100 XP (barra anima)
        ├─> +50 Gold
        └─> +1x Iron Sword (vai para inventário)
   └─> Notificação: "Missão concluída!"
   └─> Quest move para [Completas]
   └─> Nova quest pode desbloquear
```

### Duração Esperada
**5-15 minutos** dependendo da quest

---

## 8. 🔄 Loop de Progressão Diário

### Objetivo
Sessão típica de 20-30 minutos

### Fluxo

```
1. Login
   └─> Ver Dashboard
   └─> Checar notificações
        ├─> Item vendido no mercado: +60 Gold
        ├─> Nova quest disponível
        └─> Level up de outro jogador (chat)
        │
2. Checar Mercado
   └─> Ver se alguém comprou seus itens
   └─> Buscar bargains (itens baratos)
   └─> Comprar material necessário
        │
3. Fazer Quests
   └─> Ver quests ativas (2/3 em progresso)
   └─> Completar objetivos
        ├─> 3 batalhas na Floresta
        └─> Craftar 2 Iron Pickaxes
   └─> Completar quests → Recompensas
        │
4. Farm de Recursos
   └─> Batalhar 5-10 vezes (XP, Gold, Loot)
   └─> Coletar em 2-3 áreas diferentes
   └─> Acumular materiais
        │
5. Crafting Session
   └─> Ver o que pode craftar
   └─> Craftar itens para vender ou usar
   └─> Equipar upgrade se conseguiu
        │
6. Vender Excedentes
   └─> Listar materiais comuns no mercado
   └─> Vender lixo para NPCs
   └─> Acumular ouro
        │
7. Verificar Progressão
   └─> Ver stats atuais
   └─> Checar quanto XP falta para próximo nível
   └─> Planejar próximos objetivos
        │
8. Logout
   └─> Toast: "Volte amanhã para novas quests!"
```

### Duração Esperada
**20-40 minutos** por sessão

---

## 9. 📈 Subir de Nível

### Objetivo
Momento de celebração e progressão

### Fluxo

```
1. Durante Batalha/Quest
   └─> Ganhar XP suficiente
   └─> Sistema detecta: XP >= XP necessário
        │
2. Level Up!
   └─> Animação especial (brilho dourado)
   └─> Modal grande: "🎉 LEVEL UP! 🎉"
        ├─> Nível 5 → 6
        ├─> Stats aumentados:
        │    ├─> STR: 8 → 9 (+1)
        │    ├─> AGI: 6 → 7 (+1)
        │    ├─> VIT: 10 → 12 (+2)
        │    ├─> INT: 4 → 5 (+1)
        │    └─> DEF: 5 → 6 (+1)
        ├─> HP Max: 60 → 70
        └─> [Continuar]
        │
3. Desbloqueios
   └─> Notificações:
        ├─> "Nova área desbloqueada: Caverna!"
        ├─> "3 novas receitas de craft!"
        └─> "5 novas quests disponíveis!"
        │
4. Voltar ao Jogo
   └─> Personagem mais forte
   └─> Explorar novo conteúdo
```

---

## 10. 🚨 Fluxos de Erro

### A. Conexão Perdida

```
1. Durante ação (batalha, compra, etc)
   └─> Request falha (timeout ou network error)
        │
2. Sistema detecta
   └─> Toast: "⚠️ Conexão perdida. Reconectando..."
   └─> Tentar novamente (retry automático 3x)
        │
        ├─> ✅ Sucesso: Continuar normal
        └─> ❌ Falha: 
             └─> Modal: "Sem conexão"
             └─> "Verifique sua internet"
             └─> [Tentar Novamente] [Voltar]
```

### B. Sessão Expirada

```
1. Token JWT expira
   └─> Request retorna 401 Unauthorized
        │
2. Sistema detecta
   └─> Tentar refresh token automaticamente
        │
        ├─> ✅ Sucesso: Nova token, continuar
        └─> ❌ Falha:
             └─> Modal: "Sessão expirada"
             └─> "Por favor, faça login novamente"
             └─> Redirect para Login
             └─> Preservar rota para voltar depois
```

### C. Ouro Insuficiente

```
1. Tentar comprar item sem ouro
   └─> Validação no frontend (previne)
   └─> Se passar, backend rejeita
        │
2. Toast: "❌ Ouro insuficiente"
   └─> "Você tem: 30 Gold"
   └─> "Necessário: 60 Gold"
   └─> Sugestão: "Venda itens ou faça batalhas!"
```

### D. Inventário Cheio

```
1. Tentar receber item sem espaço
   └─> Validação antes de batalha/coleta/compra
        │
2. Modal: "⚠️ Inventário Cheio"
   └─> "Libere espaço antes de continuar"
   └─> Sugestões:
        ├─> "Venda itens no mercado"
        ├─> "Descarte itens desnecessários"
        └─> "Upgrade de slots (futuro)"
   └─> [Ir para Inventário] [Cancelar]
```

---

## 📊 Métricas por Fluxo

| Fluxo | Taxa de Conclusão Alvo | Tempo Médio | Abandono Crítico |
|-------|----------------------|-------------|------------------|
| Onboarding | 80% | 3 min | Criação de personagem |
| Primeira Batalha | 95% | 2 min | Derrota desanima |
| Equipar Item | 90% | 1 min | UI confusa |
| Marketplace (Vender) | 70% | 2 min | Preços complicados |
| Crafting | 85% | 1.5 min | Materiais faltando |
| Quest Completa | 75% | 10 min | Objetivos longos |
| Level Up | 100% | N/A | - |

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Mapeamento completo de fluxos
