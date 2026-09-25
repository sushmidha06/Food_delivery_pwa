import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { CartItemRow } from '../components/cart/CartItemRow';
import { BillDetails } from '../components/cart/BillDetails';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { ShoppingBag, ArrowRight, Store, MessageSquare, Trash2, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, restaurant, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, tax, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryNotes, setDeliveryNotes] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Good food is always cooking! Discover mouth-watering dishes from top-rated restaurants near you."
          actionText="Explore Restaurants"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    // If not authenticated, navigate to login with redirect back to checkout
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout', { state: { deliveryNotes } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Ordering</span>
        </Link>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Restaurant Info & Items List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Restaurant Banner Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ordering From
                </p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {restaurant?.name || 'Selected Restaurant'}
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  {restaurant?.address || 'Indiranagar, Bangalore'}
                </p>
              </div>
            </div>

            {restaurant && (
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="text-xs font-bold text-brand-600 hover:underline flex-shrink-0"
              >
                + Add More
              </Link>
            )}
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              Your Items ({items.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {items.map((cartItem) => (
                <CartItemRow
                  key={cartItem.menu_item_id}
                  cartItem={cartItem}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Cooking & Delivery Instructions Note */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span>Note for Restaurant / Delivery Instructions</span>
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Ring doorbell, less spicy, leave at door..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Right Column: Bill Details & Checkout CTA */}
        <div className="lg:col-span-5 space-y-6">
          <BillDetails
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            total={total}
          />

          <Button
            onClick={handleProceedToCheckout}
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
