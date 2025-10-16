import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Heart, Swords, Trophy, Coins, Zap } from 'lucide-react';
import { battleService, Enemy, BattleResult } from '../services/battle.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
    return <LoadingSpinner fullscreen message="Carregando inimigos..." size="lg" />;
  }

  if (!selectedCharacter) return null;

  return (
    <PageLayout 
      title="Batalha" 
      showBack={true}
      actions={
        <div className="flex gap-2">
          <Button
            variant="warning"
            onClick={() => navigate('/battle/farm')}
            icon={<Flame className="w-4 h-4" />}
          >
            Farm Mode
          </Button>
          {selectedCharacter.hp < selectedCharacter.maxHp && (
            <Button
              variant="success"
              onClick={handleRest}
              icon={<Heart className="w-4 h-4" />}
            >
              Descansar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Character HP Status */}
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
                <p className="text-sm text-text-secondary">Pontos de Vida</p>
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

        {/* Battle Result Modal */}
        <Modal
          isOpen={!!battleResult}
          onClose={handleClose}
          title={battleResult?.victory ? '🎉 Vitória!' : '💀 Derrota!'}
          size="lg"
          footer={
            <Button variant="primary" onClick={handleClose} fullWidth>
              Continuar
            </Button>
          }
        >
          {battleResult && (
            <div className="space-y-6">

              {battleResult.victory && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-accent-blue/10 rounded-lg">
                    <span className="flex items-center gap-2"><Zap className="w-5 h-5" /> XP Ganho:</span>
                    <Badge variant="info" size="lg">+{battleResult.xpGained}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-accent-gold/10 rounded-lg">
                    <span className="flex items-center gap-2"><Coins className="w-5 h-5" /> Gold Ganho:</span>
                    <Badge variant="gold" size="lg">+{battleResult.goldGained}</Badge>
                  </div>
                  
                  {battleResult.levelUp && (
                    <Card variant="highlighted" className="animate-pulse-glow">
                      <CardBody className="text-center">
                        <Trophy className="w-16 h-16 mx-auto mb-2 text-accent-gold" />
                        <p className="text-2xl font-bold text-accent-gold mb-2">
                          LEVEL UP!
                        </p>
                        <Badge variant="gold" size="lg">Nível {battleResult.levelUp.newLevel}</Badge>
                        <p className="mt-2 text-accent-green">+{battleResult.levelUp.statPointsGained} Pontos de Atributo</p>
                      </CardBody>
                    </Card>
                  )}

                  {battleResult.itemsDropped.length > 0 && (
                    <div>
                      <p className="font-bold mb-2 text-lg">Itens Obtidos:</p>
                      <div className="space-y-1">
                        {battleResult.itemsDropped.map((item, i) => (
                          <Badge key={i} variant="success" size="md" className="mr-2">
                            {item.itemCode} x{item.quantity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-bold mb-3 text-lg">Log da Batalha:</h3>
                <div className="bg-bg-input rounded-lg p-4 max-h-64 overflow-y-auto space-y-2 text-sm">
                  {battleResult.turns.map((turn) => (
                    <div key={turn.turn} className={turn.isCritical ? 'text-accent-gold font-bold animate-pulse' : ''}>
                      <Badge variant="default" size="sm">Turno {turn.turn}</Badge>{' '}
                      {turn.attacker} causou{' '}
                      <span className="text-accent-red font-bold">{turn.damage}</span> de dano em {turn.defender}
                      {turn.isCritical && <Badge variant="warning" size="sm" className="ml-2">CRÍTICO!</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Enemy List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enemies.map((enemy) => (
            <Card key={enemy.id} className="hover:scale-105 transition-all duration-300 animate-fade-in">
              <CardBody>
                <div className="text-center mb-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-bg-input to-primary-dark rounded-full mb-4 flex items-center justify-center text-5xl shadow-glow-sm">
                    {enemy.level <= 5 ? '🟢' : enemy.level <= 10 ? '🟡' : enemy.level <= 15 ? '🔴' : '💀'}
                  </div>
                  <h3 className="text-xl font-bold text-accent-gold">{enemy.name}</h3>
                  <p className="text-sm text-text-secondary mb-2">{enemy.description}</p>
                  <Badge 
                    variant={enemy.level <= 5 ? 'success' : enemy.level <= 10 ? 'warning' : 'error'}
                    size="md"
                  >
                    Nível {enemy.level}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Badge variant="success" size="sm">HP: {enemy.hp}</Badge>
                  <Badge variant="error" size="sm">STR: {enemy.str}</Badge>
                  <Badge variant="info" size="sm">AGI: {enemy.agi}</Badge>
                  <Badge variant="purple" size="sm">DEF: {enemy.def}</Badge>
                </div>

                <div className="border-t border-primary-medium pt-4 mb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Recompensas:</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="info" size="sm"><Zap className="w-3 h-3 mr-1" />{enemy.xpReward} XP</Badge>
                    <Badge variant="gold" size="sm"><Coins className="w-3 h-3 mr-1" />{enemy.goldReward}g</Badge>
                  </div>
                </div>

                <Button
                  variant="danger"
                  onClick={() => handleBattle(enemy)}
                  disabled={battling || selectedCharacter.hp <= 0}
                  isLoading={battling}
                  icon={<Swords className="w-5 h-5" />}
                  fullWidth
                >
                  Batalhar!
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {selectedCharacter.hp <= 0 && (
          <Card variant="highlighted" className="border-accent-red animate-shake">
            <CardBody className="text-center">
              <div className="text-6xl mb-4">💀</div>
              <p className="text-2xl font-bold text-accent-red mb-2">
                Você está sem HP!
              </p>
              <p className="text-text-secondary mb-4">Descanse para recuperar e continuar lutando.</p>
              <Button
                variant="success"
                size="lg"
                onClick={handleRest}
                icon={<Heart className="w-5 h-5" />}
              >
                Descansar Agora
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
