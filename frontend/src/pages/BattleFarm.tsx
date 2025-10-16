import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { battleService, Enemy, FarmModeConfig } from '../services/battle.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { inventoryService } from '../services/inventory.service';

export function BattleFarm() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [potions, setPotions] = useState<any[]>([]);
  
  // Farm session states
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [showFleeConfirm, setShowFleeConfirm] = useState(false);
  const [dismissedSessionId, setDismissedSessionId] = useState<number | null>(null);
  const pollingInterval = useRef<any>(null);

  // Config states
  const [selectedEnemy, setSelectedEnemy] = useState<string>('');
  const [selectedPotion, setSelectedPotion] = useState<string>('');
  const [hpPercent, setHpPercent] = useState<number>(50);
  const [maxBattles, setMaxBattles] = useState<number>(50);

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadData();
    checkActiveFarm();
    
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedCharacter]);

  const loadData = async () => {
    if (!selectedCharacter) return;

    try {
      const [enemyList, inventory] = await Promise.all([
        battleService.getEnemies(selectedCharacter.id),
        inventoryService.getInventory(selectedCharacter.id)
      ]);
      
      setEnemies(enemyList);
      
      const potionItems = inventory.filter(inv => 
        inv.item.type === 'consumable' && 
        inv.item.code.includes('potion') &&
        inv.quantity > 0
      );
      setPotions(potionItems);
      
      if (potionItems.length > 0) {
        setSelectedPotion(potionItems[0].item.code);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return;
      }
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const checkActiveFarm = async () => {
    if (!selectedCharacter) return;
    
    try {
      // Busca última sessão (qualquer status)
      const session = await battleService.getLatestFarmSession(selectedCharacter.id);
      
      if (session) {
        // Não mostra se o usuário já fechou essa sessão
        if (session.id === dismissedSessionId) {
          return;
        }
        
        // Só mostra se for recente (últimos 5 minutos)
        const sessionTime = new Date(session.completedAt || session.startedAt).getTime();
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (now - sessionTime < fiveMinutes || session.status === 'running') {
          setActiveSession(session);
          
          // Se está rodando, inicia polling
          if (session.status === 'running') {
            startPolling(session.id);
          }
          // Se terminou recentemente, mostra o modal de resultado
        }
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return;
      }
      // No session or other error
    }
  };

  const startPolling = (sessionId: number) => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    
    pollingInterval.current = setInterval(async () => {
      try {
        const session = await battleService.getFarmSessionStatus(sessionId);
        setActiveSession(session);
        
        // Reload character
        const updated = await characterService.getCharacter(selectedCharacter!.id);
        selectCharacter(updated);
        
        if (session.status !== 'running') {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          return;
        }
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }, 2000); // Poll every 2 seconds
  };

  const handleStartFarm = async () => {
    if (!selectedCharacter || !selectedEnemy) return;
    if (activeSession?.status === 'running') {
      setError('Você já tem um farm ativo! Aguarde terminar ou fuja.');
      return;
    }

    setError('');
    // Reseta dismissed para permitir modal do novo farm
    setDismissedSessionId(null);

    const config: FarmModeConfig = {
      enemyCode: selectedEnemy,
      potionItemCode: selectedPotion || undefined,
      usePotionAtHpPercent: hpPercent,
      maxBattles: maxBattles,
    };

    try {
      const result = await battleService.startFarmMode(selectedCharacter.id, config);
      const session = await battleService.getFarmSessionStatus(result.sessionId);
      setActiveSession(session);
      startPolling(result.sessionId);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro no farm mode');
    }
  };

  const handleFlee = async () => {
    if (!activeSession) return;
    
    try {
      await battleService.cancelFarmSession(activeSession.id);
      const updated = await characterService.getCharacter(selectedCharacter!.id);
      selectCharacter(updated);
      
      const finalSession = await battleService.getFarmSessionStatus(activeSession.id);
      setActiveSession(finalSession);
      
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      
      setShowFleeConfirm(false);
    } catch (err: any) {
      setError('Erro ao fugir');
    }
  };

  const handleRest = async () => {
    if (!selectedCharacter) return;

    try {
      await battleService.rest(selectedCharacter.id);
      const updated = await characterService.getCharacter(selectedCharacter.id);
      selectCharacter(updated);
      setError('');
    } catch (err: any) {
      setError('Erro ao descansar');
    }
  };

  const handleCloseResult = async () => {
    // Marca essa sessão como "já vista" para não mostrar de novo
    if (activeSession?.id) {
      setDismissedSessionId(activeSession.id);
    }
    
    setActiveSession(null);
    
    try {
      // Só recarrega dados, NÃO busca farm novamente
      // (senão mostra o modal de novo)
      await loadData();
      
      // Recarrega personagem atualizado
      if (selectedCharacter) {
        const updated = await characterService.getCharacter(selectedCharacter.id);
        selectCharacter(updated);
      }
    } catch (err: any) {
      // Se for 401, redireciona para login
      if (err?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) return null;

  return (
    <div className="min-h-screen bg-bg-main p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-gold">🔥 Modo Farm Automático</h1>
            <p className="text-text-secondary">
              {selectedCharacter.name} - Level {selectedCharacter.level} - HP: {selectedCharacter.hp}/{selectedCharacter.maxHp}
            </p>
          </div>
          <div className="space-x-4">
            {selectedCharacter.hp < selectedCharacter.maxHp && (
              <button
                onClick={handleRest}
                className="px-4 py-2 bg-accent-green hover:bg-opacity-80 rounded-lg"
              >
                💊 Descansar
              </button>
            )}
            <button
              onClick={() => navigate('/battle')}
              className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
            >
              ⚔️ Batalha Normal
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
            >
              ← Voltar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Active Farm Progress Panel */}
        {activeSession && activeSession.status === 'running' && (
          <div className="bg-bg-panel rounded-lg p-6 mb-8 border-2 border-accent-gold">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-accent-gold">⚔️ Farm em Andamento!</h2>
              <button
                onClick={() => setShowFleeConfirm(true)}
                className="px-4 py-2 bg-accent-red hover:bg-opacity-80 rounded-lg font-semibold"
              >
                🏃 FUGIR (Perde 50%)
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-bg-input rounded-lg p-4 text-center">
                <p className="text-text-secondary text-sm">Batalha Atual</p>
                <p className="text-2xl font-bold text-accent-gold">
                  {activeSession.currentBattle} / {activeSession.maxBattles}
                </p>
              </div>
              <div className="bg-bg-input rounded-lg p-4 text-center">
                <p className="text-text-secondary text-sm">XP Ganho</p>
                <p className="text-2xl font-bold text-accent-blue">+{activeSession.totalXpGained}</p>
              </div>
              <div className="bg-bg-input rounded-lg p-4 text-center">
                <p className="text-text-secondary text-sm">Gold Ganho</p>
                <p className="text-2xl font-bold text-accent-gold">+{activeSession.totalGoldGained}</p>
              </div>
              <div className="bg-bg-input rounded-lg p-4 text-center">
                <p className="text-text-secondary text-sm">Vitórias</p>
                <p className="text-2xl font-bold text-accent-green">{activeSession.victories}</p>
              </div>
            </div>

            {activeSession.levelsGained > 0 && (
              <div className="bg-accent-gold/20 border border-accent-gold rounded-lg p-3 mb-4">
                <p className="text-lg font-bold text-accent-gold text-center">
                  🎊 SUBIU {activeSession.levelsGained} NÍVEIS!
                </p>
              </div>
            )}

            <div className="bg-bg-input rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Progresso</span>
                <span className="text-accent-gold font-bold">
                  {Math.floor((activeSession.currentBattle / activeSession.maxBattles) * 100)}%
                </span>
              </div>
              <div className="w-full bg-bg-main rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-accent-gold to-accent-blue h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(activeSession.currentBattle / activeSession.maxBattles) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-4 bg-accent-blue/10 border border-accent-blue rounded-lg p-3">
              <p className="text-sm">
                <strong className="text-accent-blue">Lutando contra:</strong> {activeSession.enemyName}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                💊 Poções usadas: {activeSession.potionsUsed} | HP: {selectedCharacter?.hp}/{selectedCharacter?.maxHp}
              </p>
            </div>
          </div>
        )}

        {/* Flee Confirmation Modal */}
        {showFleeConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-accent-red">
                ⚠️ FUGIR DA BATALHA?
              </h2>
              <p className="text-center mb-6">
                Se você fugir agora, perderá <strong className="text-accent-red">50%</strong> de todo XP e Gold conquistado!
              </p>
              <div className="bg-accent-red/20 border border-accent-red rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Recompensas atuais:</p>
                <p className="text-sm">• XP: +{activeSession?.totalXpGained} → <span className="text-accent-red">+{Math.floor((activeSession?.totalXpGained || 0) * 0.5)}</span></p>
                <p className="text-sm">• Gold: +{activeSession?.totalGoldGained} → <span className="text-accent-red">+{Math.floor((activeSession?.totalGoldGained || 0) * 0.5)}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowFleeConfirm(false)}
                  className="px-4 py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
                >
                  Continuar Farmando
                </button>
                <button
                  onClick={handleFlee}
                  className="px-4 py-3 bg-accent-red hover:bg-opacity-80 rounded-lg font-semibold"
                >
                  Sim, Fugir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Farm Result Modal */}
        {activeSession && activeSession.status !== 'running' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className={`text-3xl font-bold text-center mb-6 ${
                activeSession.status === 'cancelled' 
                  ? 'text-accent-red' 
                  : activeSession.status === 'error'
                  ? 'text-accent-red'
                  : activeSession.stoppedReason === 'died'
                  ? 'text-accent-red'
                  : 'text-accent-gold'
              }`}>
                {activeSession.status === 'cancelled' 
                  ? '⚠️ Fugiu da Batalha!' 
                  : activeSession.status === 'error'
                  ? '❌ Erro no Farm'
                  : activeSession.stoppedReason === 'died'
                  ? '💀 Derrotado!'
                  : '🎊 Resultado do Farm!'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-bg-input rounded-lg p-4 text-center">
                  <p className="text-text-secondary text-sm">Batalhas</p>
                  <p className="text-2xl font-bold text-accent-blue">{activeSession.totalBattles}</p>
                </div>
                <div className="bg-bg-input rounded-lg p-4 text-center">
                  <p className="text-text-secondary text-sm">Vitórias</p>
                  <p className="text-2xl font-bold text-accent-green">{activeSession.victories}</p>
                </div>
                <div className="bg-bg-input rounded-lg p-4 text-center">
                  <p className="text-text-secondary text-sm">XP Total</p>
                  <p className="text-2xl font-bold text-accent-blue">+{activeSession.totalXpGained}</p>
                </div>
                <div className="bg-bg-input rounded-lg p-4 text-center">
                  <p className="text-text-secondary text-sm">Gold Total</p>
                  <p className="text-2xl font-bold text-accent-gold">+{activeSession.totalGoldGained}</p>
                </div>
              </div>

              {activeSession.levelsGained > 0 && (
                <div className="bg-accent-gold/20 border border-accent-gold rounded-lg p-4 mb-6">
                  <p className="text-xl font-bold text-accent-gold text-center">
                    🎊 SUBIU {activeSession.levelsGained} NÍVEIS! 🎊
                  </p>
                  <p className="text-center">Level {activeSession.startLevel} → {activeSession.endLevel}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-input rounded-lg p-4">
                  <p className="text-text-secondary text-sm mb-2">Poções Usadas</p>
                  <p className="text-xl font-bold">💊 {activeSession.potionsUsed}</p>
                </div>
                <div className="bg-bg-input rounded-lg p-4">
                  <p className="text-text-secondary text-sm mb-2">HP Final</p>
                  <p className="text-xl font-bold text-accent-green">
                    {activeSession.finalHp}/{activeSession.finalMaxHp}
                  </p>
                </div>
              </div>

              {(() => {
                try {
                  const items = activeSession.totalItemsDropped 
                    ? (typeof activeSession.totalItemsDropped === 'string' 
                        ? JSON.parse(activeSession.totalItemsDropped) 
                        : activeSession.totalItemsDropped)
                    : [];
                  
                  if (items.length > 0) {
                    return (
                      <div className="mb-6">
                        <p className="font-bold mb-3">📦 Itens Obtidos:</p>
                        <div className="bg-bg-input rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="text-sm text-accent-green">
                              • {item.itemCode} <span className="text-accent-gold">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                } catch (e) {
                  return null;
                }
              })()}

              <div className={`border rounded-lg p-4 mb-6 ${
                activeSession.stoppedReason === 'fled' 
                  ? 'bg-accent-red/10 border-accent-red' 
                  : 'bg-accent-blue/10 border-accent-blue'
              }`}>
                <p className={`font-bold ${
                  activeSession.stoppedReason === 'fled' ? 'text-accent-red' : 'text-accent-blue'
                }`}>
                  {activeSession.stoppedMessage}
                </p>
              </div>

              <button
                onClick={handleCloseResult}
                className="w-full py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
              >
                Continuar Farmando!
              </button>
            </div>
          </div>
        )}

        {/* Farm Configuration */}
        <div className="bg-bg-panel rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-accent-gold">⚙️ Configuração do Farm</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enemy Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">1. Escolha o Monstro:</label>
              <select
                value={selectedEnemy}
                onChange={(e) => setSelectedEnemy(e.target.value)}
                className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold"
              >
                <option value="">Selecione um inimigo...</option>
                {enemies.map((enemy) => (
                  <option key={enemy.code} value={enemy.code}>
                    {enemy.name} (Lv {enemy.level}) - {enemy.xpReward} XP / {enemy.goldReward} Gold
                  </option>
                ))}
              </select>
            </div>

            {/* Potion Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                2. Poção Automática ({potions.length} disponíveis):
              </label>
              <select
                value={selectedPotion}
                onChange={(e) => setSelectedPotion(e.target.value)}
                className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold"
              >
                <option value="">Sem poção (apenas HP natural)</option>
                {potions.map((potion) => (
                  <option key={potion.item.code} value={potion.item.code}>
                    {potion.item.name} (x{potion.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* HP Percent */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                3. Usar poção quando HP {'<'} {hpPercent}%:
              </label>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={hpPercent}
                onChange={(e) => setHpPercent(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-text-secondary mt-1">
                <span>20%</span>
                <span className="font-bold text-accent-gold">{hpPercent}%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Max Battles */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                4. Máximo de batalhas:
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={maxBattles}
                onChange={(e) => setMaxBattles(parseInt(e.target.value))}
                className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold"
              />
              <p className="text-xs text-text-secondary mt-1">
                Recomendado: 20-100 batalhas
              </p>
            </div>
          </div>

          <div className="mt-6 bg-accent-blue/10 border border-accent-blue rounded-lg p-4">
            <p className="text-sm mb-2">📋 <strong>Como funciona:</strong></p>
            <ul className="text-sm text-text-secondary space-y-1 ml-4">
              <li>• O jogo vai lutar automaticamente contra o monstro escolhido</li>
              <li>• Quando seu HP ficar abaixo de {hpPercent}%, usa a poção automaticamente</li>
              <li>• Para quando: acabar as poções + HP baixo, morrer, ou atingir {maxBattles} batalhas</li>
              <li>• Todos XP, Gold e Itens são coletados automaticamente</li>
            </ul>
          </div>

          <button
            onClick={handleStartFarm}
            disabled={activeSession?.status === 'running' || !selectedEnemy || selectedCharacter.hp <= 0}
            className="w-full mt-6 py-4 bg-accent-gold hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors"
          >
            {activeSession?.status === 'running' ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Farm em Andamento...
              </span>
            ) : (
              '🚀 INICIAR FARM MODE!'
            )}
          </button>
        </div>

        {selectedCharacter.hp <= 0 && (
          <div className="bg-accent-red/20 border border-accent-red rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-accent-red mb-4">
              💀 Você está sem HP!
            </p>
            <p className="mb-4">Descanse para recuperar e continuar farmando.</p>
            <button
              onClick={handleRest}
              className="px-6 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
            >
              Descansar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
