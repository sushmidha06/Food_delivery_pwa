import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { OrderCard } from '../components/order/OrderCard';
import { EmptyState } from '../components/common/EmptyState';
import { Clock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrders(user?.id || 'demo-user-id');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-brand-500" />
            <span>My Orders</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track past and ongoing culinary deliveries
          </p>
        </div>

        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Looks like you haven't placed an order yet. Treat yourself to fresh food from top restaurants!"
          actionText="Browse Restaurants"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
