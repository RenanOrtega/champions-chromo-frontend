import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchAlbumById } from '../clients/album';
import { Album, Sticker } from '../types/album';
import { useSchoolBanner } from '@/context/BannerContext';

const defaultStickerPrices = {
  'common': 1,
  'legend': 5,
  'a4': 15
};

interface StickerSelection {
  stickerId: string;
  stickerNumber: string;
  stickerName: string;
  common: number;
  legend: number;
  a4: number;
}

interface ModalSticker {
  id: string;
  number: string;
  name: string;
}

// Função para gerar figurinhas baseado no totalStickers
const generateStickers = (album: Album): ModalSticker[] => {
  const stickers: ModalSticker[] = [];
  const totalStickers = album.totalStickers;

  for (let i = 1; i <= totalStickers; i++) {
    stickers.push({
      id: `sticker-${i}`,
      number: i.toString(),
      name: `Figurinha ${i}`
    });
  }

  return stickers;
};

const StickersPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [stickers, setStickers] = useState<ModalSticker[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStickers, setSelectedStickers] = useState<StickerSelection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSticker, setCurrentSticker] = useState<ModalSticker | null>(null);
  const [modalQuantities, setModalQuantities] = useState({ common: 0, legend: 0, a4: 0 });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { banner } = useSchoolBanner();

  const [showSuccess, setShowSuccess] = useState(false);

  // Função para obter preços do álbum ou usar valores padrão
  const getStickerPrices = () => {
    if (!album) return defaultStickerPrices;

    console.log(album.commonPrice);

    return {
      common: album.commonPrice == 0 ? defaultStickerPrices.common : album.commonPrice,
      legend: album.legendPrice == 0 ? defaultStickerPrices.legend : album.legendPrice,
      a4: album.a4Price == 0 ? defaultStickerPrices.a4 : album.a4Price
    };
  };

  // Função para obter informações dos tipos de sticker com preços dinâmicos
  const getStickerTypeInfo = () => {
    const prices = getStickerPrices();
    return {
      'common': { name: 'Comum', price: prices.common },
      'legend': { name: 'Legend', price: prices.legend },
      'a4': { name: 'A4', price: prices.a4 }
    };
  };

  useEffect(() => {
    const getAlbumAndStickers = async () => {
      if (!albumId) return;

      try {
        setLoading(true);

        const album = await fetchAlbumById(albumId);
        setAlbum(album);

        // Gerar figurinhas baseado no totalStickers
        const generatedStickers = generateStickers(album);
        setStickers(generatedStickers);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar álbum ou figurinhas:', err);
        setError('Falha ao carregar as figurinhas. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    getAlbumAndStickers();
  }, [albumId]);

  // Função para obter tipos disponíveis baseado no álbum
  const getAvailableTypes = () => {
    if (!album) return [];

    const types = [];
    if (album.hasCommon) types.push('common');
    if (album.hasLegend) types.push('legend');
    if (album.hasA4) types.push('a4');

    return types;
  };

  const handleStickerClick = (sticker: ModalSticker) => {
    setCurrentSticker(sticker);
    setModalQuantities({ common: 0, legend: 0, a4: 0 });
    setShowModal(true);
  };

  const updateQuantity = (type: 'common' | 'legend' | 'a4', increment: boolean) => {
    setModalQuantities(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const handleAddToSelection = () => {
    if (!currentSticker) return;

    const totalQuantity = modalQuantities.common + modalQuantities.legend + modalQuantities.a4;
    if (totalQuantity === 0) return;

    const existingIndex = selectedStickers.findIndex(s => s.stickerId === currentSticker.id);

    if (existingIndex >= 0) {
      // Atualizar seleção existente
      setSelectedStickers(prev => prev.map((item, index) =>
        index === existingIndex
          ? {
            ...item,
            common: modalQuantities.common,
            legend: modalQuantities.legend,
            a4: modalQuantities.a4
          }
          : item
      ));
    } else {
      // Adicionar nova seleção
      setSelectedStickers(prev => [...prev, {
        stickerId: currentSticker.id,
        stickerNumber: currentSticker.number,
        stickerName: currentSticker.name,
        common: modalQuantities.common,
        legend: modalQuantities.legend,
        a4: modalQuantities.a4
      }]);
    }

    setShowModal(false);
    setCurrentSticker(null);
  };

  const removeFromSelection = (stickerId: string) => {
    setSelectedStickers(prev => prev.filter(s => s.stickerId !== stickerId));
  };

  const handleAddToCart = () => {
    if (!album || selectedStickers.length === 0) return;

    const stickerTypeInfo = getStickerTypeInfo();
    // Converter seleções para formato de stickers para o carrinho
    const cartStickers: Sticker[] = [];

    selectedStickers.forEach(selection => {
      // Adicionar stickers comuns (apenas se o álbum permitir)
      if (album.hasCommon) {
        for (let i = 0; i < selection.common; i++) {
          cartStickers.push({
            id: `${selection.stickerId}-common-${i}`,
            albumId: album.id,
            number: selection.stickerNumber,
            name: selection.stickerName,
            type: 'common',
            price: stickerTypeInfo.common.price
          });
        }
      }

      // Adicionar stickers legend (apenas se o álbum permitir)
      if (album.hasLegend) {
        for (let i = 0; i < selection.legend; i++) {
          cartStickers.push({
            id: `${selection.stickerId}-legend-${i}`,
            albumId: album.id,
            number: selection.stickerNumber,
            name: selection.stickerName,
            type: 'legend',
            price: stickerTypeInfo.legend.price
          });
        }
      }

      // Adicionar stickers A4 (apenas se o álbum permitir)
      if (album.hasA4) {
        for (let i = 0; i < selection.a4; i++) {
          cartStickers.push({
            id: `${selection.stickerId}-a4-${i}`,
            albumId: album.id,
            number: selection.stickerNumber,
            name: selection.stickerName,
            type: 'a4',
            price: stickerTypeInfo.a4.price
          });
        }
      }
    });

    addToCart(album, cartStickers);
    setShowSuccess(true);
    setSelectedStickers([]);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  };

  const getTotalPrice = () => {
    if (!album) return 0;

    const stickerTypeInfo = getStickerTypeInfo();

    return selectedStickers.reduce((total, selection) => {
      let selectionTotal = 0;

      if (album.hasCommon) {
        selectionTotal += selection.common * stickerTypeInfo.common.price;
      }
      if (album.hasLegend) {
        selectionTotal += selection.legend * stickerTypeInfo.legend.price;
      }
      if (album.hasA4) {
        selectionTotal += selection.a4 * stickerTypeInfo.a4.price;
      }

      return total + selectionTotal;
    }, 0);
  };

  const getTotalItems = () => {
    if (!album) return 0;

    return selectedStickers.reduce((total, selection) => {
      let selectionTotal = 0;

      if (album.hasCommon) selectionTotal += selection.common;
      if (album.hasLegend) selectionTotal += selection.legend;
      if (album.hasA4) selectionTotal += selection.a4;

      return total + selectionTotal;
    }, 0);
  };

  const isSelected = (stickerId: string) => {
    return selectedStickers.some(s => s.stickerId === stickerId);
  };

  const formatSelectedStickerText = (selection: StickerSelection) => {
    if (!album) return '';

    const parts = [];
    if (album.hasCommon && selection.common > 0) {
      parts.push(`${selection.common} Comum`);
    }
    if (album.hasLegend && selection.legend > 0) {
      parts.push(`${selection.legend} Legend`);
    }
    if (album.hasA4 && selection.a4 > 0) {
      parts.push(`${selection.a4} A4`);
    }

    return parts.join(' ');
  };

  return (
    <>
      {banner()}
      <div className={`space-y-6 pb-24 ${banner()?.props.warning ? 'mt-30' : 'mt-20'} mx-5`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 cursor-pointer" />
          </button>
          <h1 className="md:text-2xl font-bold">
            {album ? `Figurinhas para ${album.name}` : 'Carregando...'}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
              Voltar para lista de escolas
            </Link>
          </div>
        ) : (
          <>
            {/* Feedback de sucesso */}
            {showSuccess && (
              <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Figurinhas adicionadas ao carrinho!</p>
                </div>
              </div>
            )}

            {/* Informações do álbum */}
            {album && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Total de figurinhas disponíveis: {album.totalStickers}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Tipos disponíveis:</span>
                  {album.hasCommon && (
                    <span className="px-2 py-1 bg-gray-200 text-xs rounded-full">Comum</span>
                  )}
                  {album.hasLegend && (
                    <span className="px-2 py-1 bg-purple-200 text-xs rounded-full">Legend</span>
                  )}
                  {album.hasA4 && (
                    <span className="px-2 py-1 bg-blue-200 text-xs rounded-full">A4</span>
                  )}
                </div>
              </div>
            )}

            {/* Tabela de preços - mostra apenas tipos disponíveis com preços dinâmicos */}
            {album && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Preços por tipo:</h3>
                <div className={`grid gap-4 text-center ${getAvailableTypes().length === 1 ? 'grid-cols-1' :
                  getAvailableTypes().length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                  {album.hasCommon && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">Comum</p>
                      <p className="text-lg font-bold text-gray-700">R$ {getStickerPrices().common.toFixed(2)}</p>
                    </div>
                  )}
                  {album.hasLegend && (
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">Legend</p>
                      <p className="text-lg font-bold text-purple-700">R$ {getStickerPrices().legend.toFixed(2)}</p>
                    </div>
                  )}
                  {album.hasA4 && (
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm font-medium">A4</p>
                      <p className="text-lg font-bold text-blue-700">R$ {getStickerPrices().a4.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de figurinhas selecionadas */}
            {selectedStickers.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Figurinhas selecionadas:</h3>
                <div className="space-y-2">
                  {selectedStickers.map((selection) => (
                    <div key={selection.stickerId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">Figurinha {selection.stickerNumber}</p>
                        <p className="text-sm text-gray-600">
                          {formatSelectedStickerText(selection)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromSelection(selection.stickerId)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stickers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma figurinha disponível para este álbum.</p>
                <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
                  Voltar para lista de escolas
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {stickers.map((sticker) => {
                  const selected = isSelected(sticker.id);

                  return (
                    <div
                      key={sticker.id}
                      className={`cursor-pointer relative bg-white rounded-lg shadow-sm overflow-hidden border-2 ${selected ? 'border-primary-500' : 'border-gray-200'} hover:border-primary-300 transition-colors`}
                      onClick={() => handleStickerClick(sticker)}
                    >
                      {selected && (
                        <div className="absolute top-1 right-1 bg-primary-500 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="h-20 bg-gray-100 flex items-center justify-center">
                        <div className="w-14 h-18 bg-white border border-gray-300 flex items-center justify-center rounded">
                          <p className="text-sm font-medium text-gray-700">{sticker.number}</p>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-700 truncate" title={sticker.name}>{sticker.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Clique para escolher tipo</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Modal para seleção de tipos - mostra apenas tipos disponíveis com preços dinâmicos */}
        {showModal && currentSticker && album && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Figurinha {currentSticker.number}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(getStickerTypeInfo())
                  .filter(([type]) => {
                    if (type === 'common') return album.hasCommon;
                    if (type === 'legend') return album.hasLegend;
                    if (type === 'a4') return album.hasA4;
                    return false;
                  })
                  .map(([type, info]) => (
                    <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">{info.name}</p>
                        <p className="text-sm text-gray-600">R$ {info.price.toFixed(2)} cada</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(type as 'common' | 'legend' | 'a4', false)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={modalQuantities[type as 'common' | 'legend' | 'a4'] === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {modalQuantities[type as 'common' | 'legend' | 'a4']}
                        </span>
                        <button
                          onClick={() => updateQuantity(type as 'common' | 'legend' | 'a4', true)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    R$ {(
                      (album.hasCommon ? modalQuantities.common * getStickerPrices().common : 0) +
                      (album.hasLegend ? modalQuantities.legend * getStickerPrices().legend : 0) +
                      (album.hasA4 ? modalQuantities.a4 * getStickerPrices().a4 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToSelection}
                  disabled={modalQuantities.common + modalQuantities.legend + modalQuantities.a4 === 0}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Adicionar à seleção
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedStickers.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{getTotalItems()} figurinhas selecionadas</p>
                <p className="font-semibold">Total: R$ {getTotalPrice().toFixed(2)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 cursor-pointer transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Adicionar ao carrinho</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StickersPage;