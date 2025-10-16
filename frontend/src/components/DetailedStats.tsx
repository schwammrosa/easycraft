import { X, Sword, Shield, Heart, Zap, Brain, Activity } from 'lucide-react';
import { Character } from '../services/character.service';

interface DetailedStatsProps {
  character: Character;
  onClose: () => void;
}

export function DetailedStats({ character, onClose }: DetailedStatsProps) {
  const stats = character.stats;

  // Cálculos de estatísticas derivadas
  const calculations = {
    // HP = (VIT × 10) + (level × 5)
    maxHP: {
      formula: '(VIT × 10) + (Level × 5)',
      calculation: `(${stats.totalVit} × 10) + (${character.level} × 5)`,
      result: character.maxHp,
    },
    // Dano Base = STR × 2
    baseDamage: {
      formula: 'STR × 2',
      calculation: `${stats.totalStr} × 2`,
      result: stats.totalStr * 2,
    },
    // Defesa Total
    totalDefense: {
      formula: 'DEF Base + DEF Equipamentos',
      calculation: `${stats.def} + ${stats.totalDef - stats.def}`,
      result: stats.totalDef,
    },
    // Taxa de Crítico = (AGI / 10)%
    critRate: {
      formula: '(AGI / 10)%',
      calculation: `${stats.totalAgi} / 10`,
      result: (stats.totalAgi / 10).toFixed(1) + '%',
    },
    // Velocidade de Ataque (ordem de turno)
    attackSpeed: {
      formula: 'AGI (define ordem)',
      calculation: `${stats.totalAgi} pontos`,
      result: stats.totalAgi,
    },
  };

  const attributeDetails = [
    {
      name: 'STR',
      fullName: 'Força',
      icon: <Sword className="w-5 h-5" />,
      color: 'text-accent-red',
      bgColor: 'bg-accent-red/10',
      borderColor: 'border-accent-red',
      base: stats.str,
      bonus: stats.totalStr - stats.str,
      total: stats.totalStr,
      effects: [
        `• Dano Base: ${stats.totalStr * 2}`,
        `• Cada ponto aumenta +2 de dano`,
        `• Essencial para combatentes corpo-a-corpo`,
      ],
    },
    {
      name: 'AGI',
      fullName: 'Agilidade',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
      borderColor: 'border-accent-green',
      base: stats.agi,
      bonus: stats.totalAgi - stats.agi,
      total: stats.totalAgi,
      effects: [
        `• Taxa de Crítico: ${(stats.totalAgi / 10).toFixed(1)}%`,
        `• Velocidade: ${stats.totalAgi} (ataca primeiro)`,
        `• Cada ponto aumenta 0.1% de crítico`,
      ],
    },
    {
      name: 'VIT',
      fullName: 'Vitalidade',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-accent-gold',
      bgColor: 'bg-accent-gold/10',
      borderColor: 'border-accent-gold',
      base: stats.vit,
      bonus: stats.totalVit - stats.vit,
      total: stats.totalVit,
      effects: [
        `• HP Máximo: ${character.maxHp}`,
        `• Cada ponto aumenta +10 HP`,
        `• Aumenta sobrevivência em batalhas`,
      ],
    },
    {
      name: 'INT',
      fullName: 'Inteligência',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
      borderColor: 'border-accent-blue',
      base: stats.int,
      bonus: stats.totalInt - stats.int,
      total: stats.totalInt,
      effects: [
        `• Aumenta chance de sucesso no crafting`,
        `• Reduz custo de materiais (futuro)`,
        `• Habilidades mágicas (futuro)`,
      ],
    },
    {
      name: 'DEF',
      fullName: 'Defesa',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10',
      borderColor: 'border-accent-purple',
      base: stats.def,
      bonus: stats.totalDef - stats.def,
      total: stats.totalDef,
      effects: [
        `• Reduz dano recebido: -${stats.totalDef}`,
        `• Cada ponto reduz 1 de dano`,
        `• Principalmente de equipamentos`,
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-panel rounded-xl border-2 border-primary-medium max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-bg-panel border-b border-primary-medium p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent-gold" />
            <div>
              <h2 className="text-2xl font-bold text-accent-gold">Status Detalhado</h2>
              <p className="text-sm text-text-secondary">{character.name} - Level {character.level}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-input rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estatísticas Principais */}
          <div className="bg-gradient-to-br from-primary-dark to-bg-input rounded-lg p-6 border border-accent-gold/30">
            <h3 className="text-xl font-bold text-accent-gold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estatísticas de Combate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HP */}
              <div className="bg-bg-panel rounded-lg p-4 border border-accent-green/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">HP Máximo</span>
                  <span className="text-2xl font-bold text-accent-green">{calculations.maxHP.result}</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <div>Fórmula: {calculations.maxHP.formula}</div>
                  <div className="text-accent-green">= {calculations.maxHP.calculation}</div>
                </div>
              </div>

              {/* Dano Base */}
              <div className="bg-bg-panel rounded-lg p-4 border border-accent-red/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Dano Base</span>
                  <span className="text-2xl font-bold text-accent-red">{calculations.baseDamage.result}</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <div>Fórmula: {calculations.baseDamage.formula}</div>
                  <div className="text-accent-red">= {calculations.baseDamage.calculation}</div>
                </div>
              </div>

              {/* Defesa */}
              <div className="bg-bg-panel rounded-lg p-4 border border-accent-purple/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Defesa Total</span>
                  <span className="text-2xl font-bold text-accent-purple">{calculations.totalDefense.result}</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <div>Fórmula: {calculations.totalDefense.formula}</div>
                  <div className="text-accent-purple">= {calculations.totalDefense.calculation}</div>
                </div>
              </div>

              {/* Taxa de Crítico */}
              <div className="bg-bg-panel rounded-lg p-4 border border-accent-gold/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Taxa de Crítico</span>
                  <span className="text-2xl font-bold text-accent-gold">{calculations.critRate.result}</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <div>Fórmula: {calculations.critRate.formula}</div>
                  <div className="text-accent-gold">= {calculations.critRate.calculation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Atributos Detalhados */}
          <div>
            <h3 className="text-xl font-bold mb-4">Atributos Detalhados</h3>
            <div className="space-y-4">
              {attributeDetails.map((attr) => (
                <div
                  key={attr.name}
                  className={`${attr.bgColor} rounded-lg p-5 border-2 ${attr.borderColor}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${attr.color}`}>{attr.icon}</div>
                      <div>
                        <h4 className={`text-lg font-bold ${attr.color}`}>
                          {attr.name} - {attr.fullName}
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-secondary">Base: {attr.base}</span>
                          {attr.bonus > 0 && (
                            <>
                              <span className="text-text-secondary">+</span>
                              <span className="text-accent-green">Equipamentos: +{attr.bonus}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-4xl font-bold ${attr.color}`}>
                      {attr.total}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-text-secondary ml-8">
                    {attr.effects.map((effect, idx) => (
                      <div key={idx}>{effect}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pontos Disponíveis */}
          {stats.statPoints > 0 && (
            <div className="bg-accent-gold/20 border-2 border-accent-gold rounded-lg p-6 text-center animate-pulse-glow">
              <p className="text-accent-gold font-bold text-xl mb-2">
                ⚠️ Você tem {stats.statPoints} pontos para distribuir!
              </p>
              <p className="text-sm text-gray-300">
                Feche este modal e clique em "Distribuir Agora" para adicionar pontos
              </p>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-primary-dark rounded-lg p-6 border border-primary-medium">
            <h3 className="text-lg font-bold mb-3 text-accent-blue">💡 Dicas de Build</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <div>• <span className="text-accent-red font-semibold">Guerreiro:</span> Foque em STR e VIT para alto dano e HP</div>
              <div>• <span className="text-accent-green font-semibold">Assassino:</span> Priorize AGI para críticos e velocidade</div>
              <div>• <span className="text-accent-gold font-semibold">Tank:</span> Maximize VIT e DEF para máxima resistência</div>
              <div>• <span className="text-accent-blue font-semibold">Mago:</span> INT para crafting e habilidades futuras</div>
              <div>• <span className="text-accent-purple font-semibold">Balanceado:</span> Distribua igualmente para versatilidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
