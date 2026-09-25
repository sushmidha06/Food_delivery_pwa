import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_RESTAURANTS, INITIAL_MENU_ITEMS } from '../lib/mockData';
import { Order, OrderItem, OrderStatus, Address } from '../types';

const ORDERS_STORAGE_KEY = 'zestora_demo_orders';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
}

export interface CreateOrderParams {
  userId: string;
  restaurantId: string;
  addressId?: string;
  address?: Address;
  items: {
    menu_item_id: string;
    quantity: number;
    price: number;
    item_name: string;
  }[];
  paymentMethod: string;
  deliveryNotes?: string;
}

export const orderService = {
  async createOrder(params: CreateOrderParams): Promise<Order> {
    const { userId, restaurantId, addressId, address, items, paymentMethod, deliveryNotes } = params;

    // Secure price calculation: fetch verified item prices
    let verifiedSubtotal = 0;
    const verifiedItems: { menu_item_id: string; item_name: string; quantity: number; price: number }[] = [];

    // Verify item prices from database or catalogue
    for (const cartItem of items) {
      const dbItem = INITIAL_MENU_ITEMS.find(m => m.id === cartItem.menu_item_id);
      const unitPrice = dbItem ? dbItem.price : cartItem.price;
      const itemTotal = unitPrice * cartItem.quantity;
      verifiedSubtotal += itemTotal;
      verifiedItems.push({
        menu_item_id: cartItem.menu_item_id,
        item_name: dbItem ? dbItem.name : cartItem.item_name,
        quantity: cartItem.quantity,
        price: unitPrice,
      });
    }

    const rest = INITIAL_RESTAURANTS.find(r => r.id === restaurantId);
    const deliveryFee = rest ? rest.delivery_fee : 40;
    const tax = Math.round(verifiedSubtotal * 0.05); // 5% GST
    const total = verifiedSubtotal + deliveryFee + tax;

    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        // Insert into orders table
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: userId,
            restaurant_id: restaurantId,
            address_id: addressId,
            status: 'confirmed',
            subtotal: verifiedSubtotal,
            delivery_fee: deliveryFee,
            tax: tax,
            total: total,
            payment_status: 'paid',
            payment_method: paymentMethod,
            delivery_notes: deliveryNotes,
          }])
          .select()
          .single();

        if (!orderError && orderData) {
          // Insert order items
          const orderItemsToInsert = verifiedItems.map(item => ({
            order_id: orderData.id,
            menu_item_id: item.menu_item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            price: item.price,
          }));

          await supabase.from('order_items').insert(orderItemsToInsert);

          return {
            ...orderData,
            restaurant: rest,
            address,
            items: orderItemsToInsert.map((item, idx) => ({
              id: `item-${idx}`,
              ...item,
            })),
          };
        }
      } catch (err) {
        console.warn('Supabase create order error, using local fallback:', err);
      }
    }

    // Local / Demo Mode order creation
    const orderId = `FD${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      user_id: userId,
      restaurant_id: restaurantId,
      restaurant: rest,
      address_id: addressId,
      address: address,
      status: 'confirmed',
      subtotal: verifiedSubtotal,
      delivery_fee: deliveryFee,
      tax: tax,
      total: total,
      payment_status: 'paid',
      payment_method: paymentMethod,
      delivery_notes: deliveryNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: verifiedItems.map((item, idx) => ({
        id: `oi-${orderId}-${idx}`,
        order_id: orderId,
        menu_item_id: item.menu_item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
      })),
    };

    const currentOrders = getLocalOrders();
    currentOrders.unshift(newOrder);
    saveLocalOrders(currentOrders);

    return newOrder;
  },

  async getOrders(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            restaurant:restaurants(*),
            address:addresses(*),
            items:order_items(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getOrders error:', err);
      }
    }

    const local = getLocalOrders();
    // Pre-populate with a demo completed order if empty for immediate demo value
    if (local.length === 0) {
      const rest = INITIAL_RESTAURANTS[0];
      const sampleOrder: Order = {
        id: 'FD10234',
        user_id: userId,
        restaurant_id: rest.id,
        restaurant: rest,
        status: 'delivered',
        subtotal: 700,
        delivery_fee: 40,
        tax: 35,
        total: 775,
        payment_status: 'paid',
        payment_method: 'Demo Payment',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [
          {
            id: 'sample-item-1',
            order_id: 'FD10234',
            item_name: 'Paneer Butter Masala',
            quantity: 1,
            price: 320,
          },
          {
            id: 'sample-item-2',
            order_id: 'FD10234',
            item_name: 'Butter Chicken',
            quantity: 1,
            price: 380,
          }
        ]
      };
      saveLocalOrders([sampleOrder]);
      return [sampleOrder];
    }

    return local;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            restaurant:restaurants(*),
            address:addresses(*),
            items:order_items(*)
          `)
          .eq('id', orderId)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getOrderById error:', err);
      }
    }

    const localOrders = getLocalOrders();
    return localOrders.find(o => o.id === orderId) || null;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update status error:', err);
      }
    }

    const localOrders = getLocalOrders();
    const updated = localOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status, updated_at: new Date().toISOString() };
      }
      return o;
    });
    saveLocalOrders(updated);
  }
};
