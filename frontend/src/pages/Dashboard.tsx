import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { characterService } from '../services/character.service';

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);

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
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login');
  };

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>HP:</span>
                  <span className="text-accent-green">
                    {selectedCharacter.hp}/{selectedCharacter.maxHp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gold:</span>
                  <span className="text-accent-gold">{selectedCharacter.gold}</span>
                </div>
                <div className="flex justify-between">
                  <span>XP:</span>
                  <span className="text-accent-blue">{selectedCharacter.xp}</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Atributos</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  STR: <span className="text-accent-red font-bold">{selectedCharacter.stats.totalStr}</span>
                  {selectedCharacter.stats.totalStr > selectedCharacter.stats.str && (
                    <span className="text-xs text-accent-green ml-1">
                      (+{selectedCharacter.stats.totalStr - selectedCharacter.stats.str})
                    </span>
                  )}
                </div>
                <div>
                  AGI: <span className="text-accent-green font-bold">{selectedCharacter.stats.totalAgi}</span>
                  {selectedCharacter.stats.totalAgi > selectedCharacter.stats.agi && (
                    <span className="text-xs text-accent-green ml-1">
                      (+{selectedCharacter.stats.totalAgi - selectedCharacter.stats.agi})
                    </span>
                  )}
                </div>
                <div>
                  VIT: <span className="text-accent-gold font-bold">{selectedCharacter.stats.totalVit}</span>
                  {selectedCharacter.stats.totalVit > selectedCharacter.stats.vit && (
                    <span className="text-xs text-accent-green ml-1">
                      (+{selectedCharacter.stats.totalVit - selectedCharacter.stats.vit})
                    </span>
                  )}
                </div>
                <div>
                  INT: <span className="text-accent-blue font-bold">{selectedCharacter.stats.totalInt}</span>
                  {selectedCharacter.stats.totalInt > selectedCharacter.stats.int && (
                    <span className="text-xs text-accent-green ml-1">
                      (+{selectedCharacter.stats.totalInt - selectedCharacter.stats.int})
                    </span>
                  )}
                </div>
                <div>
                  DEF: <span className="text-accent-purple font-bold">{selectedCharacter.stats.totalDef}</span>
                  {selectedCharacter.stats.totalDef > selectedCharacter.stats.def && (
                    <span className="text-xs text-accent-green ml-1">
                      (+{selectedCharacter.stats.totalDef - selectedCharacter.stats.def})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-bg-input rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Ações</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/battle')}
                  className="w-full py-2 bg-accent-red hover:bg-opacity-80 rounded-lg transition-colors"
                >
                  ⚔️ Batalha
                </button>
                <button
                  onClick={() => navigate('/quests')}
                  className="w-full py-2 bg-accent-blue hover:bg-opacity-80 rounded-lg transition-colors"
                >
                  🎯 Missões
                </button>
                <button
                  onClick={() => navigate('/crafting')}
                  className="w-full py-2 bg-accent-purple hover:bg-opacity-80 rounded-lg transition-colors"
                >
                  🔨 Crafting
                </button>
                <button
                  onClick={() => navigate('/inventory')}
                  className="w-full py-2 bg-accent-green hover:bg-opacity-80 rounded-lg transition-colors"
                >
                  🎒 Inventário
                </button>
                <button className="w-full py-2 bg-bg-panel rounded-lg opacity-50 cursor-not-allowed">
                  🏪 Mercado (Em breve)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
