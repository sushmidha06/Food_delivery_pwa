import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Route-level code-splitting: Lazy load pages to drastically reduce initial bundle size and boost performance
const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const RestaurantDetailPage = React.lazy(() => import('./pages/RestaurantDetailPage').then(m => ({ default: m.RestaurantDetailPage })));
const SearchPage = React.lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const CartPage = React.lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const OrderTrackingPage = React.lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage').then(m => ({ default: m.OrderHistoryPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <Routes>
              {/* Main App Layout */}
              <Route path="/" element={<Layout />}>
                {/* Protected App Routes - App opens to Login first if not authenticated */}
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="restaurant/:id"
                  element={
                    <ProtectedRoute>
                      <RestaurantDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="search"
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="order-confirmation/:id"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="track-order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Authentication Routes (Public) */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
