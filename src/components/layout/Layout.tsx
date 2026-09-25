import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Navbar } from './Navbar';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';
import { CartConflictModal } from '../restaurant/CartConflictModal';
import { LocationModal } from '../home/LocationModal';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-100 selection:text-brand-800">
      <Navbar />

      <main className={`flex-1 ${isAuthPage ? 'pb-6' : 'pb-24 md:pb-12'}`}>
        <Outlet />
      </main>

      {!isAuthPage && !isNative && <Footer />}
      {!isAuthPage && <BottomNavigation />}
      <CartConflictModal />
      <LocationModal />
    </div>
  );
};
