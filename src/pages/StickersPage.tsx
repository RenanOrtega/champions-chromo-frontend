// src/pages/StickersPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Album, Sticker } from '../types';

// Dados mockados para figurinhas
const stickersMock: Record<number, Sticker[]> = {
  101: [
    { id: 1001, type: 'common', image: "/sticker1.jpg", price: 9.90 },
    { id: 1002, type: 'common', image: "/sticker2.jpg", price: 9.90 },
    { id: 1003, type: 'common', image: "/sticker3.jpg", price: 9.90 },
    { id: 1004, type: 'legend', image: "/sticker4.jpg", price: 12.90 },
    { id: 1005, type: 'a4', image: "/sticker5.jpg", price: 19.90 },
    { id: 1006, type: 'quadro', image: "/sticker6.jpg", price: 29.90 },
  ],
  102: [
    { id: 2001, type: 'common', image: "/sticker7.jpg", price: 8.90 },
    { id: 2002, type: 'common', image: "/sticker8.jpg", price: 8.90 },
    { id: 2003, type: 'common', image: "/sticker9.jpg", price: 8.90 },
    { id: 2004, type: 'legend', image: "/sticker10.jpg", price: 11.90 },
    { id: 2005, type: 'a4', image: "/sticker11.jpg", price: 18.90 },
  ],
  // Dados para outros álbuns
};

// Dados mockados para álbuns
const albumsMock: Record<number, Album> = {
  101: { id: 101, name: "Álbum 2025 - Colégio Santa Maria", description: "Álbum completo com todas as turmas", price: 49.90, image: "/album1.jpg", year: "2025" },
  102: { id: 102, name: "Álbum 2025 - Turmas do Ensino Fundamental", description: "Álbum com turmas do 1º ao 5º ano", price: 39.90, image: "/album2.jpg", year: "2025" },
  103: { id: 103, name: "Álbum 2025 - Turmas do Ensino Médio", description: "Álbum com turmas do 1º ao 3º ano do EM", price: 39.90, image: "/album3.jpg", year: "2025" },
  201: { id: 201, name: "Álbum 2025 - School Municipal João Paulo", description: "Álbum completo com todas as turmas", price: 45.90, image: "/album4.jpg", year: "2025" },
  202: { id: 202, name: "Álbum 2025 - Anos Iniciais", description: "Álbum com turmas do 1º ao 5º ano", price: 35.90, image: "/album5.jpg", year: "2025" },
};

// Descrições para cada tipo de figurinha
const stickerTypeInfo = {
  'common': { name: 'Comum', description: 'Figurinha padrão 7x5cm' },
  'legend': { name: 'Lenda', description: 'Figurinha especial metalizada' },
  'quadro': { name: 'Quadro', description: 'Quadro emoldurado 15x20cm' },
  'a4': { name: 'Folha A4', description: 'Impressão em folha A4' }
};

const StickersPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStickers, setSelectedStickers] = useState<Sticker[]>([]);
  const [filter, setFilter] = useState<'common' | 'legend' | 'quadro' | 'a4' | ''>('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Estado para controlar o feedback de sucesso
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (albumId) {
      // Simulando chamada API para obter figurinhas do álbum
      setTimeout(() => {
        const id = parseInt(albumId);
        setStickers(stickersMock[id] || []);
        setAlbum(albumsMock[id] || null);
        setLoading(false);
      }, 500);
    }
  }, [albumId]);

  const toggleSticker = (sticker: Sticker) => {
    if (selectedStickers.some(s => s.id === sticker.id)) {
      setSelectedStickers(selectedStickers.filter(s => s.id !== sticker.id));
    } else {
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  const handleAddToCart = () => {
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
                onClick={() => setFilter(type as 'common' | 'legend' | 'quadro' | 'a4')}
              >
                {stickerTypeInfo[type].name}
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
                    <div className={`h-20 bg-gray-200 flex items-center justify-center ${sticker.type === 'a4' ? 'bg-blue-50' : sticker.type === 'quadro' ? 'bg-amber-50' : sticker.type === 'legend' ? 'bg-purple-50' : 'bg-gray-100'}`}>
                      <div className={`${sticker.type === 'a4' ? 'w-14 h-18' : sticker.type === 'quadro' ? 'w-16 h-16 border-2 border-amber-200' : sticker.type === 'legend' ? 'w-14 h-18 bg-gradient-to-r from-purple-100 to-pink-100' : 'w-14 h-18'} bg-white border border-gray-300 flex items-center justify-center rounded`}>
                        <p className="text-sm font-medium text-gray-700">{sticker.id}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium">{typeInfo.name}</p>
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