import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchAlbumById } from '../clients/album';
import { Album, Sticker, StickerItem } from '../types/album';

const stickerTypeInfo = {
  'common': { name: 'Comum', description: 'Figurinha padrão 7x5cm' },
  'frame': { name: 'Quadro', description: 'Quadro emoldurado 15x20cm' },
  'legend': { name: 'Lenda', description: 'Figurinha especial metalizada' },
  'a4': { name: 'Folha A4', description: 'Impressão em folha A4' }
};

const stickerPrices = {
  'common': 9.90,
  'frame': 29.90,
  'legend': 12.90,
  'a4': 19.90
};

const StickersPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStickers, setSelectedStickers] = useState<Sticker[]>([]);
  const [filter, setFilter] = useState<'common' | 'legend' | 'quadro' | 'a4' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const getAlbumAndStickers = async () => {
      if (!albumId) return;

      try {
        setLoading(false);

        const album = await fetchAlbumById(albumId);
        setAlbum(album);

        const allStickers: Sticker[] = [];

        album.commonStickers.forEach((item: StickerItem) => {
          allStickers.push({
            id: `common-${item.number}`,
            albumId: album.id,
            number: item.number,
            name: item.name,
            type: 'common',
            price: stickerPrices.common
          });
        });

        album.frameStickers.forEach((item: StickerItem) => {
          allStickers.push({
            id: `frame-${item.number}`,
            albumId: album.id,
            number: item.number,
            name: item.name,
            type: 'frame',
            price: stickerPrices.frame
          });
        });

        album.legendStickers.forEach((item: StickerItem) => {
          allStickers.push({
            id: `legend-${item.number}`,
            albumId: album.id,
            number: item.number,
            name: item.name,
            type: 'legend',
            price: stickerPrices.legend
          });
        });

        album.a4Stickers.forEach((item: StickerItem) => {
          allStickers.push({
            id: `a4-${item.number}`,
            albumId: album.id,
            number: item.number,
            name: item.name,
            type: 'a4',
            price: stickerPrices.a4
          });
        });

        setStickers(allStickers);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar álbum ou figurinhas:', err);
        setError('Falha ao carregar as figurinhas. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    getAlbumAndStickers();
  }, [albumId]);

  const toggleSticker = (sticker: Sticker) => {
    if (selectedStickers.some(s => s.id === sticker.id)) {
      setSelectedStickers(selectedStickers.filter(s => s.id !== sticker.id));
    } else {
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', selectedStickers.map(s => s.id));
    if (album && selectedStickers.length > 0) {
      addToCart(album, selectedStickers);
      setShowSuccess(true);
      setSelectedStickers([]);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
  };

  const filteredStickers = filter
    ? stickers.filter(sticker => sticker.type === filter)
    : stickers;

  // Obter tipos únicos das figurinhas disponíveis
  const availableTypes = [...new Set(stickers.map(sticker => sticker.type))];

  return (
    <div className="space-y-6 pb-24 mt-14">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
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

          {/* Filtro por tipo */}
          <div className="flex overflow-x-auto pb-2 space-x-2">
            <button
              className={`px-4 py-2 rounded-full ${filter === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setFilter('')}
            >
              Todas
            </button>
            {availableTypes.map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === type ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setFilter(type as "" | "common" | "legend" | "quadro" | "a4")}
              >
                {stickerTypeInfo[type]?.name || type}
              </button>
            ))}
          </div>

          {filteredStickers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma figurinha disponível para este álbum.</p>
              <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:underline">
                Voltar para lista de escolas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredStickers.map((sticker) => {
                const isSelected = selectedStickers.some(s => s.id === sticker.id);
                const typeInfo = stickerTypeInfo[sticker.type];
                const bgColorClass =
                  sticker.type === 'a4' ? 'bg-blue-50' :
                    sticker.type === 'frame' ? 'bg-amber-50' :
                      sticker.type === 'legend' ? 'bg-purple-50' :
                        'bg-gray-100';

                const stickerStyle =
                  sticker.type === 'a4' ? 'w-14 h-18' :
                    sticker.type === 'frame' ? 'w-16 h-16 border-2 border-amber-200' :
                      sticker.type === 'legend' ? 'w-14 h-18 bg-gradient-to-r from-purple-100 to-pink-100' :
                        'w-14 h-18';

                return (
                  <div
                    key={sticker.id}
                    className={`cursor-pointer relative bg-white rounded-lg shadow-sm overflow-hidden border-2 ${isSelected ? 'border-primary-500' : 'border-transparent'}`}
                    onClick={() => toggleSticker(sticker)}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-primary-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className={`h-20 ${bgColorClass} flex items-center justify-center`}>
                      <div className={`${stickerStyle} bg-white border border-gray-300 flex items-center justify-center rounded`}>
                        <p className="text-sm font-medium text-gray-700">{sticker.number}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-700 truncate" title={sticker.name}>{sticker.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs font-medium">{typeInfo?.name || sticker.type}</p>
                        <p className="font-semibold text-xs">R${sticker.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {selectedStickers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{selectedStickers.length} figurinhas selecionadas</p>
              <p className="font-semibold">
                Total: R$ {selectedStickers.reduce((sum, sticker) => sum + sticker.price, 0).toFixed(2)}
              </p>
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
  );
};

export default StickersPage;