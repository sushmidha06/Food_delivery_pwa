import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { OrderStatusDemoController } from '../components/order/OrderStatusDemoController';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Phone, MapPin, Store, ChevronLeft, ShieldCheck, Bike, Sparkles } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    orderService.getOrderById(id).then((ord) => {
      setOrder(ord);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!id) return;
    await orderService.updateOrderStatus(id, newStatus);
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Connecting to live tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Order not found</h3>
        <p className="text-xs text-slate-500">We could not locate this order ID in your history.</p>
        <Link to="/orders" className="inline-block px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <span className="font-mono text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          Order #{order.id}
        </span>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
        {/* Estimated Arrival Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md mb-2">
              <Bike className="w-3.5 h-3.5" /> Live GPS Delivery Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {order.status === 'delivered' ? 'Order Delivered!' : 'Arriving in 25–35 Mins'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              From <strong className="text-slate-800">{order.restaurant?.name || 'Gourmet Kitchen'}</strong>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery OTP</span>
            <span className="text-lg font-black text-brand-600 font-mono tracking-widest">4829</span>
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <OrderTimeline status={order.status} />

        {/* Delivery Partner Profile Card */}
        {order.status !== 'cancelled' && (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Delivery Partner"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">Ramesh Kumar</h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Delivery Partner • Electric Eco-Vehicle
                </p>
              </div>
            </div>

            <a
              href="tel:9876543210"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">Call Rider</span>
            </a>
          </div>
        )}

        {/* Delivery Destination Address */}
        {order.address && (
          <div className="pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-800">
                Delivering to {order.address.label}
              </p>
              <p className="text-slate-500 mt-0.5">{order.address.address_line}, {order.address.city}</p>
            </div>
          </div>
        )}
      </div>

      {/* Ordered Items Accordion / Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">
          Items in this Order
        </h3>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-700">
                <strong className="text-brand-600 mr-2">{item.quantity}x</strong>
                {item.item_name}
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black">
          <span>Total Paid</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
};
