import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { characterService } from '../services/character.service';
import { useCharacterStore } from '../store/characterStore';
import { VARIANT_OPTIONS } from '../types';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function CharacterCreation() {
  const navigate = useNavigate();
  const addCharacter = useCharacterStore((state) => state.addCharacter);

  const [name, setName] = useState('');
  const [headVariant, setHeadVariant] = useState('variant1');
  const [armsVariant, setArmsVariant] = useState('variant1');
  const [legsVariant, setLegsVariant] = useState('variant1');
  const [feetVariant, setFeetVariant] = useState('variant1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.length < 3 || name.length > 20) {
      setError('Nome deve ter entre 3 e 20 caracteres');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError('Nome deve conter apenas letras, números e underscore');
      return;
    }

    setLoading(true);

    try {
      const character = await characterService.createCharacter({
        name,
        headVariant,
        armsVariant,
        legsVariant,
        feetVariant,
      });

      addCharacter(character);
      navigate('/characters');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao criar personagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="✨ Criar Personagem" showBack={true}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-fade-in">
            <CardHeader title="Preview" />
            <CardBody>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 bg-bg-input rounded-full flex items-center justify-center text-8xl">
                🎮
              </div>
              <p className="text-2xl font-bold text-accent-gold">{name || 'Seu Personagem'}</p>
              <p className="text-sm text-text-secondary">Head: {headVariant}</p>
            </div>
            </CardBody>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader title="Criação" />
            <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none"
                  placeholder="HeroMaster"
                />
              </div>

              {['head', 'arms', 'legs', 'feet'].map((part) => (
                <div key={part}>
                  <label className="block text-sm font-medium mb-2 capitalize">{part}</label>
                  <select
                    value={part === 'head' ? headVariant : part === 'arms' ? armsVariant : part === 'legs' ? legsVariant : feetVariant}
                    onChange={(e) => {
                      if (part === 'head') setHeadVariant(e.target.value);
                      else if (part === 'arms') setArmsVariant(e.target.value);
                      else if (part === 'legs') setLegsVariant(e.target.value);
                      else setFeetVariant(e.target.value);
                    }}
                    className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none"
                  >
                    {VARIANT_OPTIONS.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {error && (
                <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                icon={<UserPlus className="w-5 h-5" />}
              >
                Criar Personagem
              </Button>
            </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
