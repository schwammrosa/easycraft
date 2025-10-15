import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterService } from '../services/character.service';
import { useCharacterStore } from '../store/characterStore';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

export function CharacterSelection() {
  const navigate = useNavigate();
  const { characters, setCharacters, selectCharacter } = useCharacterStore();
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const chars = await characterService.getCharacters();
      setCharacters(chars);
    } catch (err: any) {
      setError('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharacter = (character: any) => {
    selectCharacter(character);
    navigate('/dashboard');
  };

  const handleCreateNew = () => {
    if (characters.length >= 3) {
      setError('Você já tem o máximo de 3 personagens');
      return;
    }
    navigate('/character/create');
  };

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando personagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-gold mb-2">Seus Personagens</h1>
            <p className="text-text-secondary">Escolha ou crie um novo personagem</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => handleSelectCharacter(character)}
              className="bg-bg-panel rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-all hover:scale-105 border-2 border-transparent hover:border-accent-gold"
            >
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-bg-input rounded-full mb-4 flex items-center justify-center text-6xl">
                  🎮
                </div>
                <h3 className="text-xl font-bold text-accent-gold">{character.name}</h3>
                <p className="text-text-secondary text-sm">Nível {character.level}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">HP:</span>
                  <span className="text-accent-green">{character.hp}/{character.maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Gold:</span>
                  <span className="text-accent-gold">{character.gold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">XP:</span>
                  <span className="text-accent-blue">{character.xp}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary-medium">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-text-secondary">STR:</span>{' '}
                    <span className="text-accent-red font-bold">{character.stats.totalStr}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">AGI:</span>{' '}
                    <span className="text-accent-green font-bold">{character.stats.totalAgi}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">VIT:</span>{' '}
                    <span className="text-accent-gold font-bold">{character.stats.totalVit}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">INT:</span>{' '}
                    <span className="text-accent-blue font-bold">{character.stats.totalInt}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-secondary">DEF:</span>{' '}
                    <span className="text-accent-purple font-bold">{character.stats.totalDef}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {characters.length < 3 && (
            <div
              onClick={handleCreateNew}
              className="bg-bg-panel rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-all hover:scale-105 border-2 border-dashed border-primary-medium hover:border-accent-gold flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="text-6xl mb-4">➕</div>
              <h3 className="text-xl font-bold text-accent-gold mb-2">Criar Personagem</h3>
              <p className="text-text-secondary text-sm text-center">
                Personagens: {characters.length}/3
              </p>
            </div>
          )}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">Você ainda não tem personagens</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold transition-colors"
            >
              Criar Primeiro Personagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
