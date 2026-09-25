import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import {
  MapPin,
  Search,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  Clock,
  Sparkles,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useLocation } from '../../hooks/useLocation';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();
  const { location, openLocationModal } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      navigate('/search');
    }
  };

  const isActive = (path: string) => routerLocation.pathname === path;

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm w-full transition-all"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 18px)',
        paddingBottom: '10px'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single horizontal row layout with align-items: center */}
        <div className="flex items-center justify-between h-12 w-full gap-2 sm:gap-4">
          
          {/* Left: Brand Logo & Desktop Location Picker */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0 select-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-sm font-black text-lg group-hover:scale-105 transition-transform flex-shrink-0">
                Z
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                Zestora<span className="text-brand-500">.</span>
              </span>
            </Link>

            {/* Desktop Location Picker */}
            <button
              onClick={openLocationModal}
              className="hidden lg:flex items-center gap-2 text-left px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              title="Change delivery location"
            >
              <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
              </div>
              <div className="max-w-[150px] truncate">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 leading-tight">
                  <span className="truncate">{location.city || 'Bangalore'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate leading-tight">{location.address}</p>
              </div>
            </button>
          </div>

          {/* Center (Desktop only): Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2 lg:mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, restaurants or cuisines..."
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-brand-500 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
              />
            </form>
          </div>

          {/* Right: Points Icon, Cart Button, Menu Icon (Aligned perfectly in one horizontal row) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 mr-2">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/search') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </Link>
              <Link
                to="/orders"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/orders') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Orders</span>
              </Link>
            </nav>

            {/* 1. Points Icon Button */}
            <button
              onClick={() => setRewardsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/80 active:scale-95 border border-amber-200/80 text-amber-800 font-bold text-xs shadow-xs transition-all flex-shrink-0 select-none cursor-pointer"
              title="Zestora Reward Points"
              aria-label="Reward Points: 120 pts"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
              <span className="leading-none whitespace-nowrap">
                120 <span className="text-[10px] font-semibold text-amber-600">pts</span>
              </span>
            </button>

            {/* 2. Cart Button */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-800 flex items-center justify-center transition-transform flex-shrink-0"
              title="View Cart"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-slate-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white shadow-sm animate-scale-up">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* 3. Menu Icon (Hamburger) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-800 flex items-center justify-center transition-transform flex-shrink-0"
              title="Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4.5 h-4.5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SLIDE-OVER DRAWER MENU                                  */}
      {/* ======================================================== */}
      {drawerOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left"
            style={{
              paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  Z
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">
                  Zestora<span className="text-brand-500">.</span>
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Close menu"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Drawer User Card */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60">
              {user ? (
                <div className="flex items-center gap-3">
                  {profile?.avatar_url && !profile.avatar_url.includes('photo-1534528741775') ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-base flex items-center justify-center border border-brand-200 shadow-sm">
                      {(profile?.full_name || user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 text-sm truncate">
                      {profile?.full_name || user.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span>120 pts • Silver Member</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Welcome to Zestora</p>
                    <p className="text-xs text-slate-500">Sign in to track orders & reorder quickly</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="flex-1 py-2 text-center text-xs font-bold text-white bg-brand-500 rounded-xl shadow-sm hover:bg-brand-600 active:scale-95 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDrawerOpen(false)}
                      className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Deliver To Selector in Drawer */}
            <div className="px-5 py-3 border-b border-slate-100">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  openLocationModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500/50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deliver to</span>
                    <span className="text-xs font-black text-slate-800 truncate block">
                      {location.city || 'Bangalore'} • {location.address}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                to="/"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4.5 h-4.5" />
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/search') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4.5 h-4.5" />
                <span>Search Dishes</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/cart') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>My Cart</span>
                </div>
                {itemCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                to="/orders"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/orders') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4.5 h-4.5" />
                <span>Order History</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/profile') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="w-4.5 h-4.5" />
                <span>Profile & Settings</span>
              </Link>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setRewardsModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                  <span>Zestora Rewards</span>
                </div>
                <span className="text-xs font-black text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  120 pts
                </span>
              </button>
            </nav>

            {/* Drawer Footer / Sign Out */}
            {user && (
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={async () => {
                    setDrawerOpen(false);
                    await signOut();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors active:scale-98"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* REWARDS MODAL (Triggered by Points Icon)                 */}
      {/* ======================================================== */}
      {rewardsModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setRewardsModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 animate-scale-up space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Zestora Points</h3>
                  <p className="text-[11px] text-slate-500">Silver Gourmet Member</p>
                </div>
              </div>
              <button
                onClick={() => setRewardsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-200/60 text-center space-y-1">
              <span className="text-3xl font-black text-amber-900">120</span>
              <span className="text-xs font-bold text-amber-700 block">Available Reward Points</span>
              <p className="text-[11px] text-amber-800/80 font-medium">Worth ₹120 discount on your orders</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Earn on every order</span>
                <span className="font-bold text-slate-900">10 pts / ₹100</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Redemption value</span>
                <span className="font-bold text-slate-900">1 pt = ₹1</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Next tier (Gold)</span>
                <span className="font-bold text-amber-600">80 pts to unlock</span>
              </div>
            </div>

            <button
              onClick={() => setRewardsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs active:scale-98 transition-transform"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
