// ==============================================================================
// ZESTORA FOOD DELIVERY - TYPESCRIPT TYPE DEFINITIONS
// ==============================================================================

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cuisine: string;
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  is_open: boolean;
  address: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_vegetarian: boolean;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: 'Home' | 'Work' | 'Other' | string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at?: string;
}

export interface CartItem {
  id: string;
  cart_id?: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  item: MenuItem;
}

export interface Cart {
  id: string;
  user_id: string;
  restaurant_id: string | null;
  restaurant?: Restaurant | null;
  items: CartItem[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant?: Restaurant;
  address_id?: string;
  address?: Address;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  delivery_notes?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface UserLocation {
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
}
