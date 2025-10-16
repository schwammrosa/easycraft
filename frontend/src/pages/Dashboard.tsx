import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { characterService } from '../services/character.service';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Tooltip, StatTooltip } from '../components/Tooltip';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { WelcomeTutorial } from '../components/Tutorial';
import { useToastContext } from '../components/ToastProvider';
import { StatsDistribution } from '../components/StatsDistribution';

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
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
        console.error('Error loading character:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [selectedCharacter?.id]);

  if (!selectedCharacter || loading) {
    return <LoadingSpinner fullscreen message="Carregando dashboard..." size="lg" />;
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    toast.success('Tutorial concluído! Bem-vindo ao EasyCraft!');
  };

  const hpPercentage = (selectedCharacter.hp / selectedCharacter.maxHp) * 100;
  const hpColor = hpPercentage > 50 ? 'bg-accent-green' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-accent-red';

  return (
    <div className="min-h-screen bg-bg-main p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-accent-gold">Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/characters')}
              className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
            >
              Trocar Personagem
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-accent-red hover:bg-opacity-80 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-bg-panel rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto bg-bg-input rounded-full mb-4 flex items-center justify-center text-6xl">
              🎮
            </div>
            <h2 className="text-2xl font-bold text-accent-gold">{selectedCharacter.name}</h2>
            <p className="text-text-secondary">Nível {selectedCharacter.level}</p>
            
            {/* Alerta de Pontos Disponíveis */}
            {selectedCharacter.stats.statPoints > 0 && (
              <div className="mt-4 bg-accent-gold/20 border-2 border-accent-gold rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-gold font-bold text-lg">⚠️ Pontos de Atributo Disponíveis!</p>
                    <p className="text-sm text-gray-300">Você tem {selectedCharacter.stats.statPoints} pontos para distribuir</p>
                  </div>
                  <button
                    onClick={() => setShowStatsModal(true)}
                    className="bg-accent-gold hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded transition-colors"
                  >
                    Distribuir Agora
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Tooltip content="Pontos de vida atual">
                      <span className="cursor-help">HP:</span>
                    </Tooltip>
                    <span className="text-accent-green font-bold">
                      <AnimatedNumber value={selectedCharacter.hp} />/
                      <AnimatedNumber value={selectedCharacter.maxHp} />
                    </span>
                  </div>
                  <div className="w-full bg-bg-dark rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${hpColor}`}
                      style={{ width: `${hpPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Tooltip content="Moeda do jogo">
                    <span className="cursor-help">Gold:</span>
                  </Tooltip>
                  <span className="text-accent-gold font-bold">
                    <AnimatedNumber value={selectedCharacter.gold} suffix="g" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <Tooltip content="Experiência acumulada">
                    <span className="cursor-help">XP:</span>
                  </Tooltip>
                  <span className="text-accent-blue font-bold">
                    <AnimatedNumber value={selectedCharacter.xp} />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Atributos</h3>
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
            </div>

            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Ações</h3>
              <div className="space-y-2">
                <Tooltip content="Enfrente inimigos e ganhe XP!">
                  <button
                    onClick={() => navigate('/battle')}
                    className="w-full py-2 bg-accent-red hover:bg-opacity-80 rounded-lg transition-all hover:scale-105"
                  >
                    ⚔️ Batalha
                  </button>
                </Tooltip>
                <Tooltip content="Complete missões por recompensas">
                  <button
                    onClick={() => navigate('/quests')}
                    className="w-full py-2 bg-accent-blue hover:bg-opacity-80 rounded-lg transition-all hover:scale-105"
                  >
                    🎯 Missões
                  </button>
                </Tooltip>
                <Tooltip content="Crie itens poderosos">
                  <button
                    onClick={() => navigate('/crafting')}
                    className="w-full py-2 bg-accent-purple hover:bg-opacity-80 rounded-lg transition-all hover:scale-105"
                  >
                    🔨 Crafting
                  </button>
                </Tooltip>
                <Tooltip content="Gerencie itens e equipamentos">
                  <button
                    onClick={() => navigate('/inventory')}
                    className="w-full py-2 bg-accent-green hover:bg-opacity-80 rounded-lg transition-all hover:scale-105"
                  >
                    🎒 Inventário
                  </button>
                </Tooltip>
                <Tooltip content="Compre e venda com outros jogadores">
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="w-full py-2 bg-accent-gold hover:bg-opacity-80 rounded-lg transition-all hover:scale-105"
                  >
                    🏪 Marketplace
                  </button>
                </Tooltip>
                <Tooltip content="Masmorras desafiadoras com bosses épicos!">
                  <button
                    onClick={() => navigate('/dungeons')}
                    className="w-full py-2 bg-gradient-to-r from-accent-purple to-accent-red hover:opacity-80 rounded-lg transition-all hover:scale-105 font-bold animate-pulse"
                  >
                    🏰 Dungeons
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}
