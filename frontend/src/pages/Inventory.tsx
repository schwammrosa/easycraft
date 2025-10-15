import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService, InventoryItem, Equipment } from '../services/inventory.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';

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
    if (!selectedCharacter || !item.item.slot) return;

    try {
      await inventoryService.equipItem(selectedCharacter.id, item.id, item.item.slot);
      await loadData();
      setSelectedItem(null);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao equipar item');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando inventário...</p>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) return null;

  return (
    <div className="min-h-screen bg-bg-main p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-gold">Inventário</h1>
            <p className="text-text-secondary">{selectedCharacter.name}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
          >
            ← Voltar
          </button>
        </div>

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Equipment Panel */}
          <div className="lg:col-span-1">
            <div className="bg-bg-panel rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Equipamentos</h2>
              
              <div className="space-y-3">
                {Object.entries(SLOT_NAMES).map(([slot, name]) => {
                  const equipped = equipment.find((e) => e.slot === slot);
                  
                  return (
                    <div key={slot} className="bg-bg-input rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{name}</span>
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
                              {Object.entries(JSON.parse(equipped.inventory.item.attributes as string)).map(
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
                <h3 className="font-bold mb-3">Stats Totais</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>STR: <span className="text-accent-red">{selectedCharacter.stats.totalStr}</span></div>
                  <div>AGI: <span className="text-accent-green">{selectedCharacter.stats.totalAgi}</span></div>
                  <div>VIT: <span className="text-accent-gold">{selectedCharacter.stats.totalVit}</span></div>
                  <div>INT: <span className="text-accent-blue">{selectedCharacter.stats.totalInt}</span></div>
                  <div>DEF: <span className="text-accent-purple">{selectedCharacter.stats.totalDef}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="lg:col-span-2">
            <div className="bg-bg-panel rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Itens ({inventory.length} itens)
              </h2>
              
              {inventory.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <p className="mb-2">Seu inventário está vazio</p>
                  <p className="text-sm">Derrote monstros para conseguir itens!</p>
                </div>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquip(item);
                          }}
                          className="w-full mt-2 py-1 bg-accent-blue hover:bg-opacity-80 rounded text-xs"
                        >
                          Equipar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              
              {selectedItem.item.attributes && Object.keys(JSON.parse(selectedItem.item.attributes as string)).length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Atributos:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(JSON.parse(selectedItem.item.attributes as string)).map(
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
      </div>
    </div>
  );
}
