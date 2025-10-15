import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store/characterStore';
import { marketplaceService, MarketplaceListing, MarketplaceFilters, MarketplaceTransaction } from '../services/marketplace.service';
import { inventoryService, InventoryItem } from '../services/inventory.service';
import { characterService } from '../services/character.service';

export function Marketplace() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  
  const [activeTab, setActiveTab] = useState<'browse' | 'my' | 'history'>('browse');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<MarketplaceTransaction[]>([]);
  const [historyType, setHistoryType] = useState<'purchases' | 'sales'>('purchases');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Create listing modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [creating, setCreating] = useState(false);
  
  // Buy modal
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!selectedCharacter) {
      navigate('/characters');
      return;
    }
    loadListings();
  }, [selectedCharacter, search, typeFilter, sortBy, page]);

  useEffect(() => {
    if (activeTab === 'my' && selectedCharacter) {
      loadMyListings();
    }
  }, [activeTab, selectedCharacter]);

  useEffect(() => {
    if (activeTab === 'history' && selectedCharacter) {
      loadHistory();
    }
  }, [activeTab, selectedCharacter, historyType, historyPage]);

  const loadListings = async () => {
    if (!selectedCharacter) return;
    
    setLoading(true);
    try {
      const filters: MarketplaceFilters = {
        search: search || undefined,
        type: typeFilter || undefined,
        sortBy,
        page,
        limit: 12,
      };
      
      const response = await marketplaceService.getListings(filters);
      setListings(response.listings);
      setTotalPages(response.totalPages);
      setError('');
    } catch (err: any) {
      setError('Erro ao carregar marketplace');
    } finally {
      setLoading(false);
    }
  };

  const loadMyListings = async () => {
    if (!selectedCharacter) return;
    
    try {
      const myListingsData = await marketplaceService.getMyListings(selectedCharacter.id);
      setMyListings(myListingsData);
    } catch (err: any) {
      setError('Erro ao carregar seus anúncios');
    }
  };

  const loadHistory = async () => {
    if (!selectedCharacter) return;
    
    setHistoryLoading(true);
    try {
      const historyData = await marketplaceService.getHistory(
        selectedCharacter.id,
        historyType,
        historyPage,
        15
      );
      setHistoryTransactions(historyData.transactions);
      setHistoryTotalPages(historyData.totalPages);
      setError('');
    } catch (err: any) {
      setError('Erro ao carregar histórico');
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadInventory = async () => {
    if (!selectedCharacter) return;
    
    try {
      const inventoryData = await inventoryService.getInventory(selectedCharacter.id);
      // Filter only tradeable items
      const tradeable = inventoryData.filter(item => item.item.isTradeable);
      setInventory(tradeable);
    } catch (err: any) {
      setError('Erro ao carregar inventário');
    }
  };

  const handleBuyListing = (listing: MarketplaceListing) => {
    if (!selectedCharacter) return;
    
    setSelectedListing(listing);
    setBuyQuantity(1);
    setShowBuyModal(true);
  };

  const handleConfirmBuy = async () => {
    if (!selectedCharacter || !selectedListing) return;

    const totalPrice = selectedListing.pricePerUnit * buyQuantity;

    if (totalPrice > selectedCharacter.gold) {
      setError('Gold insuficiente!');
      return;
    }

    setBuying(true);
    try {
      await marketplaceService.buyListing(selectedCharacter.id, selectedListing.id, buyQuantity);
      setSuccess(`${buyQuantity}x ${selectedListing.item.name} comprado com sucesso!`);
      
      // Reload data
      const updatedChar = await characterService.getCharacter(selectedCharacter.id);
      selectCharacter(updatedChar);
      loadListings();
      
      setShowBuyModal(false);
      setSelectedListing(null);
      setBuyQuantity(1);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao comprar item');
    } finally {
      setBuying(false);
    }
  };

  const handleCancelListing = async (listingId: number) => {
    if (!selectedCharacter) return;

    if (window.confirm('Cancelar este anúncio? O item voltará para seu inventário.')) {
      try {
        await marketplaceService.cancelListing(selectedCharacter.id, listingId);
        setSuccess('Anúncio cancelado!');
        loadMyListings();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Erro ao cancelar anúncio');
      }
    }
  };

  const handleCreateListing = async () => {
    if (!selectedCharacter || !selectedItem) return;

    if (quantity <= 0 || quantity > selectedItem.quantity) {
      setError('Quantidade inválida');
      return;
    }

    if (pricePerUnit <= 0) {
      setError('Preço inválido');
      return;
    }

    setCreating(true);
    try {
      await marketplaceService.createListing(selectedCharacter.id, {
        inventoryId: selectedItem.id,
        quantity,
        pricePerUnit,
      });
      
      setSuccess('Anúncio criado com sucesso!');
      setShowCreateModal(false);
      setSelectedItem(null);
      setQuantity(1);
      setPricePerUnit(0);
      loadListings();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao criar anúncio');
    } finally {
      setCreating(false);
    }
  };

  const openCreateModal = async () => {
    await loadInventory();
    setShowCreateModal(true);
  };

  if (!selectedCharacter) return null;

  const totalCommission = selectedItem && pricePerUnit > 0
    ? Math.floor((pricePerUnit * quantity) * 0.05)
    : 0;
  const totalReceive = selectedItem && pricePerUnit > 0
    ? (pricePerUnit * quantity) - totalCommission
    : 0;

  // Calculate max affordable quantity for selected listing
  const maxAffordable = selectedListing 
    ? Math.min(selectedListing.quantity, Math.floor(selectedCharacter.gold / selectedListing.pricePerUnit))
    : 0;

  return (
    <div className="min-h-screen bg-bg-main text-text-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-accent-gold">🏪 Marketplace</h1>
            <p className="text-text-secondary">{selectedCharacter.name} | {selectedCharacter.gold} gold</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary-medium hover:bg-primary-light rounded-lg"
          >
            ← Voltar
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-accent-green/10 border border-accent-green text-accent-green px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'browse'
                ? 'bg-accent-gold text-bg-dark'
                : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
            }`}
          >
            🛒 Comprar
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'my'
                ? 'bg-accent-gold text-bg-dark'
                : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
            }`}
          >
            📦 Meus Anúncios
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'history'
                ? 'bg-accent-gold text-bg-dark'
                : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
            }`}
          >
            📜 Histórico
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="bg-bg-panel rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="🔍 Buscar item..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                />
                
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                >
                  <option value="">Todos os tipos</option>
                  <option value="weapon">Armas</option>
                  <option value="armor">Armaduras</option>
                  <option value="consumable">Consumíveis</option>
                  <option value="material">Materiais</option>
                  <option value="enhancement">Aprimoramentos</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigos</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                </select>

                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
                >
                  + Vender Item
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
                <p className="text-text-secondary">Carregando...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-bg-panel rounded-lg p-12 text-center">
                <p className="text-text-secondary text-lg">Nenhum item encontrado</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-bg-panel rounded-lg p-4 border border-primary-medium hover:border-accent-gold transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{listing.item.name}</h3>
                        {listing.quantity > 1 && (
                          <span className="text-xs bg-accent-blue px-2 py-1 rounded">x{listing.quantity}</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                        {listing.item.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-text-secondary">Por: {listing.seller.name}</span>
                      </div>
                      
                      <div className="border-t border-primary-medium pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Preço unitário:</span>
                          <span className="font-semibold text-accent-gold">{listing.pricePerUnit}g</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold text-accent-gold text-xl">{listing.totalPrice}g</span>
                        </div>
                        
                        <button
                          onClick={() => handleBuyListing(listing)}
                          disabled={listing.sellerId === selectedCharacter.id}
                          className={`w-full py-2 rounded-lg font-semibold transition ${
                            listing.sellerId === selectedCharacter.id
                              ? 'bg-gray-600 cursor-not-allowed'
                              : listing.totalPrice > selectedCharacter.gold
                              ? 'bg-accent-gold hover:bg-opacity-80'
                              : 'bg-accent-green hover:bg-opacity-80'
                          }`}
                        >
                          {listing.sellerId === selectedCharacter.id
                            ? 'Seu Anúncio'
                            : listing.totalPrice > selectedCharacter.gold
                            ? '💰 Comprar (parcial)'
                            : '💰 Comprar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-bg-panel rounded-lg disabled:opacity-50"
                    >
                      ← Anterior
                    </button>
                    <span className="px-4 py-2 bg-bg-panel rounded-lg">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-bg-panel rounded-lg disabled:opacity-50"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            {/* History Type Filter */}
            <div className="bg-bg-panel rounded-lg p-6 mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    setHistoryType('purchases');
                    setHistoryPage(1);
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    historyType === 'purchases'
                      ? 'bg-accent-blue text-white'
                      : 'bg-bg-input text-text-secondary hover:bg-primary-medium'
                  }`}
                >
                  💰 Compras
                </button>
                <button
                  onClick={() => {
                    setHistoryType('sales');
                    setHistoryPage(1);
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    historyType === 'sales'
                      ? 'bg-accent-green text-white'
                      : 'bg-bg-input text-text-secondary hover:bg-primary-medium'
                  }`}
                >
                  💵 Vendas
                </button>
              </div>

              {historyLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
                  <p className="text-text-secondary">Carregando histórico...</p>
                </div>
              ) : historyTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">
                    {historyType === 'purchases' 
                      ? 'Você ainda não comprou nenhum item'
                      : 'Você ainda não vendeu nenhum item'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {historyTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-bg-input rounded-lg p-4 border border-primary-medium"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">
                              {transaction.item.name}
                              <span className="ml-2 text-sm text-accent-blue">x{transaction.quantity}</span>
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-text-secondary">Preço unitário: </span>
                                <span className="font-semibold text-accent-gold">{transaction.pricePerUnit}g</span>
                              </div>
                              <div>
                                <span className="text-text-secondary">Total: </span>
                                <span className="font-bold text-accent-gold">{transaction.totalPrice}g</span>
                              </div>
                              <div>
                                <span className="text-text-secondary">
                                  {historyType === 'purchases' ? 'Vendedor: ' : 'Comprador: '}
                                </span>
                                <span className="font-semibold">
                                  {historyType === 'purchases' 
                                    ? transaction.seller.name 
                                    : transaction.buyer.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-text-secondary">Data: </span>
                                <span className="text-sm">
                                  {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>

                            {transaction.commission > 0 && historyType === 'sales' && (
                              <p className="text-xs text-text-secondary">
                                Comissão descontada: {transaction.commission}g
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* History Pagination */}
                  {historyTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button
                        onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                        disabled={historyPage === 1}
                        className="px-4 py-2 bg-bg-input rounded-lg disabled:opacity-50 hover:bg-primary-medium"
                      >
                        ← Anterior
                      </button>
                      <span className="px-4 py-2 bg-bg-input rounded-lg">
                        Página {historyPage} de {historyTotalPages}
                      </span>
                      <button
                        onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))}
                        disabled={historyPage === historyTotalPages}
                        className="px-4 py-2 bg-bg-input rounded-lg disabled:opacity-50 hover:bg-primary-medium"
                      >
                        Próxima →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'my' && (
          <div>
            <div className="bg-bg-panel rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Seus Anúncios</h2>
              
              {myListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">Você não tem anúncios</p>
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold"
                  >
                    + Criar Primeiro Anúncio
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-bg-input rounded-lg p-4 border border-primary-medium"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            {listing.item.name}
                            {listing.quantity > 1 && (
                              <span className="ml-2 text-sm text-accent-blue">x{listing.quantity}</span>
                            )}
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                              <span className="text-text-secondary">Preço: </span>
                              <span className="font-semibold text-accent-gold">{listing.totalPrice}g</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Status: </span>
                              <span className={`font-semibold ${
                                listing.status === 'active' ? 'text-accent-green' :
                                listing.status === 'sold' ? 'text-accent-blue' :
                                'text-text-secondary'
                              }`}>
                                {listing.status === 'active' ? '🟢 Ativo' :
                                 listing.status === 'sold' ? '✅ Vendido' :
                                 listing.status === 'cancelled' ? '❌ Cancelado' : '⏱️ Expirado'}
                              </span>
                            </div>
                          </div>
                          
                          {listing.status === 'sold' && listing.buyer && (
                            <p className="text-sm text-text-secondary">
                              Comprado por: {listing.buyer.name}
                            </p>
                          )}
                        </div>
                        
                        {listing.status === 'active' && (
                          <button
                            onClick={() => handleCancelListing(listing.id)}
                            className="ml-4 px-4 py-2 bg-accent-red hover:bg-opacity-80 rounded-lg text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Listing Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Vender Item</h2>
              
              {!selectedItem ? (
                <div>
                  <p className="text-text-secondary mb-4">Selecione um item do seu inventário:</p>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {inventory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setQuantity(1);
                          setPricePerUnit(item.item.baseValue);
                        }}
                        className="bg-bg-input rounded-lg p-4 border border-primary-medium hover:border-accent-gold transition text-left"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{item.item.name}</h3>
                          {item.quantity > 1 && (
                            <span className="text-xs bg-accent-blue px-2 py-1 rounded">x{item.quantity}</span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                          {item.item.description}
                        </p>
                        <p className="text-sm text-accent-gold">Valor base: {item.item.baseValue}g</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-bg-input rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">{selectedItem.item.name}</h3>
                    <p className="text-sm text-text-secondary mb-2">{selectedItem.item.description}</p>
                    <p className="text-sm">Disponível: {selectedItem.quantity}</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedItem.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Preço por Unidade (sugestão: {selectedItem.item.baseValue}g)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-accent-blue/10 border border-accent-blue rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Preço Total:</span>
                      <span className="font-bold text-accent-gold">{pricePerUnit * quantity}g</span>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary mb-2">
                      <span>Comissão (5%):</span>
                      <span>-{totalCommission}g</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-accent-blue pt-2">
                      <span>Você Receberá:</span>
                      <span className="text-accent-green">{totalReceive}g</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedItem(null);
                    setQuantity(1);
                    setPricePerUnit(0);
                  }}
                  className="flex-1 py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                
                {selectedItem && (
                  <button
                    onClick={handleCreateListing}
                    disabled={creating || quantity <= 0 || pricePerUnit <= 0}
                    className="flex-1 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Criando...' : '✅ Criar Anúncio'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buy Modal */}
        {showBuyModal && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Comprar Item</h2>
              
              <div className="bg-bg-input rounded-lg p-4 mb-6">
                <h3 className="font-bold text-lg mb-2">{selectedListing.item.name}</h3>
                <p className="text-sm text-text-secondary mb-2">{selectedListing.item.description}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Disponível:</span>
                  <span className="font-semibold">{selectedListing.quantity}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Preço unitário:</span>
                  <span className="font-semibold text-accent-gold">{selectedListing.pricePerUnit}g</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Quantidade (disponível: {selectedListing.quantity}, você pode comprar: {maxAffordable})
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxAffordable}
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(Math.min(maxAffordable, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 bg-bg-input border border-primary-medium rounded-lg focus:outline-none focus:border-accent-gold"
                />
                {maxAffordable === 0 && (
                  <p className="text-sm text-accent-red mt-2">Você não tem gold suficiente para comprar nenhuma unidade!</p>
                )}
                {maxAffordable > 0 && maxAffordable < selectedListing.quantity && (
                  <p className="text-sm text-accent-gold mt-2">⚠️ Com seu gold, você pode comprar no máximo {maxAffordable} unidade{maxAffordable > 1 ? 's' : ''}.</p>
                )}
              </div>
              
              <div className="bg-accent-blue/10 border border-accent-blue rounded-lg p-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total a Pagar:</span>
                  <span className="text-accent-gold">{selectedListing.pricePerUnit * buyQuantity}g</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary mt-2">
                  <span>Seu Gold:</span>
                  <span className={selectedCharacter!.gold >= selectedListing.pricePerUnit * buyQuantity ? 'text-accent-green' : 'text-accent-red'}>
                    {selectedCharacter!.gold}g
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setSelectedListing(null);
                    setBuyQuantity(1);
                  }}
                  className="flex-1 py-3 bg-primary-medium hover:bg-primary-light rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleConfirmBuy}
                  disabled={buying || maxAffordable === 0 || selectedListing.pricePerUnit * buyQuantity > selectedCharacter!.gold}
                  className="flex-1 py-3 bg-accent-green hover:bg-opacity-80 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buying ? 'Comprando...' : '💰 Confirmar Compra'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
