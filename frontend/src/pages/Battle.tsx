import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { battleService, Enemy, BattleResult } from '../services/battle.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';

export function Battle() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [loading, setLoading] = useState(true);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadEnemies();
  }, [selectedCharacter]);

  const loadEnemies = async () => {
    if (!selectedCharacter) return;

    try {
      const enemyList = await battleService.getEnemies(selectedCharacter.id);
      setEnemies(enemyList);
    } catch (err: any) {
      setError('Erro ao carregar inimigos');
    } finally {
      setLoading(false);
    }
  };

  const handleBattle = async (enemy: Enemy) => {
    if (!selectedCharacter) return;

    setBattling(true);
    setError('');
    setBattleResult(null);

    try {
      const result = await battleService.startBattle(selectedCharacter.id, enemy.code);
      setBattleResult(result);

      // Reload character data
      const updated = await characterService.getCharacter(selectedCharacter.id);
      selectCharacter(updated);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro na batalha');
    } finally {
      setBattling(false);
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

  const handleClose = () => {
    setBattleResult(null);
    loadEnemies();
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
            <h1 className="text-3xl font-bold text-accent-gold">Batalha</h1>
            <p className="text-text-secondary">
              {selectedCharacter.name} - HP: {selectedCharacter.hp}/{selectedCharacter.maxHp}
            </p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/battle/farm')}
              className="px-4 py-2 bg-accent-gold hover:bg-opacity-80 rounded-lg font-semibold"
            >
              🔥 Farm Mode
            </button>
            {selectedCharacter.hp < selectedCharacter.maxHp && (
              <button
                onClick={handleRest}
                className="px-4 py-2 bg-accent-green hover:bg-opacity-80 rounded-lg"
              >
                Descansar (Recuperar HP)
              </button>
            )}
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

        {/* Battle Result Modal */}
        {battleResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className={`text-3xl font-bold text-center mb-6 ${battleResult.victory ? 'text-accent-green' : 'text-accent-red'}`}>
                {battleResult.victory ? '🎉 Vitória!' : '💀 Derrota!'}
              </h2>

              {battleResult.victory && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>XP Ganho:</span>
                    <span className="text-accent-blue font-bold">+{battleResult.xpGained}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Gold Ganho:</span>
                    <span className="text-accent-gold font-bold">+{battleResult.goldGained}</span>
                  </div>
                  
                  {battleResult.levelUp && (
                    <div className="bg-accent-gold/20 border border-accent-gold rounded-lg p-4 mt-4">
                      <p className="text-xl font-bold text-accent-gold text-center">
                        🎊 LEVEL UP! 🎊
                      </p>
                      <p className="text-center">Novo Nível: {battleResult.levelUp.newLevel}</p>
                      <p className="text-center">+{battleResult.levelUp.statPointsGained} STR</p>
                    </div>
                  )}

                  {battleResult.itemsDropped.length > 0 && (
                    <div className="mt-4">
                      <p className="font-bold mb-2">Itens Obtidos:</p>
                      {battleResult.itemsDropped.map((item, i) => (
                        <div key={i} className="text-sm text-accent-green">
                          • {item.itemCode} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold mb-3">Log da Batalha:</h3>
                <div className="bg-bg-input rounded-lg p-4 max-h-64 overflow-y-auto space-y-2 text-sm">
                  {battleResult.turns.map((turn) => (
                    <div key={turn.turn} className={turn.isCritical ? 'text-accent-gold font-bold' : ''}>
                      <span className="text-text-secondary">Turno {turn.turn}:</span> {turn.attacker} causou{' '}
                      <span className="text-accent-red">{turn.damage}</span> de dano em {turn.defender}
                      {turn.isCritical && ' (CRÍTICO!)'}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Enemy List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enemies.map((enemy) => (
            <div key={enemy.id} className="bg-bg-panel rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto bg-bg-input rounded-full mb-4 flex items-center justify-center text-5xl">
                  {enemy.level <= 5 ? '🟢' : enemy.level <= 10 ? '🟡' : enemy.level <= 15 ? '🔴' : '💀'}
                </div>
                <h3 className="text-xl font-bold text-accent-gold">{enemy.name}</h3>
                <p className="text-sm text-text-secondary">{enemy.description}</p>
                <p className="text-sm mt-2">Nível {enemy.level}</p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>HP:</span>
                  <span className="text-accent-green">{enemy.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span>STR:</span>
                  <span className="text-accent-red">{enemy.str}</span>
                </div>
                <div className="flex justify-between">
                  <span>AGI:</span>
                  <span className="text-accent-blue">{enemy.agi}</span>
                </div>
                <div className="flex justify-between">
                  <span>DEF:</span>
                  <span className="text-accent-purple">{enemy.def}</span>
                </div>
              </div>

              <div className="border-t border-primary-medium pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span>XP:</span>
                  <span className="text-accent-blue">{enemy.xpReward}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gold:</span>
                  <span className="text-accent-gold">{enemy.goldReward}</span>
                </div>
              </div>

              <button
                onClick={() => handleBattle(enemy)}
                disabled={battling || selectedCharacter.hp <= 0}
                className="w-full py-2 bg-accent-red hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {battling ? 'Lutando...' : 'Batalhar!'}
              </button>
            </div>
          ))}
        </div>

        {selectedCharacter.hp <= 0 && (
          <div className="mt-8 bg-accent-red/20 border border-accent-red rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-accent-red mb-4">
              💀 Você está sem HP!
            </p>
            <p className="mb-4">Descanse para recuperar e continuar lutando.</p>
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
