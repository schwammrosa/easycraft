import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogOut } from 'lucide-react';
import { characterService } from '../services/character.service';
import { useCharacterStore } from '../store/characterStore';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

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
    return <LoadingSpinner fullscreen message="Carregando personagens..." size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-darker via-bg-main to-bg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-accent-gold mb-2 animate-fade-in">Seus Personagens</h1>
            <p className="text-text-secondary text-lg">Escolha ou crie um novo personagem</p>
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sair
          </Button>
        </div>

        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card
              key={character.id}
              onClick={() => handleSelectCharacter(character)}
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-accent-gold animate-fade-in"
              variant="default"
            >
              <CardBody>
                <div className="text-center mb-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent-gold to-accent-orange rounded-full mb-4 flex items-center justify-center text-6xl shadow-glow-md">
                    🎮
                  </div>
                  <h3 className="text-2xl font-bold text-accent-gold">{character.name}</h3>
                  <Badge variant="gold" size="md" className="mt-2">Nível {character.level}</Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">HP:</span>
                    <Badge variant="success">{character.hp}/{character.maxHp}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Gold:</span>
                    <Badge variant="gold">{character.gold}g</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">XP:</span>
                    <Badge variant="info">{character.xp}</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary-medium">
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="error" size="sm">STR: {character.stats.totalStr}</Badge>
                    <Badge variant="success" size="sm">AGI: {character.stats.totalAgi}</Badge>
                    <Badge variant="gold" size="sm">VIT: {character.stats.totalVit}</Badge>
                    <Badge variant="info" size="sm">INT: {character.stats.totalInt}</Badge>
                    <Badge variant="purple" size="sm" className="col-span-2">DEF: {character.stats.totalDef}</Badge>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {characters.length < 3 && (
            <Card
              onClick={handleCreateNew}
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-dashed border-accent-gold hover:border-accent-gold-light hover:shadow-glow-sm min-h-[400px] animate-fade-in"
            >
              <CardBody className="flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mb-4 shadow-glow-md">
                  <UserPlus className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-accent-gold mb-2">Criar Personagem</h3>
                <Badge variant="info" size="md">Personagens: {characters.length}/3</Badge>
              </CardBody>
            </Card>
          )}
        </div>

        {characters.length === 0 && (
          <EmptyState
            icon="🎮"
            title="Nenhum Personagem"
            description="Você ainda não tem personagens. Crie seu primeiro personagem para começar a jogar!"
            action={{
              label: "Criar Primeiro Personagem",
              onClick: handleCreateNew,
              icon: <UserPlus className="w-5 h-5" />
            }}
          />
        )}
      </div>
    </div>
  );
}
