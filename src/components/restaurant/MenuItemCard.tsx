import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';
import { VegIndicator } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurant }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col sm:flex-row justify-between gap-4">
      {/* Left Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <VegIndicator isVeg={item.is_vegetarian} size="sm" />
          {item.price > 350 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              ★ Chef Special
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
          {item.name}
        </h3>

        <p className="font-extrabold text-slate-900 text-sm sm:text-base">
          {formatCurrency(item.price)}
        </p>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
          {item.description}
        </p>
      </div>

      {/* Right Image + Add Stepper */}
      <div className="relative flex flex-col items-center flex-shrink-0 self-center sm:self-auto">
        <div className="w-32 h-28 sm:w-36 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Add Button floating over bottom edge of photo */}
        <div className="-mt-5 z-10">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item, restaurant)}
              className="px-6 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-brand-600 font-black text-xs uppercase tracking-wider shadow-md hover:bg-brand-50 active:scale-95 transition-all"
            >
              ADD +
            </button>
          ) : (
            <div className="flex items-center bg-brand-500 text-white rounded-xl shadow-md font-bold text-xs border border-brand-600">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="px-2.5 py-2 hover:bg-brand-600 rounded-l-xl transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="px-3 font-black text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-2.5 py-2 hover:bg-brand-600 rounded-r-xl transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
