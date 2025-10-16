import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Character } from '../types';
import { characterService } from '../services/character.service';

interface StatsDistributionProps {
  character: Character;
  onClose: () => void;
  onSuccess: () => void;
}

const HP_PER_VIT = 10;
const BASE_HP = 50;

export function StatsDistribution({ character, onClose, onSuccess }: StatsDistributionProps) {
  const [pending, setPending] = useState({ str: 0, agi: 0, vit: 0, int: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPending = pending.str + pending.agi + pending.vit + pending.int;
  const remainingPoints = (character.stats.statPoints || 0) - totalPending;

  const newStats = {
    str: character.stats.str + pending.str,
    agi: character.stats.agi + pending.agi,
    vit: character.stats.vit + pending.vit,
    int: character.stats.int + pending.int,
  };

  const newMaxHP = BASE_HP + (newStats.vit * HP_PER_VIT);

  const increment = (stat: keyof typeof pending) => {
    if (remainingPoints > 0) {
      setPending(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
      setError('');
    }
  };

  const decrement = (stat: keyof typeof pending) => {
    if (pending[stat] > 0) {
      setPending(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
      setError('');
    }
  };

  const handleConfirm = async () => {
    if (totalPending === 0) {
      setError('Distribua pelo menos 1 ponto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await characterService.distributeStats(character.id, pending);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao distribuir pontos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-secondary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-accent-gold">📊 Distribuir Pontos de Atributo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pontos Disponíveis */}
          <div className="bg-bg-main p-4 rounded-lg border-2 border-accent-gold">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">Pontos Disponíveis</div>
              <div className="text-4xl font-bold text-accent-gold">{remainingPoints}</div>
              {totalPending > 0 && (
                <div className="text-sm text-gray-400 mt-2">
                  (Distribuindo: {totalPending})
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="space-y-4">
            {/* STR */}
            <StatRow
              label="STR (Força)"
              description="Aumenta dano físico"
              current={character.stats.str}
              pending={pending.str}
              onIncrement={() => increment('str')}
              onDecrement={() => decrement('str')}
              canIncrement={remainingPoints > 0}
            />

            {/* AGI */}
            <StatRow
              label="AGI (Agilidade)"
              description="Aumenta velocidade e esquiva"
              current={character.stats.agi}
              pending={pending.agi}
              onIncrement={() => increment('agi')}
              onDecrement={() => decrement('agi')}
              canIncrement={remainingPoints > 0}
            />

            {/* VIT */}
            <StatRow
              label="VIT (Vitalidade)"
              description={`Aumenta HP (+${HP_PER_VIT} HP por ponto)`}
              current={character.stats.vit}
              pending={pending.vit}
              onIncrement={() => increment('vit')}
              onDecrement={() => decrement('vit')}
              canIncrement={remainingPoints > 0}
              extra={pending.vit > 0 ? (
                <div className="text-sm text-accent-green mt-1">
                  HP: {character.maxHp} → {newMaxHP} (+{newMaxHP - character.maxHp})
                </div>
              ) : null}
            />

            {/* INT */}
            <StatRow
              label="INT (Inteligência)"
              description="Afeta crafting e habilidades"
              current={character.stats.int}
              pending={pending.int}
              onIncrement={() => increment('int')}
              onDecrement={() => decrement('int')}
              canIncrement={remainingPoints > 0}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading || totalPending === 0}
              className="flex-1 bg-accent-gold hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Distribuindo...' : 'Confirmar Distribuição'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  description: string;
  current: number;
  pending: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  extra?: React.ReactNode;
}

function StatRow({ label, description, current, pending, onIncrement, onDecrement, canIncrement, extra }: StatRowProps) {
  return (
    <div className="bg-bg-main p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-lg">{label}</div>
          <div className="text-sm text-gray-400">{description}</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onDecrement}
            disabled={pending === 0}
            className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <div className="text-center min-w-[80px]">
            <div className="text-2xl font-bold">
              {current}
              {pending > 0 && (
                <span className="text-accent-green"> +{pending}</span>
              )}
            </div>
          </div>
          <button
            onClick={onIncrement}
            disabled={!canIncrement}
            className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      {extra}
    </div>
  );
}
