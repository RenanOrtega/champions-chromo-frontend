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

  // Helper function to create a unique key for grouping stickers
  const getStickerGroupKey = (sticker: Sticker) => {
    return `${sticker.number}-${sticker.type}`;
  };

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

        // Create a map to group stickers by number and type
        const stickerMap = new Map<string, CartSticker>();

        // First, add existing stickers to the map
        existingItem.stickers.forEach(sticker => {
          const key = getStickerGroupKey(sticker);
          stickerMap.set(key, { ...sticker });
        });

        // Then, add or update with new stickers
        stickers.forEach(sticker => {
          const key = getStickerGroupKey(sticker);
          if (stickerMap.has(key)) {
            // Sticker group exists, increase quantity
            const existingSticker = stickerMap.get(key)!;
            stickerMap.set(key, {
              ...existingSticker,
              quantity: existingSticker.quantity + 1
            });
          } else {
            // New sticker group, add with quantity 1
            stickerMap.set(key, { 
              ...sticker, 
              quantity: 1,
              // Create a unique ID based on number and type for grouping
              id: `${sticker.albumId}-${sticker.number}-${sticker.type}`
            });
          }
        });

        // Convert map back to array
        const updatedStickers = Array.from(stickerMap.values());

        // Update the item with the new stickers array
        updatedItens[existingItemIndex] = {
          ...existingItem,
          stickers: updatedStickers
        };

        return updatedItens;
      } else {
        // Album doesn't exist, create new item and group stickers
        const stickerMap = new Map<string, CartSticker>();

        stickers.forEach(sticker => {
          const key = getStickerGroupKey(sticker);
          if (stickerMap.has(key)) {
            // Increase quantity for existing group
            const existingSticker = stickerMap.get(key)!;
            stickerMap.set(key, {
              ...existingSticker,
              quantity: existingSticker.quantity + 1
            });
          } else {
            // Create new group
            stickerMap.set(key, { 
              ...sticker, 
              quantity: 1,
              // Create a unique ID based on number and type for grouping
              id: `${sticker.albumId}-${sticker.number}-${sticker.type}`
            });
          }
        });

        const groupedStickers = Array.from(stickerMap.values());

        return [
          ...updatedItens,
          {
            album,
            stickers: groupedStickers
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