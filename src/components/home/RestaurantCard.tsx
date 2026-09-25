import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bike, Heart } from 'lucide-react';
import { Restaurant } from '../../types';
import { Rating } from '../common/Rating';
import { formatCurrency } from '../../utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Restaurant Banner Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Discount / Tag Pill */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm">
          <p className="text-[11px] font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
            <span className="text-brand-500 font-black">50% OFF</span> UP TO ₹100
          </p>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Add to favorites"
        >
          <Heart className="w-4 h-4 fill-transparent hover:fill-red-500 transition-colors" />
        </button>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <Rating rating={restaurant.rating} size="sm" showText={false} />
          </div>

          <p className="text-xs text-slate-500 line-clamp-1 font-medium">
            {restaurant.cuisine}
          </p>
        </div>

        {/* Meta Bar: Delivery Time & Delivery Fee */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.delivery_time}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.delivery_fee === 0 ? 'Free Delivery' : `${formatCurrency(restaurant.delivery_fee)} delivery`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
