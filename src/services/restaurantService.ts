import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_CATEGORIES, INITIAL_RESTAURANTS, INITIAL_MENU_ITEMS } from '../lib/mockData';
import { Restaurant, Category, MenuItem } from '../types';

export interface FilterOptions {
  search?: string;
  category?: string;
  isVegOnly?: boolean;
  minRating?: number;
  maxDeliveryTime?: number;
  sortBy?: 'rating' | 'fastest' | 'price';
}

export const restaurantService = {
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase categories fetch error, fallback to local data:', err);
      }
    }
    return INITIAL_CATEGORIES;
  },

  async getRestaurants(filters?: FilterOptions): Promise<Restaurant[]> {
    let restaurants: Restaurant[] = [];

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('restaurants').select('*');
        if (filters?.minRating) {
          query = query.gte('rating', filters.minRating);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          restaurants = data;
        } else {
          restaurants = [...INITIAL_RESTAURANTS];
        }
      } catch (err) {
        console.warn('Supabase restaurants fetch error, fallback to local data:', err);
        restaurants = [...INITIAL_RESTAURANTS];
      }
    } else {
      restaurants = [...INITIAL_RESTAURANTS];
    }

    // Apply Client / In-memory Filters
    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        restaurants = restaurants.filter(
          r => r.name.toLowerCase().includes(query) ||
               r.cuisine.toLowerCase().includes(query) ||
               r.description.toLowerCase().includes(query)
        );
      }

      if (filters.minRating) {
        restaurants = restaurants.filter(r => r.rating >= (filters.minRating || 0));
      }

      if (filters.maxDeliveryTime) {
        restaurants = restaurants.filter(r => {
          const match = r.delivery_time.match(/(\d+)/);
          const time = match ? parseInt(match[1], 10) : 30;
          return time <= (filters.maxDeliveryTime || 60);
        });
      }

      if (filters.sortBy === 'rating') {
        restaurants.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'fastest') {
        restaurants.sort((a, b) => {
          const aTime = parseInt(a.delivery_time.match(/(\d+)/)?.[1] || '30', 10);
          const bTime = parseInt(b.delivery_time.match(/(\d+)/)?.[1] || '30', 10);
          return aTime - bTime;
        });
      }
    }

    return restaurants;
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase single restaurant error:', err);
      }
    }
    return INITIAL_RESTAURANTS.find(r => r.id === id) || null;
  },

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase menu items fetch error:', err);
      }
    }
    return INITIAL_MENU_ITEMS.filter(item => item.restaurant_id === restaurantId);
  },

  async getPopularDishes(): Promise<(MenuItem & { restaurant_name: string })[]> {
    let items = INITIAL_MENU_ITEMS.slice(0, 8);
    return items.map(item => {
      const rest = INITIAL_RESTAURANTS.find(r => r.id === item.restaurant_id);
      return {
        ...item,
        restaurant_name: rest ? rest.name : 'Zestora Kitchen',
      };
    });
  },

  async searchFoodAndRestaurants(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { restaurants: [], dishes: [] };
    }

    const allRestaurants = await this.getRestaurants();
    const matchingRestaurants = allRestaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );

    const allDishes = INITIAL_MENU_ITEMS;
    const matchingDishes = allDishes
      .filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      )
      .map(item => {
        const rest = allRestaurants.find(r => r.id === item.restaurant_id);
        return {
          ...item,
          restaurant: rest,
        };
      });

    return {
      restaurants: matchingRestaurants,
      dishes: matchingDishes,
    };
  }
};
