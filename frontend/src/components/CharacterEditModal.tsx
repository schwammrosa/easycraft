import { useState } from 'react';
import { X } from 'lucide-react';
import { Character, VARIANT_OPTIONS } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader } from './ui/Card';

interface CharacterEditModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    headVariant: string;
    armsVariant: string;
    legsVariant: string;
    feetVariant: string;
  }) => Promise<void>;
}

export function CharacterEditModal({ character, isOpen, onClose, onSave }: CharacterEditModalProps) {
  const [headVariant, setHeadVariant] = useState(character.headVariant);
  const [armsVariant, setArmsVariant] = useState(character.armsVariant);
  const [legsVariant, setLegsVariant] = useState(character.legsVariant);
  const [feetVariant, setFeetVariant] = useState(character.feetVariant);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      await onSave({
        headVariant,
        armsVariant,
        legsVariant,
        feetVariant,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao atualizar personagem');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = 
    headVariant !== character.headVariant ||
    armsVariant !== character.armsVariant ||
    legsVariant !== character.legsVariant ||
    feetVariant !== character.feetVariant;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader
            title="⚙️ Editar Personagem"
            action={
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            }
          />
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preview */}
              <div>
                <h3 className="text-xl font-bold text-accent-gold mb-4">Preview</h3>
                <div className="flex flex-col items-center space-y-4">
                  <CharacterAvatar
                    headVariant={headVariant}
                    armsVariant={armsVariant}
                    legsVariant={legsVariant}
                    feetVariant={feetVariant}
                    size="xl"
                    showBorder={true}
                  />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent-gold">{character.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mt-2">
                      <p>Head: <span className="text-accent-blue">{headVariant}</span></p>
                      <p>Arms: <span className="text-accent-blue">{armsVariant}</span></p>
                      <p>Legs: <span className="text-accent-blue">{legsVariant}</span></p>
                      <p>Feet: <span className="text-accent-blue">{feetVariant}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div>
                <h3 className="text-xl font-bold text-accent-gold mb-4">Aparência</h3>
                <div className="space-y-6">
                  {/* Head */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Head</label>
                    <select
                      value={headVariant}
                      onChange={(e) => setHeadVariant(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-white"
                    >
                      {VARIANT_OPTIONS.map((variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arms */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Arms</label>
                    <select
                      value={armsVariant}
                      onChange={(e) => setArmsVariant(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-white"
                    >
                      {VARIANT_OPTIONS.map((variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Legs */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Legs</label>
                    <select
                      value={legsVariant}
                      onChange={(e) => setLegsVariant(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-white"
                    >
                      {VARIANT_OPTIONS.map((variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Feet */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Feet</label>
                    <select
                      value={feetVariant}
                      onChange={(e) => setFeetVariant(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none text-white"
                    >
                      {VARIANT_OPTIONS.map((variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={onClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      isLoading={saving}
                      disabled={!hasChanges || saving}
                      onClick={handleSave}
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>

                  {!hasChanges && (
                    <p className="text-center text-sm text-text-secondary">
                      Faça alterações para habilitar o botão salvar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
