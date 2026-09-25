import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../utils/cn';

export const BottomNavigation: React.FC = () => {
  const { itemCount } = useCart();
  const location = useLocation();

  // Hide bottom navigation on authentication pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Search', to: '/search', icon: Search },
    {
      label: 'Cart',
      to: '/cart',
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : undefined,
    },
    { label: 'Orders', to: '/orders', icon: Clock },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        paddingTop: '8px',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        contain: 'layout paint',
      }}
    >
      <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center py-1 transition-all select-none group w-full',
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              )
            }
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <div className="flex flex-col items-center justify-center w-full active:scale-90 transition-transform">
                  <div className="relative flex items-center justify-center w-8 h-7">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform',
                        isActive ? 'scale-110 stroke-[2.4px] text-brand-600' : 'stroke-[1.8px]'
                      )}
                    />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-2 bg-brand-500 text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white shadow-sm animate-scale-up">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] tracking-tight leading-none mt-1 transition-colors text-center w-full truncate',
                      isActive ? 'font-black text-brand-600' : 'font-semibold text-slate-500'
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 animate-scale-up" />
                  )}
                </div>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
