import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, MenuItem, Restaurant } from '../types';

interface PendingConflict {
  item: MenuItem;
  restaurant: Restaurant;
}

interface CartContextType {
  items: CartItem[];
  restaurant: Restaurant | null;
  restaurantId: string | null;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  conflictModalOpen: boolean;
  conflictRestaurantName: string;
  addItem: (item: MenuItem, restaurant: Restaurant) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
  confirmClearAndAdd: () => void;
  cancelConflict: () => void;
  getItemQuantity: (menuItemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zestora_active_cart';
const CART_REST_KEY = 'zestora_active_restaurant';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => {
    try {
      const saved = localStorage.getItem(CART_REST_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pendingConflict, setPendingConflict] = useState<PendingConflict | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (items.length === 0) {
        localStorage.removeItem(CART_REST_KEY);
        setRestaurant(null);
      } else if (restaurant) {
        localStorage.setItem(CART_REST_KEY, JSON.stringify(restaurant));
      }
    } catch (e) {
      console.error(e);
    }
  }, [items, restaurant]);

  const addItem = (item: MenuItem, rest: Restaurant) => {
    // If cart has items from another restaurant, show conflict prompt
    if (restaurant && restaurant.id !== rest.id && items.length > 0) {
      setPendingConflict({ item, restaurant: rest });
      return;
    }

    setRestaurant(rest);
    setItems(prev => {
      const existing = prev.find(i => i.menu_item_id === item.id);
      if (existing) {
        return prev.map(i =>
          i.menu_item_id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [
          ...prev,
          {
            id: `ci-${Date.now()}-${item.id}`,
            menu_item_id: item.id,
            quantity: 1,
            price: item.price,
            item: item,
          },
        ];
      }
    });
  };

  const confirmClearAndAdd = () => {
    if (!pendingConflict) return;
    const { item, restaurant: newRest } = pendingConflict;
    setRestaurant(newRest);
    setItems([
      {
        id: `ci-${Date.now()}-${item.id}`,
        menu_item_id: item.id,
        quantity: 1,
        price: item.price,
        item: item,
      },
    ]);
    setPendingConflict(null);
  };

  const cancelConflict = () => {
    setPendingConflict(null);
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems(prev => {
      return prev
        .map(i => {
          if (i.menu_item_id === menuItemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null);
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems(prev => prev.filter(i => i.menu_item_id !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_REST_KEY);
  };

  const getItemQuantity = (menuItemId: string): number => {
    const found = items.find(i => i.menu_item_id === menuItemId);
    return found ? found.quantity : 0;
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = items.length > 0 ? (restaurant?.delivery_fee ?? 40) : 0;
  const tax = items.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        restaurantId: restaurant ? restaurant.id : null,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        conflictModalOpen: Boolean(pendingConflict),
        conflictRestaurantName: pendingConflict?.restaurant.name || '',
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        confirmClearAndAdd,
        cancelConflict,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
