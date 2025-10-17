import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, Hammer, TreePine, Backpack, Store, Castle, Settings } from 'lucide-react';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Tooltip, StatTooltip } from '../components/Tooltip';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { WelcomeTutorial } from '../components/Tutorial';
import { useToastContext } from '../components/ToastProvider';
import { StatsDistribution } from '../components/StatsDistribution';
import { DetailedStats } from '../components/DetailedStats';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CharacterEditModal } from '../components/CharacterEditModal';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const toast = useToastContext();

  useEffect(() => {
    // Show tutorial for first-time users
    const tutorialCompleted = localStorage.getItem('easycraft_tutorial_completed');
    const tutorialSkipped = localStorage.getItem('easycraft_tutorial_skipped');
    if (!tutorialCompleted && !tutorialSkipped) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }

    // Reload character data to get updated stats
    const loadCharacter = async () => {
      try {
        const updated = await characterService.getCharacter(selectedCharacter.id);
        selectCharacter(updated);
      } catch (error) {
        // Error handled by UI
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [selectedCharacter?.id]);

  if (!selectedCharacter || loading) {
    return <LoadingSpinner fullscreen message="Carregando dashboard..." size="lg" />;
  }

  const handleSaveAppearance = async (data: { headVariant: string; armsVariant: string; legsVariant: string; feetVariant: string }) => {
    try {
      const updated = await characterService.updateCharacterAppearance(selectedCharacter.id, data);
      selectCharacter(updated);
      toast.success('Aparência atualizada com sucesso!');
    } catch (error) {
      throw error;
    }
  };

  const quickActions = [
    { icon: <Flame className="w-5 h-5" />, label: 'Farm Mode', path: '/battle', variant: 'danger', tooltip: 'Batalha automática contra monstros!' },
    { icon: <Target className="w-5 h-5" />, label: 'Missões', path: '/quests', variant: 'info', tooltip: 'Complete missões por recompensas' },
    { icon: <Hammer className="w-5 h-5" />, label: 'Crafting', path: '/crafting', variant: 'purple', tooltip: 'Crie itens poderosos' },
    { icon: <TreePine className="w-5 h-5" />, label: 'Coleta', path: '/gathering', variant: 'success', tooltip: 'Colete recursos para crafting' },
    { icon: <Backpack className="w-5 h-5" />, label: 'Inventário', path: '/inventory', variant: 'success', tooltip: 'Gerencie itens e equipamentos' },
    { icon: <Store className="w-5 h-5" />, label: 'Marketplace', path: '/marketplace', variant: 'warning', tooltip: 'Compre e venda com outros jogadores' },
    { icon: <Castle className="w-5 h-5" />, label: 'Dungeons', path: '/dungeons', variant: 'danger', tooltip: 'Masmorras desafiadoras com bosses épicos!' },
    { icon: <Settings className="w-5 h-5" />, label: 'Editar Aparência', action: () => setShowEditModal(true), variant: 'secondary', tooltip: 'Customize a aparência do seu personagem' },
  ] as const;

  return (
    <PageLayout title="Dashboard" showBack={false}>
      <div className="space-y-6">
        {/* Character Overview Card */}
        <Card variant="highlighted">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex justify-center">
              <CharacterAvatar
                headVariant={selectedCharacter.headVariant}
                armsVariant={selectedCharacter.armsVariant}
                legsVariant={selectedCharacter.legsVariant}
                feetVariant={selectedCharacter.feetVariant}
                size="md"
                showBorder={true}
              />
            </div>
            <h2 className="text-3xl font-bold text-accent-gold mb-1">{selectedCharacter.name}</h2>
            <Badge variant="gold" size="lg">Nível {selectedCharacter.level}</Badge>
            
            {/* Alerta de Pontos Disponíveis */}
            {selectedCharacter.stats.statPoints > 0 && (
              <div className="mt-4 bg-accent-gold/20 border-2 border-accent-gold rounded-lg p-4 animate-pulse-glow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-accent-gold font-bold text-lg">⚠️ Pontos de Atributo Disponíveis!</p>
                    <p className="text-sm text-gray-300">Você tem {selectedCharacter.stats.statPoints} pontos para distribuir</p>
                  </div>
                  <Button
                    variant="warning"
                    onClick={() => setShowStatsModal(true)}
                  >
                    Distribuir Agora
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader title="Status" />
              <CardBody>
                <div className="space-y-4">
                  <ProgressBar
                    value={selectedCharacter.hp}
                    max={selectedCharacter.maxHp}
                    variant="health"
                    size="md"
                    showLabel
                    label="HP"
                  />
                  <div className="flex justify-between items-center">
                    <Tooltip content="Moeda do jogo">
                      <span className="cursor-help text-text-secondary">Gold:</span>
                    </Tooltip>
                    <Badge variant="gold">
                      <AnimatedNumber value={selectedCharacter.gold} suffix="g" />
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Tooltip content="Experiência acumulada">
                      <span className="cursor-help text-text-secondary">XP:</span>
                    </Tooltip>
                    <Badge variant="info">
                      <AnimatedNumber value={selectedCharacter.xp} />
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Atributos" />
              <CardBody>
              <div className="grid grid-cols-2 gap-3">
                <StatTooltip 
                  stat="STR" 
                  value={selectedCharacter.stats.totalStr}
                  description="Força - Aumenta dano físico"
                />
                {selectedCharacter.stats.totalStr > selectedCharacter.stats.str && (
                  <span className="text-xs text-accent-green">
                    (+{selectedCharacter.stats.totalStr - selectedCharacter.stats.str})
                  </span>
                )}
                
                <StatTooltip 
                  stat="AGI" 
                  value={selectedCharacter.stats.totalAgi}
                  description="Agilidade - Aumenta chance de atacar primeiro"
                />
                {selectedCharacter.stats.totalAgi > selectedCharacter.stats.agi && (
                  <span className="text-xs text-accent-green">
                    (+{selectedCharacter.stats.totalAgi - selectedCharacter.stats.agi})
                  </span>
                )}
                
                <StatTooltip 
                  stat="VIT" 
                  value={selectedCharacter.stats.totalVit}
                  description="Vitalidade - Aumenta HP máximo"
                />
                {selectedCharacter.stats.totalVit > selectedCharacter.stats.vit && (
                  <span className="text-xs text-accent-green">
                    (+{selectedCharacter.stats.totalVit - selectedCharacter.stats.vit})
                  </span>
                )}
                
                <StatTooltip 
                  stat="INT" 
                  value={selectedCharacter.stats.totalInt}
                  description="Inteligência - Afeta crafting e habilidades"
                />
                {selectedCharacter.stats.totalInt > selectedCharacter.stats.int && (
                  <span className="text-xs text-accent-green">
                    (+{selectedCharacter.stats.totalInt - selectedCharacter.stats.int})
                  </span>
                )}
                
                <StatTooltip 
                  stat="DEF" 
                  value={selectedCharacter.stats.totalDef}
                  description="Defesa - Reduz dano recebido"
                />
                {selectedCharacter.stats.totalDef > selectedCharacter.stats.def && (
                  <span className="text-xs text-accent-green">
                    (+{selectedCharacter.stats.totalDef - selectedCharacter.stats.def})
                  </span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-medium">
                <Button
                  variant="primary"
                  onClick={() => setShowDetailedStats(true)}
                  fullWidth
                  size="sm"
                >
                  📊 Ver Status Detalhado
                </Button>
              </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Ações Rápidas" />
              <CardBody>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <Tooltip key={index} content={action.tooltip}>
                      <Button
                        variant={action.variant as any}
                        onClick={() => {
                          if ('path' in action && action.path) {
                            navigate(action.path);
                          } else if ('action' in action && action.action) {
                            action.action();
                          }
                        }}
                        icon={action.icon}
                        fullWidth
                        className="justify-start"
                      >
                        {action.label}
                      </Button>
                    </Tooltip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Card>
      </div>

      {/* Tutorial */}
      {showTutorial && (
        <WelcomeTutorial onComplete={() => setShowTutorial(false)} />
      )}
      
      {showStatsModal && selectedCharacter && (
        <StatsDistribution
          character={selectedCharacter}
          onClose={() => setShowStatsModal(false)}
          onSuccess={async () => {
            const updated = await characterService.getCharacter(selectedCharacter.id);
            selectCharacter(updated);
            toast.success('Pontos distribuídos com sucesso!');
          }}
        />
      )}

      {showDetailedStats && selectedCharacter && (
        <DetailedStats
          character={selectedCharacter}
          onClose={() => setShowDetailedStats(false)}
        />
      )}

      {showEditModal && selectedCharacter && (
        <CharacterEditModal
          character={selectedCharacter}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveAppearance}
        />
      )}
    </PageLayout>
  );
}
