import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, MenuItem } from '../types';
import { RestaurantHeader } from '../components/restaurant/RestaurantHeader';
import { MenuItemCard } from '../components/restaurant/MenuItemCard';
import { MenuItemSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, ArrowRight, UtensilsCrossed, ChevronLeft } from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuSearch, setMenuSearch] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const { items, itemCount, subtotal, restaurantId } = useCart();
  const isCartFromThisRestaurant = restaurantId === id;

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [rest, items] = await Promise.all([
          restaurantService.getRestaurantById(id),
          restaurantService.getMenuItems(id),
        ]);
        setRestaurant(rest);
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={UtensilsCrossed}
          title="Restaurant not found"
          description="We couldn't locate this restaurant in our directory."
          actionText="Back to Restaurants"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  // Filter menu items by search and veg toggle
  const filteredMenuItems = menuItems.filter((item) => {
    if (isVegOnly && !item.is_vegetarian) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to all restaurants</span>
      </Link>

      {/* Restaurant Header */}
      <RestaurantHeader
        restaurant={restaurant}
        menuSearch={menuSearch}
        onMenuSearchChange={setMenuSearch}
        isVegOnly={isVegOnly}
        onVegOnlyToggle={() => setIsVegOnly(!isVegOnly)}
      />

      {/* Menu Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Recommended Menu ({filteredMenuItems.length})
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Prepared fresh to order by executive chefs
          </p>
        </div>
      </div>

      {/* Menu Items Grid / List */}
      {filteredMenuItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-700">No dishes match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try turning off pure-veg filter or search with different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pb-24">
          {filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
          ))}
        </div>
      )}

      {/* Sticky Floating Mini-Cart Bar (Shown when user has items in cart) */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 max-w-xl mx-auto z-40 animate-slide-up">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-float flex items-center justify-between border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-sm font-black text-white">
                  Subtotal: {formatCurrency(subtotal)}
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
