import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    title: 'Feast in Style: Flat 50% OFF',
    subtitle: 'Use code ZEST50 on your first gourmet order above ₹299',
    ctaText: 'Claim Offer',
    ctaLink: '/search',
    badge: 'Limited Time Deal',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-orange-600/90 via-red-600/80 to-transparent',
  },
  {
    id: 2,
    title: 'Midnight Cravings Delivered In 20 Mins',
    subtitle: 'Fresh hot biryanis, sourdough pizzas & creamy shakes',
    ctaText: 'Order Now',
    ctaLink: '/search?q=Biryani',
    badge: 'Superfast Delivery',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-slate-950/90 via-slate-900/80 to-transparent',
  },
  {
    id: 3,
    title: 'Authentic South Indian Filter Kaapi & Dosas',
    subtitle: 'Crispy ghee roast dosas from Chennai Tiffin & legacy kitchens',
    ctaText: 'Explore Breakfast',
    ctaLink: '/restaurant/r1000000-0000-0000-0000-000000000004',
    badge: 'Heritage Flavors',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-amber-700/90 via-orange-700/80 to-transparent',
  }
];

export const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = BANNERS[currentIndex];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-100 bg-slate-900 text-white min-h-[220px] sm:min-h-[280px] md:min-h-[320px] transition-all">
      {/* Background Image */}
      <img
        src={current.image}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-70"
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${current.gradient}`} />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 flex flex-col justify-center max-w-xl h-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold w-fit mb-3 sm:mb-4">
          <Tag className="w-3.5 h-3.5 text-brand-300" />
          <span>{current.badge}</span>
        </div>

        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-sm">
          {current.title}
        </h2>

        <p className="text-xs sm:text-base text-slate-200 mb-5 sm:mb-6 max-w-md line-clamp-2">
          {current.subtitle}
        </p>

        <div>
          <Link
            to={current.ctaLink}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-float hover:scale-105 active:scale-95 transition-all"
          >
            <span>{current.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % BANNERS.length)}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          aria-label="Next banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-6 sm:left-10 z-20 flex items-center gap-1.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-brand-500' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
