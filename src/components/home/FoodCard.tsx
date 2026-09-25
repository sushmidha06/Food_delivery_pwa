import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';
import { VegIndicator } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

interface FoodCardProps {
  item: MenuItem;
  restaurant?: Restaurant;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, restaurant }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const fallbackRestaurant: Restaurant = restaurant || {
    id: item.restaurant_id,
    name: 'Zestora Kitchen',
    description: '',
    image_url: item.image_url,
    cuisine: 'Multi-cuisine',
    rating: 4.5,
    delivery_time: '25-35 min',
    delivery_fee: 40,
    is_open: true,
    address: 'Indiranagar, Bangalore',
  };

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-3 group">
      <div className="relative h-32 sm:h-36 w-full rounded-xl overflow-hidden bg-slate-100">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 shadow-sm">
          <VegIndicator isVeg={item.is_vegetarian} size="sm" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {item.name}
          </h4>
          <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
            {restaurant?.name || 'Chef Special'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
          <span className="font-extrabold text-sm text-slate-900">
            {formatCurrency(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => addItem(item, fallbackRestaurant)}
              className="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white font-extrabold text-xs transition-all shadow-sm active:scale-95 border border-brand-200"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-brand-500 text-white rounded-lg shadow-sm font-bold text-xs">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="px-2 py-1 hover:bg-brand-600 rounded-l-lg transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 font-black">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-2 py-1 hover:bg-brand-600 rounded-r-lg transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
