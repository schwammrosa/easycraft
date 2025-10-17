import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { battleService, Enemy, FarmModeConfig } from '../services/battle.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { inventoryService } from '../services/inventory.service';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CharacterAvatar } from '../components/CharacterAvatar';

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
  const [dismissedSessionId, setDismissedSessionId] = useState<number | null>(() => {
    // Carrega do localStorage ao iniciar
    const saved = localStorage.getItem('easycraft_dismissed_farm_session');
    return saved ? parseInt(saved) : null;
  });
  const pollingInterval = useRef<any>(null);

  // Config states
  const [selectedEnemy, setSelectedEnemy] = useState<string>('');
  const [selectedPotion, setSelectedPotion] = useState<string>('');
  const [hpPercent, setHpPercent] = useState<number>(50);
  const [maxBattles, setMaxBattles] = useState<number>(10);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');
  const [history, setHistory] = useState<any[]>([]);

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
      const [enemyList, inventory, farmHistory] = await Promise.all([
        battleService.getEnemies(selectedCharacter.id),
        inventoryService.getInventory(selectedCharacter.id),
        battleService.getFarmHistory(selectedCharacter.id, 10)
      ]);
      
      setEnemies(enemyList);
      setHistory(farmHistory);
      
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
    localStorage.removeItem('easycraft_dismissed_farm_session');

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
      // Salva no localStorage para persistir entre navegações
      localStorage.setItem('easycraft_dismissed_farm_session', activeSession.id.toString());
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
    return <LoadingSpinner fullscreen message="Carregando Farm Mode..." size="lg" />;
  }

  if (!selectedCharacter) return null;

  return (
    <PageLayout 
      title="🔥 Farm Mode"
      showBack={true}
      actions={
        selectedCharacter.hp < selectedCharacter.maxHp && (
          <Button
            variant="success"
            onClick={handleRest}
            icon={<Heart className="w-4 h-4" />}
          >
            Descansar
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Character HP */}
        <Card variant="highlighted" className="animate-fade-in">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-accent-gold">{selectedCharacter.name}</h3>
                <Badge variant="gold" size="md">Nível {selectedCharacter.level}</Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent-green">
                  {selectedCharacter.hp} / {selectedCharacter.maxHp}
                </div>
                <p className="text-sm text-text-secondary">HP Atual</p>
              </div>
            </div>
            <ProgressBar
              value={selectedCharacter.hp}
              max={selectedCharacter.maxHp}
              variant="health"
              size="lg"
            />
          </CardBody>
        </Card>

        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg animate-shake">
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

            {/* Battle Visual Arena */}
            <div className="mt-4 bg-gradient-to-b from-green-900/20 to-green-800/20 border-2 border-green-700/50 rounded-lg p-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 20px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <p className="text-sm text-center mb-4">
                  <strong className="text-accent-blue">⚔️ Lutando contra: {activeSession.enemyName}</strong>
                </p>
                
                {/* Battle Arena */}
                <div className="flex items-center justify-between gap-4">
                  {/* Player Avatar */}
                  <div className="text-center">
                    <CharacterAvatar
                      headVariant={selectedCharacter.headVariant}
                      armsVariant={selectedCharacter.armsVariant}
                      legsVariant={selectedCharacter.legsVariant}
                      feetVariant={selectedCharacter.feetVariant}
                      size="lg"
                      className="animate-bounce"
                    />
                    <p className="text-xs mt-2 font-bold text-accent-gold">{selectedCharacter.name}</p>
                    <p className="text-xs text-accent-green">HP: {selectedCharacter?.hp}/{selectedCharacter?.maxHp}</p>
                  </div>
                  
                  {/* VS Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-accent-red text-white font-bold text-2xl px-4 py-2 rounded-lg rotate-12 shadow-lg">
                      VS
                    </div>
                  </div>
                  
                  {/* Enemy Avatar */}
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-red-900 to-red-700 rounded-lg border-2 border-red-500 flex items-center justify-center shadow-xl animate-pulse">
                      <span className="text-8xl">👹</span>
                    </div>
                    <p className="text-xs mt-2 font-bold text-accent-red">{activeSession.enemyName}</p>
                    <p className="text-xs text-text-secondary">💀 Inimigo</p>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mt-4 text-center">
                  💊 Poções usadas: {activeSession.potionsUsed}
                </p>
              </div>
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

        {/* Farm Configuration with Tabs */}
        {!activeSession && (
          <div className="bg-bg-panel rounded-lg p-6 mb-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-primary-medium">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'config'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ⚙️ Configuração do Farm
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📜 Histórico
              </button>
            </div>

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enemy Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">1. Escolha o Monstro:</label>
              <select
                value={selectedEnemy}
                onChange={(e) => setSelectedEnemy(e.target.value)}
                className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold text-white"
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
              <label className="block text-sm font-semibold mb-2 text-white">
                2. Poção Automática ({potions.length} disponíveis):
              </label>
              <select
                value={selectedPotion}
                onChange={(e) => setSelectedPotion(e.target.value)}
                className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold text-white"
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
              <label className="block text-sm font-semibold mb-2 text-white">
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
              <label className="block text-sm font-semibold mb-2 text-white">
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
                ⏱️ Tempo estimado: ~{Math.ceil(maxBattles * 3 / 60)} min ({maxBattles * 3}s)
              </p>
            </div>
                </div>

                <div className="mt-6 bg-accent-blue/10 border border-accent-blue rounded-lg p-4">
                  <p className="text-sm mb-2 text-white">📋 <strong>Como funciona:</strong></p>
                  <ul className="text-sm text-white space-y-1 ml-4">
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
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-text-secondary">
                    <p className="text-4xl mb-4">📜</p>
                    <p>Nenhuma sessão de farm ainda</p>
                  </div>
                ) : (
                  history.map((session) => (
                    <div key={session.id} className="bg-primary-dark rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold">{session.enemyName || 'Monstro'}</h4>
                          <p className="text-sm text-text-secondary">
                            {new Date(session.startedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${
                            session.status === 'completed' ? 'text-accent-green' :
                            session.status === 'fled' ? 'text-accent-red' :
                            'text-accent-blue'
                          }`}>
                            {session.status === 'completed' ? '✅ Completo' :
                             session.status === 'fled' ? '❌ Fugiu' :
                             '⌛ Em Progresso'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-text-secondary">Batalhas:</span>
                          <p className="font-semibold">{session.battlesWon}/{session.maxBattles}</p>
                        </div>
                        <div>
                          <span className="text-text-secondary">XP Ganha:</span>
                          <p className="font-semibold text-accent-blue">+{session.totalXpGained}</p>
                        </div>
                        <div>
                          <span className="text-text-secondary">Gold:</span>
                          <p className="font-semibold text-accent-gold">+{session.totalGoldEarned}g</p>
                        </div>
                        <div>
                          <span className="text-text-secondary">Levels:</span>
                          <p className="font-semibold text-accent-green">
                            {session.levelsGained > 0 ? `+${session.levelsGained}` : '-'}
                          </p>
                        </div>
                      </div>

                      {/* Stop Reason */}
                      {session.stopReason && (
                        <div className={`p-3 rounded-lg text-sm ${
                          session.status === 'completed' ? 'bg-accent-green/20 border border-accent-green text-accent-green' :
                          session.status === 'fled' ? 'bg-accent-red/20 border border-accent-red text-accent-red' :
                          'bg-accent-blue/20 border border-accent-blue text-accent-blue'
                        }`}>
                          <p>{session.stopReason}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

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
    </PageLayout>
  );
}
