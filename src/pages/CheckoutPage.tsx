import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { Address } from '../types';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { PaymentSelector } from '../components/checkout/PaymentSelector';
import { BillDetails } from '../components/cart/BillDetails';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, ArrowRight, Store, ArrowLeft } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { items, restaurant, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryNotes = (location.state as { deliveryNotes?: string })?.deliveryNotes || '';

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('Demo Instant Pay (UPI / Card)');
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const loadAddresses = async () => {
      try {
        setFetchingAddresses(true);
        const userAddresses = await addressService.getAddresses(user?.id || 'demo-user-id');
        setAddresses(userAddresses);
        const defaultAddr = userAddresses.find(a => a.is_default) || userAddresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      } finally {
        setFetchingAddresses(false);
      }
    };

    loadAddresses();
  }, [user, items, navigate]);

  const handleAddAddress = async (data: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
    const created = await addressService.addAddress(user?.id || 'demo-user-id', data);
    setAddresses(prev => [created, ...prev]);
    setSelectedAddressId(created.id);
  };

  const handlePlaceOrder = async () => {
    if (!restaurant) return;

    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddr) {
      alert('Please select or add a delivery address to place your order');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.createOrder({
        userId: user?.id || 'demo-user-id',
        restaurantId: restaurant.id,
        addressId: selectedAddr.id,
        address: selectedAddr,
        items: items.map(i => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          price: i.price,
          item_name: i.item.name,
        })),
        paymentMethod: selectedPayment,
        deliveryNotes: deliveryNotes,
      });

      // Clear the cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back link */}
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address Selection */}
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
            onAddAddress={handleAddAddress}
          />

          {/* Payment Method Selection */}
          <PaymentSelector
            selectedMethod={selectedPayment}
            onSelectMethod={setSelectedPayment}
          />
        </div>

        {/* Right Column: Order Items Review & Final Checkout Button */}
        <div className="lg:col-span-5 space-y-6">
          {/* Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-5 h-5 text-brand-500" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {restaurant?.name}
                </h3>
                <p className="text-[11px] text-slate-400">Order Items Review</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
              {items.map((cartItem) => (
                <div key={cartItem.menu_item_id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-brand-600">{cartItem.quantity}x</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{cartItem.item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(cartItem.price * cartItem.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <BillDetails
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            total={total}
            showCouponInput={false}
          />

          <Button
            onClick={handlePlaceOrder}
            size="lg"
            fullWidth
            isLoading={loading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Place Order ({formatCurrency(total)})
          </Button>

          <p className="text-center text-[11px] text-slate-400 font-medium">
            By placing an order, you agree to Zestora's Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
