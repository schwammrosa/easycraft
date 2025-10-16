import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword } from 'lucide-react';
import { inventoryService, InventoryItem, Equipment } from '../services/inventory.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

const SLOT_NAMES: Record<string, string> = {
  weapon: '🗡️ Arma',
  head: '⛑️ Capacete',
  torso: '🛡️ Armadura',
  legs: '👖 Calças',
  feet: '👢 Botas',
};

export function Inventory() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [equipping, setEquipping] = useState(false);
  const [using, setUsing] = useState(false);
  const [useResult, setUseResult] = useState<any>(null);

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadData();
  }, [selectedCharacter]);

  const loadData = async () => {
    if (!selectedCharacter) return;

    try {
      const [inv, eq, char] = await Promise.all([
        inventoryService.getInventory(selectedCharacter.id),
        inventoryService.getEquipment(selectedCharacter.id),
        characterService.getCharacter(selectedCharacter.id),
      ]);
      setInventory(inv);
      setEquipment(eq);
      selectCharacter(char); // Update stats
    } catch (err: any) {
      setError('Erro ao carregar inventário');
    } finally {
      setLoading(false);
    }
  };

  const handleEquip = async (item: InventoryItem) => {
    if (equipping) return; // Prevent double-click
    
    if (!selectedCharacter || !item.item.slot) {
      console.warn('Cannot equip:', { hasCharacter: !!selectedCharacter, slot: item.item.slot, item: item.item });
      setError('Este item não pode ser equipado');
      return;
    }

    setEquipping(true);
    try {
      console.log('Equiping item:', { itemId: item.id, slot: item.item.slot, itemName: item.item.name });
      await inventoryService.equipItem(selectedCharacter.id, item.id, item.item.slot);
      await loadData();
      setSelectedItem(null);
      setError('');
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.error?.message || 'Erro ao equipar item';
      console.error('Equip error FULL:', {
        status: err.response?.status,
        data: errorData,
        message: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setEquipping(false);
    }
  };

  const handleUnequip = async (slot: string) => {
    if (!selectedCharacter) return;

    try {
      await inventoryService.unequipItem(selectedCharacter.id, slot);
      await loadData();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao desequipar item');
    }
  };

  const handleUseItem = async (item: InventoryItem) => {
    if (using || !selectedCharacter) return;

    setUsing(true);
    setError('');

    try {
      const result = await inventoryService.useItem(selectedCharacter.id, item.id);
      setUseResult(result);

      // Reload data to update HP and inventory
      const [updatedChar, inventoryData] = await Promise.all([
        characterService.getCharacter(selectedCharacter.id),
        inventoryService.getInventory(selectedCharacter.id),
      ]);
      selectCharacter(updatedChar);
      setInventory(inventoryData);
      setSelectedItem(null);
    } catch (err: any) {
      console.error('Use item error:', err.response?.data);
      setError(err.response?.data?.error?.message || 'Erro ao usar item');
    } finally {
      setUsing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullscreen message="Carregando inventário..." size="lg" />;
  }

  if (!selectedCharacter) return null;

  return (
    <PageLayout title="🎒 Inventário" showBack={true}>
      <div className="space-y-6">

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Equipment Panel */}
          <div className="lg:col-span-1">
            <Card className="animate-fade-in">
              <CardHeader title="Equipamentos" />
              <CardBody>
              
              <div className="space-y-3">
                {Object.entries(SLOT_NAMES).map(([slot, name]) => {
                  const equipped = equipment.find((e) => e.slot === slot);
                  
                  return (
                    <div key={slot} className="bg-bg-input rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">{name}</span>
                        {equipped?.inventory && (
                          <button
                            onClick={() => handleUnequip(slot)}
                            className="text-xs text-accent-red hover:underline"
                          >
                            Desequipar
                          </button>
                        )}
                      </div>
                      
                      {equipped?.inventory ? (
                        <div className="bg-bg-main rounded p-2">
                          <p className="font-semibold text-sm text-accent-gold">
                            {equipped.inventory.item.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            {equipped.inventory.item.description}
                          </p>
                          {equipped.inventory.item.attributes && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {Object.entries(equipped.inventory.item.attributes as Record<string, any>).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="text-xs px-2 py-1 bg-accent-green/20 text-accent-green rounded"
                                  >
                                    +{value as number} {key.toUpperCase()}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-text-secondary text-sm">
                          Vazio
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stats Display */}
              <div className="mt-6 pt-6 border-t border-primary-medium">
                <h3 className="font-bold mb-3 text-white">Stats Totais</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="error" size="sm">STR: {selectedCharacter.stats.totalStr}</Badge>
                  <Badge variant="success" size="sm">AGI: {selectedCharacter.stats.totalAgi}</Badge>
                  <Badge variant="gold" size="sm">VIT: {selectedCharacter.stats.totalVit}</Badge>
                  <Badge variant="info" size="sm">INT: {selectedCharacter.stats.totalInt}</Badge>
                  <Badge variant="purple" size="sm">DEF: {selectedCharacter.stats.totalDef}</Badge>
                </div>
              </div>
              </CardBody>
            </Card>
          </div>

          {/* Inventory Grid */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader title={`Itens (${inventory.length})`} />
              <CardBody>
              {inventory.length === 0 ? (
                <EmptyState
                  icon="🎒"
                  title="Inventário Vazio"
                  description="Derrote monstros para conseguir itens!"
                  action={{
                    label: "Ir para Farm Mode",
                    onClick: () => navigate('/battle'),
                    icon: <Sword className="w-5 h-5" />
                  }}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`bg-bg-input rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-all ${
                        selectedItem?.id === item.id ? 'ring-2 ring-accent-gold' : ''
                      }`}
                    >
                      <div className="text-center mb-2">
                        <div className="w-16 h-16 mx-auto bg-bg-main rounded-lg flex items-center justify-center text-3xl mb-2">
                          {item.item.type === 'weapon' ? '⚔️' :
                           item.item.type === 'armor' ? '🛡️' :
                           item.item.type === 'material' ? '📦' : '🧪'}
                        </div>
                        <p className="font-semibold text-sm">{item.item.name}</p>
                        {item.quantity > 1 && (
                          <span className="text-xs text-accent-gold">x{item.quantity}</span>
                        )}
                      </div>
                      
                      {item.item.slot && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquip(item);
                          }}
                          disabled={equipping}
                          isLoading={equipping}
                          variant="primary"
                          size="sm"
                          fullWidth
                          className="mt-2"
                        >
                          Equipar
                        </Button>
                      )}
                      
                      {item.item.type === 'consumable' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseItem(item);
                          }}
                          disabled={using}
                          isLoading={using}
                          variant="success"
                          size="sm"
                          fullWidth
                          className="mt-2"
                        >
                          Usar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-bg-panel rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-accent-gold mb-4">
                {selectedItem.item.name}
              </h3>
              
              <p className="text-text-secondary mb-4">
                {selectedItem.item.description}
              </p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span className="capitalize">{selectedItem.item.type}</span>
                </div>
                {selectedItem.item.slot && (
                  <div className="flex justify-between">
                    <span>Slot:</span>
                    <span>{SLOT_NAMES[selectedItem.item.slot]}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="text-accent-gold">{selectedItem.item.baseValue} gold</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantidade:</span>
                  <span>x{selectedItem.quantity}</span>
                </div>
              </div>
              
              {selectedItem.item.attributes && Object.keys(selectedItem.item.attributes as Record<string, any>).length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Atributos:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(selectedItem.item.attributes as Record<string, any>).map(
                      ([key, value]) => (
                        <span
                          key={key}
                          className="px-3 py-1 bg-accent-green/20 text-accent-green rounded text-sm"
                        >
                          +{value as number} {key.toUpperCase()}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                {selectedItem.item.slot && (
                  <button
                    onClick={() => handleEquip(selectedItem)}
                    className="flex-1 py-2 bg-accent-blue hover:bg-opacity-80 rounded font-semibold"
                  >
                    Equipar
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-2 bg-primary-medium hover:bg-primary-light rounded"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Use Item Result Modal */}
        {useResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6 text-accent-green">
                ✅ Item Usado!
              </h2>

              <p className="text-center mb-6">{useResult.message}</p>

              {useResult.effect && (
                <div className="space-y-3 mb-6">
                  {useResult.effect.hpRestored !== undefined && (
                    <div className="flex justify-between text-lg bg-accent-green/10 border border-accent-green rounded-lg p-3">
                      <span>HP Restaurado:</span>
                      <span className="text-accent-green font-bold">+{useResult.effect.hpRestored}</span>
                    </div>
                  )}
                  {useResult.effect.buffApplied && (
                    <div className="bg-accent-blue/10 border border-accent-blue rounded-lg p-3">
                      <p className="font-bold text-center text-accent-blue">
                        Buff: {useResult.effect.buffApplied}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setUseResult(null)}
                className="w-full py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
