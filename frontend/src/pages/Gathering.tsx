import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gatheringService, GatherNode, GatherSession } from '../services/gathering.service';
import { characterService } from '../services/character.service';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Gathering() {
  const navigate = useNavigate();
  const [character, setCharacter] = useState<any>(null);
  const [nodes, setNodes] = useState<GatherNode[]>([]);
  const [activeSession, setActiveSession] = useState<GatherSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<GatherNode | null>(null);
  const [maxGathers, setMaxGathers] = useState(10);
  const [activeTab, setActiveTab] = useState<'nodes' | 'history'>('nodes');
  const [history, setHistory] = useState<GatherSession[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Poll session status
  useEffect(() => {
    if (activeSession && activeSession.status === 'running') {
      const interval = setInterval(() => {
        refreshSessionStatus();
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const loadData = async () => {
    try {
      setLoading(true);
      const chars = await characterService.getCharacters();
      if (chars.length === 0) {
        navigate('/characters');
        return;
      }

      const char = chars[0];
      setCharacter(char);

      const [nodesData, activeSessionData, historyData] = await Promise.all([
        gatheringService.getGatherNodes(char.id),
        gatheringService.getActiveGatherSession(char.id),
        gatheringService.getGatherHistory(char.id, 10),
      ]);

      setNodes(nodesData);
      setActiveSession(activeSessionData);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const refreshSessionStatus = async () => {
    if (!activeSession) return;

    try {
      const session = await gatheringService.getGatherSessionStatus(activeSession.id);
      setActiveSession(session);

      // If session ended, reload character and history
      if (session.status !== 'running') {
        const chars = await characterService.getCharacters();
        if (chars.length > 0) {
          setCharacter(chars[0]);
        }
        const historyData = await gatheringService.getGatherHistory(character.id, 10);
        setHistory(historyData);
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  const handleStartGathering = async () => {
    if (!selectedNode || !character) return;

    try {
      setError('');
      const sessionId = await gatheringService.startGatherSession(character.id, {
        nodeCode: selectedNode.code,
        maxGathers,
      });

      const session = await gatheringService.getGatherSessionStatus(sessionId);
      setActiveSession(session);
      setSelectedNode(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao iniciar coleta');
    }
  };

  const handleCancelSession = async () => {
    if (!activeSession || !character) return;

    if (confirm('⚠️ ATENÇÃO: Cancelar a coleta resultará em perda de 30% da XP acumulada. Deseja continuar?')) {
      try {
        await gatheringService.cancelGatherSession(character.id, activeSession.id);
        const session = await gatheringService.getGatherSessionStatus(activeSession.id);
        setActiveSession(session);

        // Reload character
        const chars = await characterService.getCharacters();
        if (chars.length > 0) {
          setCharacter(chars[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Erro ao cancelar coleta');
      }
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'wood': return '🌲';
      case 'ore': return '⛏️';
      case 'herb': return '🌿';
      case 'crystal': return '💎';
      case 'leather': return '🦌';
      default: return '📦';
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'wood': return 'text-green-400';
      case 'ore': return 'text-gray-400';
      case 'herb': return 'text-lime-400';
      case 'crystal': return 'text-blue-400';
      case 'leather': return 'text-amber-400';
      default: return 'text-text-primary';
    }
  };

  if (loading) {
    return <LoadingSpinner fullscreen message="Carregando coleta..." size="lg" />;
  }

  if (error && !activeSession) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
          <div className="text-6xl mb-4 text-center">❌</div>
          <p className="text-accent-red text-center mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout title="🌲 Coleta de Recursos" showBack={true}>
      <div className="space-y-6">
        {character && (
          <div className="flex gap-4 text-sm text-text-secondary">
            <span>⚔️ {character.name}</span>
            <span>📊 Nível {character.level}</span>
            <span>💰 {character.gold}g</span>
          </div>
        )}

        {/* Active Session Modal */}
        {activeSession && (
          <div className="mb-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 border-2 border-accent-blue">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {activeSession.status === 'running' ? '🔄' : '✅'}
                {activeSession.nodeName}
              </h2>
              <div className="text-right">
                {activeSession.status === 'running' && (
                  <span className="text-accent-blue font-bold">⏳ COLETANDO...</span>
                )}
                {activeSession.status === 'completed' && (
                  <span className="text-accent-green font-bold">✅ COMPLETO</span>
                )}
                {activeSession.status === 'cancelled' && (
                  <span className="text-accent-red font-bold">❌ CANCELADO</span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span className="font-bold">
                  {activeSession.currentGather} / {activeSession.maxGathers}
                </span>
              </div>
              <div className="w-full bg-primary-dark rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(activeSession.currentGather / activeSession.maxGathers) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-bg-panel rounded-lg p-3">
                <p className="text-xs text-text-secondary">XP Ganho</p>
                <p className="text-lg font-bold text-accent-blue">+{activeSession.totalXpGained}</p>
              </div>
              <div className="bg-bg-panel rounded-lg p-3">
                <p className="text-xs text-text-secondary">Coletas</p>
                <p className="text-lg font-bold text-accent-green">{activeSession.successfulGathers}</p>
              </div>
              <div className="bg-bg-panel rounded-lg p-3">
                <p className="text-xs text-text-secondary">Energia Usada</p>
                <p className="text-lg font-bold text-accent-gold">{activeSession.energyUsed}</p>
              </div>
              <div className="bg-bg-panel rounded-lg p-3">
                <p className="text-xs text-text-secondary">Níveis</p>
                <p className="text-lg font-bold text-accent-purple">
                  {activeSession.levelsGained > 0 ? `+${activeSession.levelsGained}` : '-'}
                </p>
              </div>
            </div>

            {/* Items Gathered */}
            {activeSession.totalItemsGathered.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-text-secondary mb-2">Recursos Coletados:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {activeSession.totalItemsGathered.map((item, idx) => (
                    <div key={idx} className="bg-bg-panel rounded p-2 text-sm">
                      <span className="font-bold">{item.quantity}x</span> {item.itemCode}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stop Message */}
            {activeSession.stoppedMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                activeSession.status === 'completed' ? 'bg-accent-green/20 border border-accent-green' :
                activeSession.status === 'cancelled' ? 'bg-accent-red/20 border border-accent-red' :
                'bg-accent-blue/20 border border-accent-blue'
              }`}>
                <p className="text-sm">{activeSession.stoppedMessage}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {activeSession.status === 'running' && (
                <button
                  onClick={handleCancelSession}
                  className="flex-1 py-3 bg-accent-red hover:bg-accent-red/80 rounded-lg font-semibold"
                >
                  ⚠️ Cancelar Coleta (-30% XP)
                </button>
              )}
              {activeSession.status !== 'running' && (
                <button
                  onClick={() => {
                    setActiveSession(null);
                    loadData();
                  }}
                  className="flex-1 py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
                >
                  ✅ Fechar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        {!activeSession && (
          <div className="mb-6">
            <div className="flex gap-4 border-b border-primary-medium">
              <button
                onClick={() => setActiveTab('nodes')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'nodes'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🌲 Nodos de Coleta
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'history'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📜 Histórico
              </button>
            </div>
          </div>
        )}

        {/* Nodes List */}
        {!activeSession && activeTab === 'nodes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => {
              const canGather = character && character.level >= node.requiredLevel;

              return (
                <div
                  key={node.id}
                  className={`bg-bg-panel rounded-lg p-6 border-2 transition-all ${
                    canGather
                      ? 'border-primary-medium hover:border-accent-blue cursor-pointer'
                      : 'border-primary-dark opacity-60'
                  }`}
                  onClick={() => canGather && setSelectedNode(node)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">{getNodeTypeIcon(node.type)}</span>
                        {node.name}
                      </h3>
                      <p className={`text-sm ${getNodeTypeColor(node.type)}`}>
                        {node.type.toUpperCase()}
                      </p>
                    </div>
                    {!canGather && (
                      <span className="bg-accent-red/20 text-accent-red text-xs px-2 py-1 rounded">
                        🔒 Nv.{node.requiredLevel}
                      </span>
                    )}
                  </div>

                  {node.description && (
                    <p className="text-sm text-text-secondary mb-4">{node.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-text-secondary">Tempo</p>
                      <p className="font-bold">{node.gatherTime}s</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Energia</p>
                      <p className="font-bold text-accent-gold">{node.energyCost}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">XP</p>
                      <p className="font-bold text-accent-blue">+{node.xpReward}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Nível Req.</p>
                      <p className="font-bold">Nv.{node.requiredLevel}</p>
                    </div>
                  </div>

                  {/* Drop Table */}
                  <div className="mt-4 pt-4 border-t border-primary-medium">
                    <p className="text-xs text-text-secondary mb-2">Recursos Disponíveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(node.dropTable).map((itemCode) => (
                        <span
                          key={itemCode}
                          className="text-xs bg-primary-medium px-2 py-1 rounded"
                        >
                          {itemCode}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        {!activeSession && activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <p className="text-4xl mb-4">📜</p>
                <p>Nenhuma sessão de coleta ainda</p>
              </div>
            ) : (
              history.map((session) => (
                <div key={session.id} className="bg-bg-panel rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">{session.nodeName}</h4>
                      <p className="text-sm text-text-secondary">
                        {new Date(session.startedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        session.status === 'completed' ? 'text-accent-green' :
                        session.status === 'cancelled' ? 'text-accent-red' :
                        'text-accent-blue'
                      }`}>
                        {session.status === 'completed' ? '✅ Completo' :
                         session.status === 'cancelled' ? '❌ Cancelado' :
                         '⏳ Em Progresso'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Coletas:</span>
                      <p className="font-semibold">{session.successfulGathers}/{session.maxGathers}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">XP:</span>
                      <p className="font-semibold text-accent-blue">+{session.totalXpGained}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Energia:</span>
                      <p className="font-semibold text-accent-gold">{session.energyUsed}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Items:</span>
                      <p className="font-semibold text-accent-green">{session.totalItemsGathered.length}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Start Gathering Modal */}
        {selectedNode && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">{getNodeTypeIcon(selectedNode.type)}</span>
                {selectedNode.name}
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Quantas coletas? (1-100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxGathers}
                  onChange={(e) => setMaxGathers(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 bg-bg-input rounded-lg border border-primary-medium focus:border-accent-blue focus:outline-none"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Tempo estimado: ~{(maxGathers * selectedNode.gatherTime) / 60} minutos
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-accent-red/20 border border-accent-red rounded-lg text-sm text-accent-red">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="flex-1 py-3 bg-primary-dark hover:bg-primary-medium rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStartGathering}
                  className="flex-1 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
                >
                  🌲 Iniciar Coleta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
