import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Check, X, Plus, Minus, WifiOff, Album as AlbumIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchAlbumById } from '../clients/album';
import { Album, Sticker, StickerType, albumHasType, stickerTypeInfo, stickerTypes } from '../types/album';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Page from '@/components/Page';
import StateMessage from '@/components/StateMessage';
import { formatPrice, plural } from '@/lib/format';

const defaultStickerPrices = {
  'common': 1,
  'legend': 5,
  'a4': 15
};

const emptyQuantities = { common: 0, legend: 0, a4: 0 };

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

const gridClass = "grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12";

const StickersPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [stickers, setStickers] = useState<ModalSticker[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStickers, setSelectedStickers] = useState<StickerSelection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [currentSticker, setCurrentSticker] = useState<ModalSticker | null>(null);
  const [modalQuantities, setModalQuantities] = useState(emptyQuantities);
  const { addToCart } = useCart();

  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<number | undefined>(undefined);

  // Função para obter preços do álbum ou usar valores padrão
  const getStickerPrices = () => {
    if (!album) return defaultStickerPrices;

    return {
      common: album.commonPrice == 0 ? defaultStickerPrices.common : album.commonPrice,
      legend: album.legendPrice == 0 ? defaultStickerPrices.legend : album.legendPrice,
      a4: album.a4Price == 0 ? defaultStickerPrices.a4 : album.a4Price
    };
  };

  const prices = getStickerPrices();
  const availableTypes = album ? stickerTypes.filter(type => albumHasType(album, type)) : [];

  useEffect(() => {
    const getAlbumAndStickers = async () => {
      if (!albumId) return;

      try {
        setLoading(true);
        setError(null);

        const album = await fetchAlbumById(albumId);
        setAlbum(album);

        // Gerar figurinhas baseado no totalStickers
        const generatedStickers = generateStickers(album);
        setStickers(generatedStickers);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar álbum ou figurinhas:', err);
        setError('Não foi possível carregar as figurinhas.');
        setLoading(false);
      }
    };

    getAlbumAndStickers();
  }, [albumId, attempt]);

  useEffect(() => () => window.clearTimeout(successTimer.current), []);

  // Com o painel aberto: Esc fecha e a página de trás não rola.
  useEffect(() => {
    if (!currentSticker) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrentSticker(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentSticker]);

  const findSelection = (stickerId: string) => selectedStickers.find(s => s.stickerId === stickerId);

  const handleStickerClick = (sticker: ModalSticker) => {
    const existing = findSelection(sticker.id);
    setCurrentSticker(sticker);
    // Reabrir uma figurinha já escolhida mostra as quantidades atuais.
    setModalQuantities(existing
      ? { common: existing.common, legend: existing.legend, a4: existing.a4 }
      : emptyQuantities);
  };

  const updateQuantity = (type: StickerType, increment: boolean) => {
    setModalQuantities(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const modalTotalQuantity = availableTypes.reduce((sum, type) => sum + modalQuantities[type], 0);
  const modalTotalPrice = availableTypes.reduce((sum, type) => sum + modalQuantities[type] * prices[type], 0);

  const handleAddToSelection = () => {
    if (!currentSticker) return;

    const existingIndex = selectedStickers.findIndex(s => s.stickerId === currentSticker.id);

    if (modalTotalQuantity === 0) {
      if (existingIndex < 0) return;
      removeFromSelection(currentSticker.id);
    } else if (existingIndex >= 0) {
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

    setCurrentSticker(null);
  };

  const removeFromSelection = (stickerId: string) => {
    setSelectedStickers(prev => prev.filter(s => s.stickerId !== stickerId));
  };

  const handleAddToCart = () => {
    if (!album || selectedStickers.length === 0) return;

    // Converter seleções para formato de stickers para o carrinho
    const cartStickers: Sticker[] = [];

    selectedStickers.forEach(selection => {
      // Só entram os tipos que o álbum permite
      availableTypes.forEach(type => {
        for (let i = 0; i < selection[type]; i++) {
          cartStickers.push({
            id: `${selection.stickerId}-${type}-${i}`,
            albumId: album.id,
            number: selection.stickerNumber,
            name: selection.stickerName,
            type,
            price: prices[type]
          });
        }
      });
    });

    addToCart(album, cartStickers);
    setSelectedStickers([]);
    setShowSuccess(true);
    window.clearTimeout(successTimer.current);
    successTimer.current = window.setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const getTotalPrice = () => {
    return selectedStickers.reduce((total, selection) => {
      return total + availableTypes.reduce((sum, type) => sum + selection[type] * prices[type], 0);
    }, 0);
  };

  const getTotalItems = () => {
    return selectedStickers.reduce((total, selection) => {
      return total + availableTypes.reduce((sum, type) => sum + selection[type], 0);
    }, 0);
  };

  const formatSelectedStickerText = (selection: StickerSelection) => {
    return availableTypes
      .filter(type => selection[type] > 0)
      .map(type => `${selection[type]} ${stickerTypeInfo[type].name}`)
      .join(', ');
  };

  const currentIsSelected = currentSticker ? !!findSelection(currentSticker.id) : false;

  return (
    <Page
      showBack
      title={album ? album.name : loading ? 'Carregando álbum' : 'Figurinhas'}
      subtitle={album ? `${album.totalStickers} figurinhas. Toque no número para escolher o tipo e a quantidade.` : undefined}
      className={selectedStickers.length > 0 ? 'pb-28' : undefined}
    >
      {loading ? (
        <div className="space-y-5" aria-busy="true" aria-label="Carregando figurinhas">
          <Skeleton className="h-12 w-full max-w-md" />
          <div className={gridClass}>
            {Array.from({ length: 36 }, (_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        </div>
      ) : error ? (
        <StateMessage icon={WifiOff} tone="error" title={error} description="Confira sua conexão e tente de novo.">
          <Button onClick={() => setAttempt(a => a + 1)}>Tentar de novo</Button>
          <Button variant="outline" asChild>
            <Link to="/schools">Ver escolas</Link>
          </Button>
        </StateMessage>
      ) : stickers.length === 0 ? (
        <StateMessage
          icon={AlbumIcon}
          title="Este álbum ainda não tem figurinhas"
          description="Volte em breve ou escolha outro álbum."
        >
          <Button variant="outline" asChild>
            <Link to="/schools">Ver escolas</Link>
          </Button>
        </StateMessage>
      ) : (
        <div className="space-y-5">
          {/* Preços - mostra apenas tipos disponíveis com preços dinâmicos */}
          <ul
            aria-label="Preço por tipo"
            className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            {availableTypes.map(type => (
              <li key={type} className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${stickerTypeInfo[type].dot}`} />
                <span className="text-slate-600">{stickerTypeInfo[type].name}</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(prices[type])}</span>
              </li>
            ))}
          </ul>

          {/* Lista de figurinhas selecionadas */}
          {selectedStickers.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-900">Selecionadas</h2>
              <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
                {selectedStickers.map((selection) => (
                  <li
                    key={selection.stickerId}
                    className="flex shrink-0 items-center rounded-md border border-slate-200 bg-white text-sm"
                  >
                    <span className="py-1.5 pl-3 pr-1">
                      <span className="font-semibold tabular-nums">Nº {selection.stickerNumber}</span>
                      <span className="text-slate-600"> · {formatSelectedStickerText(selection)}</span>
                    </span>
                    <button
                      onClick={() => removeFromSelection(selection.stickerId)}
                      aria-label={`Remover figurinha ${selection.stickerNumber} da seleção`}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Espaço vazio do álbum é tracejado; figurinha escolhida fica preenchida. */}
          <div className={gridClass}>
            {stickers.map((sticker) => {
              const selection = findSelection(sticker.id);

              return (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerClick(sticker)}
                  aria-pressed={!!selection}
                  aria-label={selection
                    ? `Figurinha ${sticker.number}, ${formatSelectedStickerText(selection)}`
                    : `Figurinha ${sticker.number}`}
                  className={`relative flex aspect-[3/4] cursor-pointer items-center justify-center rounded-md border-2 transition-colors ${selection
                    ? 'border-primary-600 bg-primary-50 text-primary-800'
                    : 'border-dashed border-slate-300 bg-white text-slate-700 hover:border-primary-500 hover:text-primary-700'
                    }`}
                >
                  <span className={`text-lg font-semibold tabular-nums ${selection ? '-translate-y-1.5' : ''}`}>
                    {sticker.number}
                  </span>
                  {selection && (
                    <span className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5">
                      {availableTypes.filter(type => selection[type] > 0).map(type => (
                        <span key={type} className="flex items-center gap-0.5 text-[11px] font-semibold leading-none text-slate-700 tabular-nums">
                          <span className={`size-1.5 rounded-full ${stickerTypeInfo[type].dot}`} />
                          {selection[type]}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback de sucesso */}
      {showSuccess && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-sm items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Check className="size-5 shrink-0 text-green-600" />
          <p className="grow text-sm font-medium text-slate-900">Figurinhas adicionadas ao carrinho</p>
          <Link to="/cart" className="shrink-0 text-sm font-semibold text-primary-700 underline underline-offset-2">
            Ver carrinho
          </Link>
        </div>
      )}

      {/* Painel de tipos - mostra apenas tipos disponíveis com preços dinâmicos */}
      {currentSticker && album && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 sm:items-center sm:p-4"
          onClick={() => setCurrentSticker(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sticker-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-xl bg-white p-5 pb-6 sm:max-w-sm sm:rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 id="sticker-dialog-title" className="text-lg font-semibold text-slate-900">
                Figurinha <span className="tabular-nums">{currentSticker.number}</span>
              </h3>
              <button
                onClick={() => setCurrentSticker(null)}
                aria-label="Fechar"
                className="-mr-2 flex size-9 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="divide-y divide-slate-200">
              {availableTypes.map(type => (
                <li key={type} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-2.5 rounded-full ${stickerTypeInfo[type].dot}`} />
                    <div>
                      <p className="font-medium text-slate-900">{stickerTypeInfo[type].name}</p>
                      <p className="text-sm text-slate-600 tabular-nums">{formatPrice(prices[type])} cada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(type, false)}
                      aria-label={`Diminuir ${stickerTypeInfo[type].name}`}
                      className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={modalQuantities[type] === 0}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-9 text-center text-base font-semibold tabular-nums" aria-live="polite">
                      {modalQuantities[type]}
                    </span>
                    <button
                      onClick={() => updateQuantity(type, true)}
                      aria-label={`Aumentar ${stickerTypeInfo[type].name}`}
                      className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-2 border-t border-slate-200 pt-4">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm text-slate-600">Total</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formatPrice(modalTotalPrice)}</span>
              </div>
              <Button
                onClick={handleAddToSelection}
                disabled={modalTotalQuantity === 0 && !currentIsSelected}
                variant={modalTotalQuantity === 0 && currentIsSelected ? 'outline' : 'default'}
                className="h-11 w-full text-base"
              >
                {modalTotalQuantity === 0 && currentIsSelected
                  ? 'Remover da seleção'
                  : currentIsSelected ? 'Atualizar seleção' : 'Adicionar à seleção'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedStickers.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div>
              <p className="text-sm text-slate-600">{plural(getTotalItems(), 'figurinha', 'figurinhas')}</p>
              <p className="text-lg font-bold leading-tight text-slate-900 tabular-nums">{formatPrice(getTotalPrice())}</p>
            </div>
            <Button onClick={handleAddToCart} className="h-11 px-5 text-base">
              <ShoppingCart className="size-5" />
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
};

export default StickersPage;
