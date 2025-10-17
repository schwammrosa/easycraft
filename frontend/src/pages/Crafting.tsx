import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { craftingService, CraftingRecipe, CraftResult } from '../services/crafting.service';
import { useCharacterStore } from '../store/characterStore';
import { characterService } from '../services/character.service';
import { inventoryService } from '../services/inventory.service';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Crafting() {
  const navigate = useNavigate();
  const { selectedCharacter, selectCharacter } = useCharacterStore();
  const [recipes, setRecipes] = useState<CraftingRecipe[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [craftResult, setCraftResult] = useState<CraftResult | null>(null);
  const [error, setError] = useState('');
  const [crafting, setCrafting] = useState(false);

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
      const [recipesData, inventoryData] = await Promise.all([
        craftingService.getRecipes(selectedCharacter.id),
        inventoryService.getInventory(selectedCharacter.id),
      ]);
      setRecipes(recipesData);
      setInventory(inventoryData);
    } catch (err: any) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCraft = async (recipeCode: string) => {
    if (!selectedCharacter || crafting) return;

    setCrafting(true);
    setError('');

    try {
      const result = await craftingService.craftItem(selectedCharacter.id, recipeCode);
      setCraftResult(result);

      // Reload data
      const [updatedChar, inventoryData] = await Promise.all([
        characterService.getCharacter(selectedCharacter.id),
        inventoryService.getInventory(selectedCharacter.id),
      ]);
      selectCharacter(updatedChar);
      setInventory(inventoryData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Erro ao craftar item';
      setError(errorMessage);
    } finally {
      setCrafting(false);
    }
  };

  const getItemQuantity = (itemCode: string): number => {
    const item = inventory.find(inv => inv.item.code === itemCode);
    return item?.quantity || 0;
  };

  const canCraft = (recipe: CraftingRecipe): boolean => {
    if (!selectedCharacter) return false;
    if (selectedCharacter.level < recipe.requiredLevel) return false;
    if (Number(selectedCharacter.gold) < recipe.goldCost) return false;

    for (const ingredient of recipe.ingredients) {
      const available = getItemQuantity(ingredient.itemCode);
      if (available < ingredient.quantity) {
        return false;
      }
    }
    return true;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weapon': return 'text-accent-red';
      case 'armor': return 'text-accent-blue';
      case 'consumable': return 'text-accent-green';
      case 'material': return 'text-accent-gold';
      case 'enhancement': return 'text-accent-purple';
      default: return 'text-white';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'weapon': return 'bg-accent-red/20 border-accent-red';
      case 'armor': return 'bg-accent-blue/20 border-accent-blue';
      case 'consumable': return 'bg-accent-green/20 border-accent-green';
      case 'material': return 'bg-accent-gold/20 border-accent-gold';
      case 'enhancement': return 'bg-accent-purple/20 border-accent-purple';
      default: return 'bg-bg-input';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'consumable': return '🧪';
      case 'material': return '⚙️';
      case 'enhancement': return '✨';
      default: return '📦';
    }
  };

  const filteredRecipes = selectedCategory === 'all'
    ? recipes
    : recipes.filter(r => r.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'Todas', icon: '📦' },
    { value: 'weapon', label: 'Armas', icon: '⚔️' },
    { value: 'armor', label: 'Armaduras', icon: '🛡️' },
    { value: 'consumable', label: 'Consumíveis', icon: '🧪' },
    { value: 'material', label: 'Materiais', icon: '⚙️' },
    { value: 'enhancement', label: 'Aprimoramentos', icon: '✨' },
  ];

  if (loading) {
    return <LoadingSpinner fullscreen message="Carregando crafting..." size="lg" />;
  }

  if (!selectedCharacter) return null;

  return (
    <PageLayout title="🔨 Crafting" showBack={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-accent-gold">Receitas de Crafting</h2>
            <p className="text-text-secondary mt-1">
              Gold: <span className="text-accent-gold font-bold">{Number(selectedCharacter.gold)}</span>
            </p>
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

        {/* Craft Result Modal */}
        {craftResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg-panel rounded-lg p-8 max-w-md w-full">
              <h2 className={`text-2xl font-bold text-center mb-6 ${
                craftResult.success ? 'text-accent-green' : 'text-accent-red'
              }`}>
                {craftResult.success ? '✅ Sucesso!' : '❌ Falha!'}
              </h2>

              <p className="text-center mb-6">{craftResult.message}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span>XP Ganho:</span>
                  <span className="text-accent-blue font-bold">+{craftResult.xpGained}</span>
                </div>

                {craftResult.success && craftResult.resultItem && (
                  <div className="bg-accent-green/10 border border-accent-green rounded-lg p-4">
                    <p className="font-bold text-center text-accent-green">
                      {craftResult.resultItem.itemCode} x{craftResult.resultItem.quantity}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setCraftResult(null)}
                className="w-full py-3 bg-accent-blue hover:bg-opacity-80 rounded-lg font-semibold"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-panel text-text-secondary hover:bg-primary-medium'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-text-secondary">
              Nenhuma receita disponível nesta categoria.
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const craftable = canCraft(recipe);
              
              return (
                <div
                  key={recipe.id}
                  className={`rounded-lg p-6 border ${getCategoryBg(recipe.category)} ${
                    !craftable && 'opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-bold ${getCategoryColor(recipe.category)}`}>
                      {getCategoryIcon(recipe.category)} {recipe.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-bg-main rounded">
                      Nv. {recipe.requiredLevel}
                    </span>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-text-secondary mb-4">{recipe.description}</p>
                  )}

                  {/* Result */}
                  <div className="bg-bg-main rounded-lg p-3 mb-4">
                    <p className="text-xs text-white mb-1">Resultado:</p>
                    <p className="font-semibold text-accent-green">
                      {recipe.resultItemCode} x{recipe.resultQuantity}
                    </p>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <p className="text-xs text-white mb-2">Materiais:</p>
                    <div className="space-y-1">
                      {recipe.ingredients.map((ing, i) => {
                        const available = getItemQuantity(ing.itemCode);
                        const hasEnough = available >= ing.quantity;
                        
                        return (
                          <div key={i} className={`text-sm flex justify-between ${
                            hasEnough ? 'text-white' : 'text-accent-red'
                          }`}>
                            <span>• {ing.itemCode}</span>
                            <span className="font-mono">
                              {available} / {ing.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost & Rewards */}
                  <div className="border-t border-primary-medium pt-3 mb-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white">Custo:</span>
                      <span className={
                        Number(selectedCharacter.gold) >= recipe.goldCost
                          ? 'text-accent-gold'
                          : 'text-accent-red'
                      }>
                        {recipe.goldCost} Gold
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>XP:</span>
                      <span className="text-accent-blue">+{recipe.xpReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Taxa:</span>
                      <span className={recipe.successRate >= 0.95 ? 'text-accent-green' : 'text-accent-gold'}>
                        {(recipe.successRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Craft Button */}
                  <button
                    onClick={() => handleCraft(recipe.code)}
                    disabled={!craftable || crafting}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      craftable && !crafting
                        ? 'bg-accent-blue hover:bg-opacity-80'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {crafting ? 'Craftando...' : craftable ? 'Craftar' : 'Indisponível'}
                  </button>

                  {/* Warnings */}
                  {!craftable && (
                    <div className="mt-2 text-xs text-accent-red text-center">
                      {selectedCharacter.level < recipe.requiredLevel && '⚠️ Nível baixo'}
                      {Number(selectedCharacter.gold) < recipe.goldCost && '⚠️ Gold insuficiente'}
                      {recipe.ingredients.some(ing => getItemQuantity(ing.itemCode) < ing.quantity) && 
                        '⚠️ Materiais faltando'}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}
