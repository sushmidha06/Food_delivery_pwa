import React from 'react';
import { Clock, Bike, MapPin, Share2, Heart, Search } from 'lucide-react';
import { Restaurant } from '../../types';
import { Rating } from '../common/Rating';
import { formatCurrency } from '../../utils/formatters';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  menuSearch: string;
  onMenuSearchChange: (val: string) => void;
  isVegOnly: boolean;
  onVegOnlyToggle: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  menuSearch,
  onMenuSearchChange,
  isVegOnly,
  onVegOnlyToggle,
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card mb-8">
      {/* Banner / Cover */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full bg-slate-900">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Action icons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: restaurant.name, url: window.location.href });
              }
            }}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-brand-500 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Share restaurant"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Save restaurant"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Info inside banner overlay on desktop / bottom */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-brand-500 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                Open Now
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                {restaurant.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium">
                {restaurant.cuisine}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Rating rating={restaurant.rating} size="lg" reviewCount="1.5k+ ratings" />
            </div>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>{restaurant.delivery_time}</span>
          </div>

          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-brand-500" />
            <span>{restaurant.delivery_fee === 0 ? 'Free Delivery' : `${formatCurrency(restaurant.delivery_fee)} Delivery Fee`}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="max-w-xs truncate">{restaurant.address}</span>
          </div>
        </div>

        {/* Veg Only Toggle & Menu Search Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Pure Veg Toggle Switch */}
          <button
            onClick={onVegOnlyToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isVegOnly
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isVegOnly ? 'border-emerald-600' : 'border-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-emerald-600' : 'bg-transparent'}`} />
            </span>
            <span>Pure Veg</span>
          </button>

          {/* Menu Search Field */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => onMenuSearchChange(e.target.value)}
              placeholder="Search in menu..."
              className="w-full bg-slate-100 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
