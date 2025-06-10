import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  X,
  Minus,
  Plus} from 'lucide-react';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '@/context/CartContext';
import { stickerTypeInfo } from '@/types/album';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    itens,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    removeSticker,
    calculateOrderTotals
  } = useCart();

  const shippingCost = 0;
  calculateOrderTotals(shippingCost);

  const handleFinishOrder = () => {
    // Validação antes de ir para o checkout
    const totals = calculateOrderTotals(shippingCost);
    
    if (totals.finalTotal < 0.50) {
      alert('Valor mínimo para checkout é R$ 0,50');
      return;
    }
    
    navigate("/order");
  };

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
    <div>
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
                            <span className={`text-xs px-2 py-1 rounded text-white w-fit mt-1 ${sticker.type === 'common' ? 'bg-gray-500' :
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
          <OrderSummary
            shippingCost={shippingCost}
            showCouponInput={true}
            showFinishButton={true}
            onFinishOrder={handleFinishOrder}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;