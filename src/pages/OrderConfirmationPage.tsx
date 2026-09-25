import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, ArrowRight, Home, Sparkles } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const routerLocation = useLocation();
  const stateOrder = routerLocation.state?.order as Order | undefined;
  const [order, setOrder] = useState<Order | null>(stateOrder || null);
  const [loading, setLoading] = useState(!stateOrder);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d2e', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    if (!stateOrder && id) {
      orderService.getOrderById(id).then((ord) => {
        setOrder(ord);
        setLoading(false);
      });
    }
  }, [id, stateOrder]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 animate-fade-in">
      {/* Celebration Icon */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 animate-scale-up">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank you for your order!
        </h1>

        <p className="text-sm text-slate-500 max-w-md mt-1">
          Your order <strong className="text-slate-900 font-mono">#{id}</strong> has been received by{' '}
          <strong className="text-slate-900">{order?.restaurant?.name || 'the kitchen'}</strong>.
        </p>
      </div>

      {/* Delivery Estimate Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estimated Delivery Time
            </p>
            <p className="text-lg font-black text-slate-900">
              30 – 40 Minutes
            </p>
          </div>
        </div>

        {order?.address && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 sm:text-right">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{order.address.address_line}</span>
          </div>
        )}
      </div>

      {/* Order Summary Details */}
      {order && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card text-left space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="font-extrabold text-sm text-slate-900">Order Summary</span>
            <span className="text-xs text-slate-400">{formatDate(order.created_at)}</span>
          </div>

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
            <span className="text-base text-slate-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to={`/track-order/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-float transition-all active:scale-95"
        >
          <span>Track Live Order</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};
