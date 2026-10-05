import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus
} from 'lucide-react';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Page from '@/components/Page';
import StateMessage from '@/components/StateMessage';
import TypeBadge from '@/components/TypeBadge';
import { formatPrice, plural } from '@/lib/format';

const CartPage = () => {
  const navigate = useNavigate();
  const [finishError, setFinishError] = useState<string | null>(null);
  const {
    itens,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    removeSticker,
    calculateOrderTotals
  } = useCart();

  const shippingCost = 0;

  const handleFinishOrder = () => {
    // Validação antes de ir para o checkout
    const totals = calculateOrderTotals(shippingCost);

    if (totals.finalTotal < 0.50) {
      setFinishError('O valor mínimo do pedido é R$ 0,50.');
      return;
    }

    navigate("/order");
  };

  if (itens.length === 0) {
    return (
      <Page>
        <StateMessage
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Escolha a escola e o álbum para marcar as figurinhas que faltam."
        >
          <Button asChild size="lg">
            <Link to="/schools">Escolher escola</Link>
          </Button>
        </StateMessage>
      </Page>
    );
  }

  return (
    <Page showBack title="Carrinho">
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {itens.map((item) => (
            <section key={item.album.id} className="rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-900">{item.album.name}</h2>
                  <p className="text-sm text-slate-600">
                    {plural(item.stickers.reduce((sum, s) => sum + s.quantity, 0), 'figurinha', 'figurinhas')}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.album.id)}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                  Remover<span className="hidden sm:inline"> álbum</span>
                </button>
              </div>

              <ul className="divide-y divide-slate-200 px-4 sm:px-5">
                {item.stickers.map((sticker) => (
                  <li key={sticker.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                    <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded border-2 border-primary-600 bg-primary-50 text-sm font-semibold text-primary-800 tabular-nums">
                      {sticker.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{sticker.name || `Figurinha ${sticker.number}`}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <TypeBadge type={sticker.type} />
                        <span className="text-xs text-slate-600 tabular-nums">{formatPrice(sticker.price)} cada</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSticker(item.album.id, sticker.id)}
                      aria-label={`Remover figurinha ${sticker.number}`}
                      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-700 sm:order-last"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex w-full items-center justify-between gap-4 pl-12 sm:w-auto sm:pl-0">
                      <div className="flex items-center rounded-md border border-slate-300">
                        <button
                          onClick={() => decreaseQuantity(item.album.id, sticker.id)}
                          aria-label="Diminuir quantidade"
                          className="flex size-9 cursor-pointer items-center justify-center rounded-l-md text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={sticker.quantity <= 1}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-9 border-x border-slate-300 px-2 text-center text-sm font-semibold leading-9 tabular-nums">
                          {sticker.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.album.id, sticker.id)}
                          aria-label="Aumentar quantidade"
                          className="flex size-9 cursor-pointer items-center justify-center rounded-r-md text-slate-700 hover:bg-slate-100"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <span className="w-20 text-right text-sm font-semibold text-slate-900 tabular-nums">
                        {formatPrice(sticker.price * sticker.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <OrderSummary
          shippingCost={shippingCost}
          showCouponInput={true}
          showFinishButton={true}
          onFinishOrder={handleFinishOrder}
          finishError={finishError}
          className="lg:sticky lg:top-24"
        />
      </div>
    </Page>
  );
}

export default CartPage;
