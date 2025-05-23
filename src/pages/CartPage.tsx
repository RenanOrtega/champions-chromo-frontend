import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, X, Minus, Plus } from 'lucide-react';

export const stickerTypeInfo = {
  'common': { name: 'Comum', price: 1 },
  'legend': { name: 'Legend', price: 5 },
  'a4': { name: 'A4', price: 15 }
};

const CartPage = () => {
  const navigate = useNavigate();
  const {
    itens,
    removeFromCart,
    calcTotal,
    increaseQuantity,
    decreaseQuantity,
    removeSticker
  } = useCart();

  if (itens.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 text-center mb-6">Adicione álbuns e figurinhas para continuar</p>
        <button
          onClick={() => navigate('/schools')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 cursor-pointer"
        >
          Explorar escolas
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Carrinho</h1>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          {itens.map((item) => (
            <div key={item.album.id} className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{item.album.name}</h3>
                </div>
                <button
                  onClick={() => removeFromCart(item.album.id)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-5 w-5 cursor-pointer" />
                </button>
              </div>

              {item.stickers.length > 0 && (
                <>
                  <h4 className="font-medium text-sm mb-2">
                    Figurinhas selecionadas ({item.stickers.reduce((sum, s) => sum + s.quantity, 0)})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {item.stickers.map((sticker) => (
                      <div key={sticker.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-700">#{sticker.number}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{sticker.name || `Figurinha ${sticker.number}`}</span>
                            <span className={`text-xs px-2 py-1 rounded text-white w-fit mt-1 ${
                              sticker.type === 'common' ? 'bg-gray-500' :
                              sticker.type === 'legend' ? 'bg-purple-500' : 'bg-blue-500'
                            }`}>
                              {stickerTypeInfo[sticker.type].name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4 bg-white rounded-lg border border-gray-200">
                            <button
                              onClick={() => decreaseQuantity(item.album.id, sticker.id)}
                              className="p-2 rounded-l-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={sticker.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-2 text-sm font-medium border-x border-gray-200 min-w-[40px] text-center">
                              {sticker.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.album.id, sticker.id)}
                              className="p-2 rounded-r-lg hover:bg-gray-100 cursor-pointer"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-col items-end mr-3">
                            <span className="text-sm font-medium">
                              R$ {(sticker.price * sticker.quantity).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              R$ {sticker.price.toFixed(2)} cada
                            </span>
                          </div>
                          <button
                            onClick={() => removeSticker(item.album.id, sticker.id)}
                            className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h3 className="font-semibold mb-4">Resumo do pedido</h3>

            {itens.map((item) => (
              <div key={item.album.id} className="mb-4">
                <p className="font-medium text-sm mb-2">{item.album.name}</p>
                {/* Figurinhas */}
                {item.stickers.map(sticker => (
                  <div key={sticker.id} className="flex justify-between text-xs text-gray-600 mt-1">
                    <p>
                      #{sticker.number} ({stickerTypeInfo[sticker.type].name}) x{sticker.quantity}
                    </p>
                    <p>R$ {(sticker.price * sticker.quantity).toFixed(2)}</p>
                  </div>
                ))}

                {/* Total do item */}
                <div className="flex justify-between text-xs font-medium text-gray-800 mt-2 pt-2 border-t border-gray-100">
                  <p>Subtotal do álbum:</p>
                  <p>R$ {(item.stickers.reduce((sum, s) => sum + (s.price * s.quantity), 0)).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>R$ {calcTotal().toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="hidden md:block w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 mt-4 cursor-pointer"
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 md:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600">Total</p>
            <p className="font-semibold">R$ {calcTotal().toFixed(2)}</p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="flex items-center space-x-2 cursor-pointer bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Finalizar compra</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;