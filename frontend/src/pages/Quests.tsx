import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questService, Quest, CharacterQuest, QuestRewards } from '../services/quest.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Quests() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [activeQuests, setActiveQuests] = useState<CharacterQuest[]>([]);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active');
  const [rewards, setRewards] = useState<QuestRewards | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadQuests();
  }, [selectedCharacter]);

  const loadQuests = async () => {
    if (!selectedCharacter) return;

    try {
      const [active, available] = await Promise.all([
        questService.getActiveQuests(selectedCharacter.id),
        questService.getAvailableQuests(selectedCharacter.id),
      ]);
      setActiveQuests(active);
      setAvailableQuests(available);
    } catch (err: any) {
      setError('Erro ao carregar quests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (questCode: string) => {
    if (!selectedCharacter) return;

    try {
      await questService.acceptQuest(selectedCharacter.id, questCode);
      await loadQuests();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao aceitar quest');
    }
  };

  const handleClaim = async (questId: number) => {
    if (!selectedCharacter) return;

    try {
      const questRewards = await questService.claimQuest(selectedCharacter.id, questId);
      setRewards(questRewards);
      
      // Reload character and quests
      const updated = await characterService.getCharacter(selectedCharacter.id);
      selectCharacter(updated);
      await loadQuests();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao coletar recompensa');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-accent-blue';
      case 'epic': return 'text-accent-purple';
      case 'legendary': return 'text-accent-gold';
      default: return 'text-white';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 border-gray-500';
      case 'rare': return 'bg-accent-blue/20 border-accent-blue';
      case 'epic': return 'bg-accent-purple/20 border-accent-purple';
      case 'legendary': return 'bg-accent-gold/20 border-accent-gold';
      default: return 'bg-bg-input';
    }
  };

  if (loading) {
    return <LoadingSpinner fullscreen message="Carregando missões..." size="lg" />;
  }

  if (!selectedCharacter) return null;

  return (
    <PageLayout title="🎯 Missões" showBack={true}>
      <div className="space-y-6">

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Rewards Modal */}
        {rewards && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-accent-green text-center mb-6">
                🎉 Recompensas Coletadas!
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span>XP:</span>
                  <span className="text-accent-blue font-bold">+{rewards.xpGained}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Gold:</span>
                  <span className="text-accent-gold font-bold">+{rewards.goldGained}</span>
                </div>

                {rewards.itemsGained.length > 0 && (
                  <div>
                    <p className="font-bold mb-2">Itens:</p>
                    {rewards.itemsGained.map((item, i) => (
                      <div key={i} className="text-sm text-accent-green">
                        • {item.itemCode} x{item.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setRewards(null)}
                className="w-full py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'active'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
            }`}
          >
            Ativas ({activeQuests.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'available'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
            }`}
          >
            Disponíveis ({availableQuests.length})
          </button>
        </div>

        {/* Active Quests */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeQuests.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-text-secondary">
                Você não tem quests ativas. Aceite alguma quest disponível!
              </div>
            ) : (
              activeQuests.map((cq) => (
                <div
                  key={cq.id}
                  className={`rounded-lg p-6 border ${getRarityBg(cq.quest.rarity)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${getRarityColor(cq.quest.rarity)}`}>
                      {cq.quest.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-bg-main rounded uppercase">
                      {cq.quest.rarity}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4">{cq.quest.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>
                        {cq.progress} / {cq.quest.targetAmount}
                      </span>
                    </div>
                    <div className="w-full bg-bg-main rounded-full h-2">
                      <div
                        className="bg-accent-blue rounded-full h-2 transition-all"
                        style={{
                          width: `${Math.min((cq.progress / cq.quest.targetAmount) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="border-t border-primary-medium pt-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>XP:</span>
                      <span className="text-accent-blue">{cq.quest.xpReward}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gold:</span>
                      <span className="text-accent-gold">{cq.quest.goldReward}</span>
                    </div>
                  </div>

                  {/* Claim Button */}
                  {cq.completed && !cq.claimed && (
                    <button
                      onClick={() => handleClaim(cq.id)}
                      className="w-full py-2 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
                    >
                      Coletar Recompensa
                    </button>
                  )}

                  {!cq.completed && (
                    <div className="text-center text-sm text-text-secondary">
                      Continue progredindo...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Available Quests */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableQuests.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-text-secondary">
                Não há quests disponíveis no momento.
              </div>
            ) : (
              availableQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`rounded-lg p-6 border ${getRarityBg(quest.rarity)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${getRarityColor(quest.rarity)}`}>
                      {quest.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-bg-main rounded uppercase">
                      {quest.rarity}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4">{quest.description}</p>

                  <div className="text-sm mb-4">
                    <p>
                      <span className="text-text-secondary">Objetivo:</span> {quest.targetAmount}
                    </p>
                    <p>
                      <span className="text-text-secondary">Nível Requerido:</span> {quest.requiredLevel}
                    </p>
                    {quest.isRepeatable && (
                      <p className="text-accent-blue">🔄 Repetível</p>
                    )}
                  </div>

                  {/* Rewards */}
                  <div className="border-t border-primary-medium pt-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>XP:</span>
                      <span className="text-accent-blue">{quest.xpReward}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gold:</span>
                      <span className="text-accent-gold">{quest.goldReward}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(quest.code)}
                    className="w-full py-2 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
                  >
                    Aceitar Quest
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
