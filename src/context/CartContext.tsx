import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Album, Sticker } from '../types/album';

// Update CartSticker to store stickers with quantities
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
  removeFromCart: (albumId: string) => void;
  cleanCart: () => void;
  increaseQuantity: (albumId: string, stickerId: string) => void;
  decreaseQuantity: (albumId: string, stickerId: string) => void;
  removeSticker: (albumId: string, stickerId: string) => void;
  calcTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load items from localStorage when component mounts
  const [itens, setItens] = useState<CartItem[]>(() => {
    try {
      const savedData = localStorage.getItem('cartItems');

      if (!savedData) return [];

      const { items, updatedAt } = JSON.parse(savedData);
      const expirationHours = 73;
      const now = new Date().getTime();
      const lastUpdate = new Date(updatedAt).getTime();

      const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);
      if (hoursPassed > expirationHours) {
        localStorage.removeItem('cartItems');
        return [];
      }

      return items ?? [];
    } catch (error) {
      console.error('Error parsing cart items from localStorage:', error);
      return [];
    }
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      const dataToSave = {
        items: itens,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('cartItems', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
    }
  }, [itens]);

  const addToCart = (album: Album, stickers: Sticker[]) => {
    console.log('Adding stickers to cart:', stickers.map(s => s.id));

    setItens(prevItens => {
      // Create a copy of the current items
      const updatedItens = [...prevItens];

      // Check if album already exists in cart
      const existingItemIndex = updatedItens.findIndex(item => item.album.id === album.id);

      if (existingItemIndex >= 0) {
        // Album exists, get the existing item
        const existingItem = updatedItens[existingItemIndex];

        // Create a new array for the updated stickers to avoid direct mutation
        const updatedStickers = [...existingItem.stickers];

        // Process each sticker to add
        stickers.forEach(sticker => {
          // Check if sticker already exists by ID
          const existingStickerIndex = updatedStickers.findIndex(s => s.id === sticker.id);
          console.log('Sticker exists?', existingStickerIndex >= 0, sticker.id);

          if (existingStickerIndex >= 0) {
            // Sticker exists, increase quantity
            updatedStickers[existingStickerIndex] = {
              ...updatedStickers[existingStickerIndex],
              quantity: updatedStickers[existingStickerIndex].quantity + 1
            };
          } else {
            // Sticker doesn't exist, add it with quantity 1
            updatedStickers.push({ ...sticker, quantity: 1 });
          }
        });

        // Update the item with the new stickers array
        updatedItens[existingItemIndex] = {
          ...existingItem,
          stickers: updatedStickers
        };

        return updatedItens;
      } else {
        // Album doesn't exist, add new item with all stickers
        return [
          ...updatedItens,
          {
            album,
            stickers: stickers.map(sticker => ({ ...sticker, quantity: 1 }))
          }
        ];
      }
    });
  };

  const increaseQuantity = (albumId: string, stickerId: string) => {
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

  const decreaseQuantity = (albumId: string, stickerId: string) => {
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

  const removeSticker = (albumId: string, stickerId: string) => {
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

  const removeFromCart = (albumId: string) => {
    setItens(itens.filter(item => item.album.id !== albumId));
  };

  const cleanCart = () => {
    setItens([]);
  };

  const calcTotal = () => {
    const totalInDecimal = itens.reduce((total, item) => {
      const stickersPrice = item.stickers.reduce((sum, sticker) =>
        sum + (sticker.price * sticker.quantity), 0);
      return total + stickersPrice;
    }, 0);

    return totalInDecimal;
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