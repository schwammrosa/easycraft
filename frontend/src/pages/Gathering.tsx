import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gatheringService, GatherNode, GatherSession } from '../services/gathering.service';
import { characterService } from '../services/character.service';
import { useCharacterStore } from '../store/characterStore';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Gathering() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const character = selectedCharacter;
  const [nodes, setNodes] = useState<GatherNode[]>([]);
  const [activeSession, setActiveSession] = useState<GatherSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<GatherNode | null>(null);
  const [maxGathers, setMaxGathers] = useState(10);
  const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');
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
    if (!character) {
      navigate('/characters');
      return;
    }

    try {
      setLoading(true);

      const [nodesData, activeSessionData, historyData] = await Promise.all([
        gatheringService.getGatherNodes(character.id),
        gatheringService.getActiveGatherSession(character.id),
        gatheringService.getGatherHistory(character.id, 10),
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
      if (session.status !== 'running' && character) {
        const updated = await characterService.getCharacter(character.id);
        selectCharacter(updated);
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

    if (confirm('⚠️ ATENÇÃO: Cancelar a coleta resultará em:\n- Perda de 50% da XP acumulada\n- Perda de 50% dos itens coletados\n+ Reembolso de 50% do gold gasto\n\nDeseja continuar?')) {
      try {
        await gatheringService.cancelGatherSession(character.id, activeSession.id);
        const session = await gatheringService.getGatherSessionStatus(activeSession.id);
        setActiveSession(session);
        setSelectedNode(null);

        // Reload character to update gold
        if (character) {
          const updated = await characterService.getCharacter(character.id);
          selectCharacter(updated);
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
                <p className="text-xs text-text-secondary">Gold Gasto</p>
                <p className="text-lg font-bold text-accent-gold">{activeSession.goldSpent}g</p>
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
                  ⚠️ Cancelar Coleta (-50% XP/-50% Items/+50% Gold)
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

        {/* Configuration Panel with Tabs */}
        {!activeSession && (
          <div className="bg-bg-panel rounded-lg p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-primary-medium">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'config'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                🌲 Configuração de Coleta
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                📜 Histórico
              </button>
            </div>

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <div>
                {/* Alert if no nodes */}
                {nodes.length === 0 && (
                  <div className="mb-6 p-4 bg-accent-red/20 border border-accent-red rounded-lg">
                    <p className="text-accent-red font-semibold mb-2">⚠️ Nenhum nodo de coleta encontrado!</p>
                    <p className="text-sm text-text-secondary">
                      Verifique se o backend está rodando e se os nodos foram criados no banco de dados.
                    </p>
                    <p className="text-xs text-text-secondary mt-2">
                      Execute: <code className="bg-primary-dark px-2 py-1 rounded">npx prisma db seed</code>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Node Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">1. Escolha o Recurso:</label>
                    <select
                      value={selectedNode?.code || ''}
                      onChange={(e) => {
                        const node = nodes.find(n => n.code === e.target.value);
                        setSelectedNode(node || null);
                      }}
                      className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold text-white"
                    >
                      <option value="">Selecione um recurso...</option>
                      {nodes.map((node) => {
                        const canGather = character && character.level >= node.requiredLevel;
                        return (
                          <option 
                            key={node.code} 
                            value={node.code}
                            disabled={!canGather}
                          >
                            {!canGather ? '🔒 ' : ''}{getNodeTypeIcon(node.type)} {node.name} (Nv {node.requiredLevel}) - {node.goldCost}g/coleta
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Max Gathers */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      2. Quantas coletas? (1-100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={maxGathers}
                      onChange={(e) => setMaxGathers(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full bg-bg-input border border-primary-medium rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold text-white"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      Tempo estimado: ~{selectedNode ? Math.ceil((maxGathers * selectedNode.gatherTime) / 60) : 0} minutos
                    </p>
                  </div>

                  {/* Selected Node Info */}
                  {selectedNode && (
                    <div className="md:col-span-2">
                      <div className="p-4 bg-primary-dark/50 rounded-lg border border-primary-medium">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">{getNodeTypeIcon(selectedNode.type)}</span>
                          <div>
                            <h3 className="text-lg font-bold">{selectedNode.name}</h3>
                            <p className={`text-sm ${getNodeTypeColor(selectedNode.type)}`}>
                              {selectedNode.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-text-secondary">Tempo/Coleta:</p>
                            <p className="font-bold">{selectedNode.gatherTime}s</p>
                          </div>
                          <div>
                            <p className="text-text-secondary">XP/Coleta:</p>
                            <p className="font-bold text-accent-blue">+{selectedNode.xpReward}</p>
                          </div>
                          <div>
                            <p className="text-text-secondary">Gold/Coleta:</p>
                            <p className="font-bold text-accent-gold">{selectedNode.goldCost}g</p>
                          </div>
                          <div>
                            <p className="text-text-secondary">Nível Req.:</p>
                            <p className="font-bold">Nv.{selectedNode.requiredLevel}</p>
                          </div>
                        </div>

                        {/* Total Cost */}
                        <div className="mt-3 p-3 bg-accent-gold/10 border-2 border-accent-gold rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-accent-gold">💰 Custo Total</p>
                              <p className="text-xs text-text-secondary">Será cobrado antes de iniciar</p>
                            </div>
                            <p className="text-2xl font-bold text-accent-gold">
                              {maxGathers * selectedNode.goldCost}g
                            </p>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span className="text-text-secondary">Seu Gold:</span>
                            <span className={character && character.gold >= (maxGathers * selectedNode.goldCost) ? 'text-accent-green font-bold' : 'text-accent-red font-bold'}>
                              {character?.gold || 0}g {character && character.gold < (maxGathers * selectedNode.goldCost) && '⚠️ Insuficiente!'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-accent-blue/10 border border-accent-blue rounded-lg">
                  <p className="text-sm mb-2 text-white">📋 <strong>Como funciona:</strong></p>
                  <ul className="text-sm text-white space-y-1 ml-4">
                    <li>• Selecione um nodo de recurso acima</li>
                    <li>• O jogo vai coletar automaticamente os recursos</li>
                    <li>• Custo em gold é cobrado ANTES de iniciar</li>
                    <li>• Você pode navegar livremente durante a coleta</li>
                    <li>• Cancelar perde 50% XP + 50% items, mas reembolsa 50% do gold</li>
                    <li>• Todos XP, Gold e Items são coletados automaticamente</li>
                  </ul>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-accent-red/20 border border-accent-red rounded-lg text-sm text-accent-red">
                    {error}
                  </div>
                )}

                {/* Start Button */}
                <button
                  onClick={handleStartGathering}
                  disabled={!selectedNode || !character || character.gold < (maxGathers * (selectedNode?.goldCost || 0))}
                  className="w-full mt-6 py-4 bg-accent-gold hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors"
                >
                  🌲 INICIAR COLETA!
                </button>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
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
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-text-secondary">Coletas:</span>
                      <p className="font-semibold">{session.successfulGathers}/{session.maxGathers}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">XP Ganha:</span>
                      <p className="font-semibold text-accent-blue">+{session.totalXpGained}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Gold Gasto:</span>
                      <p className="font-semibold text-accent-red">{session.goldSpent}g</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Levels:</span>
                      <p className="font-semibold text-accent-green">
                        {session.levelsGained > 0 ? `+${session.levelsGained}` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Gold Refunded (if cancelled) */}
                  {session.status === 'cancelled' && session.goldRefunded > 0 && (
                    <div className="mb-4 p-3 bg-accent-gold/10 border border-accent-gold rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-accent-gold">💰 Reembolso:</span>
                        <span className="text-lg font-bold text-accent-gold">+{session.goldRefunded}g</span>
                      </div>
                    </div>
                  )}

                  {/* Items Collected */}
                  {session.totalItemsGathered && session.totalItemsGathered.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-text-secondary mb-2">Items Coletados:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.totalItemsGathered.map((item, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1 bg-primary-medium rounded-lg text-sm"
                          >
                            <span className="text-accent-green font-semibold">{item.quantity}x</span>
                            {' '}
                            <span className="text-text-primary">{item.itemCode}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stopped Message */}
                  {session.stoppedMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      session.status === 'completed' ? 'bg-accent-green/20 border border-accent-green text-accent-green' :
                      session.status === 'cancelled' ? 'bg-accent-red/20 border border-accent-red text-accent-red' :
                      'bg-accent-blue/20 border border-accent-blue text-accent-blue'
                    }`}>
                      <p className="whitespace-pre-line">{session.stoppedMessage}</p>
                    </div>
                  )}
                </div>
              ))
            )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
