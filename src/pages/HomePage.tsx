import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryList } from '../components/home/CategoryList';
import { RestaurantCard } from '../components/home/RestaurantCard';
import { FoodCard } from '../components/home/FoodCard';
import { RestaurantCardSkeleton } from '../components/common/LoadingSkeleton';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, Category, MenuItem } from '../types';
import { Filter, Star, Clock, Sparkles, Flame, ShieldCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularDishes, setPopularDishes] = useState<(MenuItem & { restaurant_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Filters
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'fastest' | undefined>(undefined);
  const [homeSearch, setHomeSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [cats, rests, dishes] = await Promise.all([
          restaurantService.getCategories(),
          restaurantService.getRestaurants(),
          restaurantService.getPopularDishes(),
        ]);
        setCategories(cats);
        setRestaurants(rests);
        setPopularDishes(dishes);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCategory) {
      const catName = selectedCategory.name.toLowerCase();
      const matchCuisine = r.cuisine.toLowerCase().includes(catName);
      const matchName = r.name.toLowerCase().includes(catName);
      if (!matchCuisine && !matchName) return false;
    }
    if (minRating && r.rating < minRating) return false;
    if (fastDelivery) {
      const match = r.delivery_time.match(/(\d+)/);
      const time = match ? parseInt(match[1], 10) : 40;
      if (time > 25) return false;
    }
    if (vegOnly) {
      if (!r.cuisine.toLowerCase().includes('veg') && !r.name.toLowerCase().includes('green')) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fastest') {
      const aTime = parseInt(a.delivery_time.match(/(\d+)/)?.[1] || '30', 10);
      const bTime = parseInt(b.delivery_time.match(/(\d+)/)?.[1] || '30', 10);
      return aTime - bTime;
    }
    return 0;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(homeSearch.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Search Bar on Mobile / Tablet Top */}
      <div className="lg:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-brand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
            placeholder="Search pizza, biryani, burgers or restaurants..."
            className="w-full bg-white shadow-card border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </form>
      </div>

      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Food Categories */}
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategory?.id}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Filter and Sorting Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setMinRating(null);
            setFastDelivery(false);
            setVegOnly(false);
            setSortBy(undefined);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            !selectedCategory && !minRating && !fastDelivery && !vegOnly && !sortBy
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            vegOnly
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          <span>Pure Veg</span>
        </button>

        <button
          onClick={() => setMinRating(minRating === 4.5 ? null : 4.5)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            minRating === 4.5
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          <span>Rating 4.5+</span>
        </button>

        <button
          onClick={() => setFastDelivery(!fastDelivery)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            fastDelivery
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Fast Delivery (&lt;25m)</span>
        </button>

        <button
          onClick={() => setSortBy(sortBy === 'rating' ? undefined : 'rating')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            sortBy === 'rating'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Top Rated
        </button>
      </div>

      {/* Popular Restaurants Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular Restaurants {selectedCategory ? `in ${selectedCategory.name}` : 'Near You'}
              </h2>
              <span className="text-xs font-bold bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full border border-brand-200">
                {filteredRestaurants.length} places
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Hand-picked verified culinary destinations
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <p className="text-base font-bold text-slate-800 mb-2">No restaurants match your selected filters</p>
            <p className="text-xs text-slate-500 mb-4">Try clearing one or more filters to view more restaurants.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setMinRating(null);
                setFastDelivery(false);
                setVegOnly(false);
              }}
              className="text-xs font-bold bg-brand-500 text-white px-4 py-2 rounded-xl shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Near You / Trending Dishes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-500 fill-brand-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending Gourmet Dishes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Most ordered delicious bites this week
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {popularDishes.slice(0, 8).map((dish) => (
            <FoodCard
              key={dish.id}
              item={dish}
              restaurant={restaurants.find((r) => r.id === dish.restaurant_id)}
            />
          ))}
        </div>
      </div>

      {/* Promotional Perks Banner */}
      <div className="bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Zestora Gourmet Gold</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight">
            Free Delivery On Every Order Over ₹199
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg">
            Enjoy priority kitchen preparation, real-time live GPS driver tracking, and instant customer concierge.
          </p>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3.5 bg-white text-brand-600 hover:bg-slate-50 font-black text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0"
        >
          Explore All Menus
        </button>
      </div>
    </div>
  );
};
