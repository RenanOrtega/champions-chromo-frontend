import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Album, Sticker } from '../types';

// Update CartItem to store stickers with quantities
export interface CartSticker extends Sticker {
  quantity: number;
}

export interface CartItem {
  album: Album;
  stickers: CartSticker[];
}

interface CartContextType {
  itens: CartItem[];
  addToCart: (album: Album, stickers: Sticker[]) => void;
  removeFromCart: (albumId: number) => void;
  cleanCart: () => void;
  increaseQuantity: (albumId: number, stickerId: number) => void;
  decreaseQuantity: (albumId: number, stickerId: number) => void;
  removeSticker: (albumId: number, stickerId: number) => void;
  calcTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load items from localStorage when component mounts
  const [itens, setItens] = useState<CartItem[]>(() => {
    const savedItens = localStorage.getItem('cartItems');
    return savedItens ? JSON.parse(savedItens) : [];
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(itens));
  }, [itens]);

  const addToCart = (album: Album, stickers: Sticker[]) => {
    setItens(prevItens => {
      // Check if album already exists in cart
      const existingItemIndex = prevItens.findIndex(item => item.album.id === album.id);

      if (existingItemIndex >= 0) {
        // Album exists, update stickers
        const updatedItens = [...prevItens];
        const existingItem = updatedItens[existingItemIndex];

        // Process each sticker to add
        stickers.forEach(sticker => {
          // Check if sticker already exists
          const existingStickerIndex = existingItem.stickers.findIndex(s => s.id === sticker.id);

          if (existingStickerIndex >= 0) {
            // Sticker exists, increase quantity
            existingItem.stickers[existingStickerIndex].quantity += 1;
          } else {
            // Sticker doesn't exist, add it with quantity 1
            existingItem.stickers.push({ ...sticker, quantity: 1 });
          }
        });

        return updatedItens;
      } else {
        // Album doesn't exist, add new item
        return [
          ...prevItens,
          {
            album,
            stickers: stickers.map(sticker => ({ ...sticker, quantity: 1 }))
          }
        ];
      }
    });
  };

  const increaseQuantity = (albumId: number, stickerId: number) => {
    setItens(prevItens => {
      return prevItens.map(item => {
        if (item.album.id === albumId) {
          return {
            ...item,
            stickers: item.stickers.map(sticker => {
              if (sticker.id === stickerId) {
                return { ...sticker, quantity: sticker.quantity + 1 };
              }
              return sticker;
            })
          };
        }
        return item;
      });
    });
  };

  const decreaseQuantity = (albumId: number, stickerId: number) => {
    setItens(prevItens => {
      return prevItens.map(item => {
        if (item.album.id === albumId) {
          return {
            ...item,
            stickers: item.stickers.map(sticker => {
              if (sticker.id === stickerId && sticker.quantity > 1) {
                return { ...sticker, quantity: sticker.quantity - 1 };
              }
              return sticker;
            })
          };
        }
        return item;
      });
    });
  };

  const removeSticker = (albumId: number, stickerId: number) => {
    setItens(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.album.id === albumId) {
          return {
            ...item,
            stickers: item.stickers.filter(sticker => sticker.id !== stickerId),
          };
        }
        return item;
      }).filter(item => item.stickers.length > 0);

      return updatedItems;
    });
  };

  const removeFromCart = (albumId: number) => {
    setItens(itens.filter(item => item.album.id !== albumId));
  };

  const cleanCart = () => {
    setItens([]);
  };

  const calcTotal = () => {
    return itens.reduce((total, item) => {
      const stickersPrice = item.stickers.reduce((sum, sticker) =>
        sum + (sticker.price * sticker.quantity), 0);
      return total + stickersPrice;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        itens,
        addToCart,
        removeFromCart,
        cleanCart,
        increaseQuantity,
        decreaseQuantity,
        removeSticker,
        calcTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used inside of a CartProvider');
  }
  return context;
};