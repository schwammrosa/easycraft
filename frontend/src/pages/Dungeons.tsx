import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { 
  dungeonService, 
  Dungeon, 
  DungeonRun, 
  BattleResult,
  CooldownCheck 
} from '../services/dungeon.service';
import { characterService } from '../services/character.service';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Dungeons() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();

  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [activeRun, setActiveRun] = useState<DungeonRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Battle states
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  
  // Cooldown states
  const [cooldowns, setCooldowns] = useState<Record<number, CooldownCheck>>({});

  // UI states
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [activeTab, setActiveTab] = useState<'dungeons' | 'history'>('dungeons');
  const [history, setHistory] = useState<DungeonRun[]>([]);

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadData();
  }, [selectedCharacter]);

  const loadData = async () => {
    if (!selectedCharacter) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [dungeonsData, activeRunData, historyData] = await Promise.all([
        dungeonService.getAllDungeons(),
        dungeonService.getActiveRun(selectedCharacter.id),
        dungeonService.getHistory(selectedCharacter.id),
      ]);

      setDungeons(dungeonsData);
      setActiveRun(activeRunData);
      setHistory(historyData);

      // Load cooldowns for each dungeon
      const cooldownPromises = dungeonsData.map(d => 
        dungeonService.canEnterDungeon(selectedCharacter.id, d.id)
          .then(result => ({ id: d.id, result }))
      );
      
      const cooldownResults = await Promise.all(cooldownPromises);
      const cooldownMap: Record<number, CooldownCheck> = {};
      cooldownResults.forEach(({ id, result }) => {
        cooldownMap[id] = result;
      });
      setCooldowns(cooldownMap);

    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao carregar dungeons');
    } finally {
      setLoading(false);
    }
  };

  const handleEnterDungeon = async (dungeonId: number) => {
    if (!selectedCharacter) return;

    const cooldown = cooldowns[dungeonId];
    if (!cooldown?.canEnter) {
      const endTime = new Date(cooldown?.cooldownEnd || '');
      const remaining = Math.ceil((endTime.getTime() - Date.now()) / 1000 / 60);
      setError(`Cooldown ativo! Aguarde ${remaining} minutos.`);
      return;
    }

    try {
      setError('');
      const run = await dungeonService.enterDungeon(selectedCharacter.id, dungeonId, selectedDifficulty);
      setActiveRun(run);
      setSuccess(`Você entrou na dungeon: ${run.dungeon.name}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao entrar na dungeon');
    }
  };

  const handleBattle = async () => {
    if (!selectedCharacter || !activeRun) return;

    setBattling(true);
    setError('');
    setBattleResult(null);

    try {
      const result = await dungeonService.battleFloor(
        selectedCharacter.id,
        activeRun.id,
        activeRun.currentFloor
      );

      setBattleResult(result);

      // Update character
      const updatedChar = await characterService.getCharacter(selectedCharacter.id);
      selectCharacter(updatedChar);

      // If dungeon continues or is complete, reload active run
      if (result.victory) {
        if (!result.dungeonCompleted) {
          // Reload active run to get updated floor
          const updatedRun = await dungeonService.getActiveRun(selectedCharacter.id);
          setActiveRun(updatedRun);
        } else {
          // Dungeon completed!
          setActiveRun(null);
          loadData(); // Reload everything including cooldown
        }
      } else {
        // Failed - dungeon run ended
        setActiveRun(null);
        loadData();
      }

    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro na batalha');
    } finally {
      setBattling(false);
    }
  };

  const handleGiveUp = async () => {
    if (!window.confirm('Desistir da dungeon? Você perderá todo o progresso!')) {
      return;
    }
    
    setActiveRun(null);
    setBattleResult(null);
    loadData();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-accent-green';
      case 'normal': return 'text-accent-blue';
      case 'hard': return 'text-accent-red';
      default: return 'text-white';
    }
  };

  const getDifficultyMultiplier = (diff: string) => {
    switch (diff) {
      case 'easy': return '100%';
      case 'normal': return '150%';
      case 'hard': return '300%';
      default: return '100%';
    }
  };

  // Helper function for future use
  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // };

  if (!selectedCharacter) return null;

  if (loading) {
    return <LoadingSpinner fullscreen message="Carregando dungeons..." size="lg" />;
  }

  return (
    <PageLayout title="🏰 Dungeons" showBack={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-accent-gold">Dungeons Disponíveis</h2>
            <p className="text-text-secondary">
              {selectedCharacter.name} | Level {selectedCharacter.level} | HP: {selectedCharacter.hp}/{selectedCharacter.maxHp}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
          >
            ← Voltar
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-accent-red bg-opacity-20 border border-accent-red rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-accent-green bg-opacity-20 border border-accent-green rounded-lg">
            {success}
          </div>
        )}

        {/* Active Run - Battle Interface */}
        {activeRun && (
          <div className="mb-8 bg-bg-panel rounded-lg p-6 border-2 border-accent-gold">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-accent-gold">
                {activeRun.dungeon.name}
              </h2>
              <span className={`text-lg font-semibold ${getDifficultyColor(activeRun.difficulty)}`}>
                {activeRun.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Floor Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-lg">
                  Floor {activeRun.currentFloor} / {activeRun.dungeon.maxFloors}
                </span>
                <span className="text-text-secondary">
                  Gold: {activeRun.goldEarned}g | XP: {activeRun.expEarned}
                </span>
              </div>
              <div className="w-full bg-primary-dark rounded-full h-3">
                <div
                  className="bg-accent-gold h-3 rounded-full transition-all"
                  style={{ width: `${(activeRun.currentFloor / activeRun.dungeon.maxFloors) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Floor Info */}
            {dungeons.find(d => d.id === activeRun.dungeonId)?.floors
              .find(f => f.floorNumber === activeRun.currentFloor) && (
              <div className="bg-primary-dark rounded-lg p-4 mb-6">
                {(() => {
                  const floor = dungeons.find(d => d.id === activeRun.dungeonId)!.floors
                    .find(f => f.floorNumber === activeRun.currentFloor)!;
                  return (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold">
                          {floor.isBoss ? '👑 BOSS FLOOR' : '⚔️ Floor ' + floor.floorNumber}
                        </h3>
                        <span className="text-text-secondary">
                          {floor.enemyCount}x {floor.enemy.name} (Lv {floor.enemy.level})
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-text-secondary">Recompensa:</span>
                          <div className="font-semibold text-accent-gold">
                            {Math.floor(floor.goldReward * parseFloat(getDifficultyMultiplier(activeRun.difficulty).replace('%', '')) / 100)}g
                          </div>
                        </div>
                        <div>
                          <span className="text-text-secondary">EXP:</span>
                          <div className="font-semibold text-accent-blue">
                            {Math.floor(floor.expReward * parseFloat(getDifficultyMultiplier(activeRun.difficulty).replace('%', '')) / 100)}
                          </div>
                        </div>
                        <div>
                          <span className="text-text-secondary">Loot Drop:</span>
                          <div className="font-semibold text-accent-green">30%</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Battle Result */}
            {battleResult && (
              <div className={`mb-6 p-6 rounded-lg border-2 ${
                battleResult.victory
                  ? 'bg-accent-green bg-opacity-10 border-accent-green'
                  : 'bg-accent-red bg-opacity-10 border-accent-red'
              }`}>
                <h3 className="text-2xl font-bold mb-4">
                  {battleResult.victory ? '✅ VITÓRIA!' : '💀 DERROTA!'}
                </h3>
                
                {battleResult.victory ? (
                  <div>
                    <p className="mb-4">Você derrotou os inimigos!</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-text-secondary">Recompensas:</span>
                        <div className="text-accent-gold font-semibold">
                          +{battleResult.goldEarned}g | +{battleResult.expEarned} XP
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Seu HP:</span>
                        <div className={battleResult.playerHpRemaining > 50 ? 'text-accent-green' : 'text-accent-red'}>
                          {battleResult.playerHpRemaining} / {selectedCharacter.maxHp}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>Dano Causado: <span className="font-semibold">{battleResult.playerDamageDealt}</span></div>
                      <div>Dano Recebido: <span className="font-semibold">{battleResult.playerDamageTaken}</span></div>
                    </div>
                    {battleResult.itemsObtained.length > 0 && (
                      <div className="text-accent-green">
                        🎁 Item obtido: {battleResult.itemsObtained.length}x items!
                      </div>
                    )}
                    {battleResult.dungeonCompleted && (
                      <div className="mt-4 p-4 bg-accent-gold bg-opacity-20 border border-accent-gold rounded-lg">
                        <p className="text-xl font-bold text-accent-gold">🎉 DUNGEON COMPLETA!</p>
                        <p className="text-sm">Parabéns! Você completou a dungeon!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">Você foi derrotado...</p>
                    <p className="text-sm text-text-secondary">
                      A run foi encerrada. Descanse e tente novamente!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!battleResult && (
                <>
                  <button
                    onClick={handleBattle}
                    disabled={battling || selectedCharacter.hp <= 0}
                    className="flex-1 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {battling ? 'Lutando...' : '⚔️ Lutar!'}
                  </button>
                  <button
                    onClick={handleGiveUp}
                    className="px-6 py-3 bg-accent-red hover:bg-opacity-80 rounded-lg font-semibold"
                  >
                    🏃 Desistir
                  </button>
                </>
              )}
              {battleResult && !battleResult.dungeonCompleted && battleResult.victory && (
                <button
                  onClick={() => setBattleResult(null)}
                  className="flex-1 py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
                >
                  ➡️ Continuar para Floor {activeRun.currentFloor}
                </button>
              )}
              {battleResult && (battleResult.dungeonCompleted || !battleResult.victory) && (
                <button
                  onClick={() => {
                    setBattleResult(null);
                    setActiveRun(null);
                  }}
                  className="flex-1 py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
                >
                  ✅ Fechar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        {!activeRun && (
          <div className="mb-6">
            <div className="flex gap-4 border-b border-primary-medium">
              <button
                onClick={() => setActiveTab('dungeons')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'dungeons'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🏰 Dungeons
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'history'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📜 Histórico
              </button>
            </div>
          </div>
        )}

        {/* Dungeons List */}
        {!activeRun && activeTab === 'dungeons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dungeons.map((dungeon) => {
              const cooldown = cooldowns[dungeon.id];
              const canEnter = cooldown?.canEnter ?? false;
              let cooldownText = '';
              
              if (!canEnter && cooldown?.cooldownEnd) {
                const endTime = new Date(cooldown.cooldownEnd);
                const remaining = Math.ceil((endTime.getTime() - Date.now()) / 1000 / 60);
                const hours = Math.floor(remaining / 60);
                const mins = remaining % 60;
                cooldownText = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
              }

              return (
                <div
                  key={dungeon.id}
                  className="bg-bg-panel rounded-lg p-6 border border-primary-medium hover:border-accent-gold transition"
                >
                  <h3 className="text-xl font-bold mb-2">{dungeon.name}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {dungeon.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Nível Recomendado:</span>
                      <span className="font-semibold">{dungeon.recommendedLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Floors:</span>
                      <span className="font-semibold">{dungeon.maxFloors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Cooldown:</span>
                      <span className="font-semibold">{dungeon.cooldownHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Status:</span>
                      {canEnter ? (
                        <span className="font-semibold text-accent-green">✅ Disponível</span>
                      ) : (
                        <span className="font-semibold text-accent-red">⏰ {cooldownText}</span>
                      )}
                    </div>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Dificuldade:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDifficulty('easy')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                          selectedDifficulty === 'easy'
                            ? 'bg-accent-green text-white'
                            : 'bg-primary-dark text-accent-green hover:bg-primary-medium'
                        }`}
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => setSelectedDifficulty('normal')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                          selectedDifficulty === 'normal'
                            ? 'bg-accent-blue text-white'
                            : 'bg-primary-dark text-accent-blue hover:bg-primary-medium'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setSelectedDifficulty('hard')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                          selectedDifficulty === 'hard'
                            ? 'bg-accent-red text-white'
                            : 'bg-primary-dark text-accent-red hover:bg-primary-medium'
                        }`}
                      >
                        Hard
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-2 text-center">
                      Recompensas: {getDifficultyMultiplier(selectedDifficulty)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEnterDungeon(dungeon.id)}
                    disabled={!canEnter || selectedCharacter.hp <= 0}
                    className="w-full py-3 bg-accent-gold hover:bg-opacity-80 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedCharacter.hp <= 0 
                      ? '💀 Sem HP' 
                      : canEnter
                      ? '🚪 Entrar na Dungeon'
                      : '⏰ Em Cooldown'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        {!activeRun && activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center text-text-secondary py-12">
                Você ainda não completou nenhuma dungeon
              </div>
            ) : (
              history.map((run) => (
                <div key={run.id} className="bg-bg-panel rounded-lg p-4 border border-primary-medium">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{run.dungeon.name}</h4>
                      <p className="text-sm text-text-secondary">
                        {new Date(run.startedAt).toLocaleDateString()} às{' '}
                        {new Date(run.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        run.status === 'completed' ? 'text-accent-green' :
                        run.status === 'failed' ? 'text-accent-red' :
                        'text-accent-blue'
                      }`}>
                        {run.status === 'completed' ? '✅ Completa' :
                         run.status === 'failed' ? '💀 Falhou' :
                         '⏳ Em Progresso'}
                      </span>
                      <p className={`text-sm ${getDifficultyColor(run.difficulty)}`}>
                        {run.difficulty.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Progresso:</span>
                      <p className="font-semibold">{run.currentFloor}/{run.dungeon.maxFloors}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Gold:</span>
                      <p className="font-semibold text-accent-gold">{run.goldEarned}g</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">EXP:</span>
                      <p className="font-semibold text-accent-blue">{run.expEarned}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Dano:</span>
                      <p className="font-semibold">{run.totalDamageDealt}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
