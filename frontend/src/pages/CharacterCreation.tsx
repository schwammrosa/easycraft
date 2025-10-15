import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterService } from '../services/character.service';
import { useCharacterStore } from '../store/characterStore';
import { VARIANT_OPTIONS } from '../types';

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
    <div className="min-h-screen bg-bg-main p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/characters')}
          className="text-accent-blue hover:underline mb-4"
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-bold text-accent-gold mb-8">Criar Personagem</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-bg-panel rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Preview</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 bg-bg-input rounded-full flex items-center justify-center text-8xl">
                🎮
              </div>
              <p className="text-2xl font-bold text-accent-gold">{name || 'Seu Personagem'}</p>
              <p className="text-sm text-text-secondary">Head: {headVariant}</p>
            </div>
          </div>

          <div className="bg-bg-panel rounded-lg p-8">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-blue hover:bg-opacity-80 disabled:opacity-50 py-3 rounded-lg font-semibold"
              >
                {loading ? 'Criando...' : 'Criar Personagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
