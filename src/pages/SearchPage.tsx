import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Utensils, Store, Filter, X, Sparkles } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { RestaurantCard } from '../components/home/RestaurantCard';
import { FoodCard } from '../components/home/FoodCard';
import { Restaurant, MenuItem } from '../types';
import { EmptyState } from '../components/common/EmptyState';

const POPULAR_SEARCH_KEYWORDS = [
  'Biryani', 'Pizza', 'Burger', 'Dosa', 'Butter Chicken', 'Noodles', 'Healthy', 'Cake', 'Coffee'
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'dishes' | 'restaurants'>('all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const [matchingRestaurants, setMatchingRestaurants] = useState<Restaurant[]>([]);
  const [matchingDishes, setMatchingDishes] = useState<(MenuItem & { restaurant?: Restaurant })[]>([]);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setMatchingRestaurants([]);
        setMatchingDishes([]);
        return;
      }

      setLoading(true);
      try {
        const results = await restaurantService.searchFoodAndRestaurants(query.trim());
        setMatchingRestaurants(results.restaurants);
        setMatchingDishes(results.dishes);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
  };

  // Debounce updating URL params so router does not thrash or shift bottom bar on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed) {
        setSearchParams({ q: trimmed }, { replace: true });
      } else if (searchParams.get('q')) {
        setSearchParams({}, { replace: true });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredDishes = matchingDishes.filter((d) => {
    if (isVegOnly && !d.is_vegetarian) return false;
    return true;
  });

  const filteredRestaurants = matchingRestaurants.filter((r) => {
    if (isVegOnly && !r.cuisine.toLowerCase().includes('veg') && !r.name.toLowerCase().includes('green')) {
      return false;
    }
    return true;
  });

  const totalResults = filteredRestaurants.length + filteredDishes.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-card">
        <div className="relative">
          <Search className="w-5 h-5 text-brand-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search for restaurants, dishes, or cuisines..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Keyword Suggestions */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Trending:
          </span>
          {POPULAR_SEARCH_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => handleQueryChange(kw)}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-semibold transition-colors flex-shrink-0"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs and Filters */}
      {query.trim() && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({totalResults})
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dishes'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Dishes ({filteredDishes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'restaurants'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Restaurants ({filteredRestaurants.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isVegOnly
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>
        </div>
      )}

      {/* Results Content */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">Finding the best matches...</p>
        </div>
      ) : !query.trim() ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">What are you in the mood for?</h3>
          <p className="text-xs text-slate-400 mt-1">Search favorite restaurants, signature dishes, or fresh cuisines</p>
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          icon={Search}
          title={`No results for "${query}"`}
          description="We couldn't find any dishes or restaurants matching your search. Try searching for Biryani, Pizza, Burger, or Pasta."
          actionText="View Popular Restaurants"
          onAction={() => handleQueryChange('')}
        />
      ) : (
        <div className="space-y-10">
          {/* Dishes section */}
          {(activeTab === 'all' || activeTab === 'dishes') && filteredDishes.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-brand-500" />
                <span>Dishes ({filteredDishes.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredDishes.map((dish) => (
                  <FoodCard key={dish.id} item={dish} restaurant={dish.restaurant} />
                ))}
              </div>
            </div>
          )}

          {/* Restaurants section */}
          {(activeTab === 'all' || activeTab === 'restaurants') && filteredRestaurants.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-500" />
                <span>Restaurants ({filteredRestaurants.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
