import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { MenuItem, Restaurant } from '../../types';

const mockRestaurant1: Restaurant = {
  id: 'rest-1',
  name: 'Burger Haven',
  description: 'Juicy burgers',
  image_url: 'https://images.unsplash.com/burger',
  cuisine: 'American',
  rating: 4.8,
  delivery_time: '25-30 min',
  delivery_fee: 40,
  is_open: true,
  address: '123 Food Street',
};

const mockRestaurant2: Restaurant = {
  id: 'rest-2',
  name: 'Pizza Palace',
  description: 'Woodfired pizzas',
  image_url: 'https://images.unsplash.com/pizza',
  cuisine: 'Italian',
  rating: 4.6,
  delivery_time: '30-40 min',
  delivery_fee: 50,
  is_open: true,
  address: '456 Olive Road',
};

const mockItem1: MenuItem = {
  id: 'item-1',
  restaurant_id: 'rest-1',
  name: 'Classic Cheeseburger',
  description: 'Cheddar cheese, beef patty',
  price: 200,
  image_url: 'https://images.unsplash.com/burger1',
  is_available: true,
  is_vegetarian: false,
};

const mockItem2: MenuItem = {
  id: 'item-2',
  restaurant_id: 'rest-1',
  name: 'French Fries',
  description: 'Crispy salted fries',
  price: 100,
  image_url: 'https://images.unsplash.com/fries',
  is_available: true,
  is_vegetarian: true,
};

const mockItemOtherRest: MenuItem = {
  id: 'item-3',
  restaurant_id: 'rest-2',
  name: 'Margherita Pizza',
  description: 'Tomato & mozzarella',
  price: 350,
  image_url: 'https://images.unsplash.com/pizza1',
  is_available: true,
  is_vegetarian: true,
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('throws an error when useCart is used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );
  });

  it('initializes with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.restaurant).toBeNull();
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.deliveryFee).toBe(0);
    expect(result.current.tax).toBe(0);
    expect(result.current.total).toBe(0);
    expect(result.current.conflictModalOpen).toBe(false);
  });

  it('adds an item and sets active restaurant', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].menu_item_id).toBe('item-1');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.restaurant?.id).toBe('rest-1');
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(200);
    expect(result.current.deliveryFee).toBe(40);
    // tax is 5% of 200 = 10
    expect(result.current.tax).toBe(10);
    // total = 200 + 40 + 10 = 250
    expect(result.current.total).toBe(250);
  });

  it('increments quantity when adding the same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(400);
  });

  it('detects restaurant conflict and opens conflict modal without adding conflicting item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    // Try adding item from a different restaurant in separate act
    act(() => {
      result.current.addItem(mockItemOtherRest, mockRestaurant2);
    });

    expect(result.current.conflictModalOpen).toBe(true);
    expect(result.current.conflictRestaurantName).toBe('Pizza Palace');
    // Cart should still contain only item-1
    expect(result.current.items.length).toBe(1);
    expect(result.current.restaurant?.id).toBe('rest-1');
  });

  it('cancels conflict cleanly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    act(() => {
      result.current.addItem(mockItemOtherRest, mockRestaurant2);
    });

    expect(result.current.conflictModalOpen).toBe(true);

    act(() => {
      result.current.cancelConflict();
    });

    expect(result.current.conflictModalOpen).toBe(false);
    expect(result.current.restaurant?.id).toBe('rest-1');
  });

  it('clears cart and adds new restaurant item on conflict confirmation', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    act(() => {
      result.current.addItem(mockItemOtherRest, mockRestaurant2);
    });

    act(() => {
      result.current.confirmClearAndAdd();
    });

    expect(result.current.conflictModalOpen).toBe(false);
    expect(result.current.restaurant?.id).toBe('rest-2');
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].menu_item_id).toBe('item-3');
    expect(result.current.subtotal).toBe(350);
  });

  it('updates quantity and removes item when quantity reaches zero', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    act(() => {
      result.current.updateQuantity('item-1', 1);
    });
    expect(result.current.getItemQuantity('item-1')).toBe(2);

    act(() => {
      result.current.updateQuantity('item-1', -1);
    });
    expect(result.current.getItemQuantity('item-1')).toBe(1);

    act(() => {
      result.current.updateQuantity('item-1', -1);
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('removes item using removeItem', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    act(() => {
      result.current.addItem(mockItem2, mockRestaurant1);
    });

    expect(result.current.items.length).toBe(2);

    act(() => {
      result.current.removeItem('item-1');
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].menu_item_id).toBe('item-2');
  });

  it('clears entire cart and resets restaurant and localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem1, mockRestaurant1);
    });

    expect(result.current.items.length).toBe(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.restaurant).toBeNull();
    expect(result.current.total).toBe(0);
    const saved = localStorage.getItem('zestora_active_cart');
    expect(saved === null || saved === '[]').toBe(true);
    expect(localStorage.getItem('zestora_active_restaurant')).toBeNull();
  });
});
