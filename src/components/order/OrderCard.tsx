import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';
import { OrderStatusBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowRight, Utensils, CheckCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              #{order.id}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
            {order.restaurant?.name || 'Gourmet Kitchen'}
          </h3>

          <p className="text-xs text-slate-400 font-medium">
            {formatDate(order.created_at)}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-semibold">Total Paid</span>
          <span className="text-lg font-black text-slate-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Items Summary */}
      <div className="py-4 space-y-1.5 border-b border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Ordered Dishes
        </p>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-slate-700">
              <span className="font-medium">
                <strong className="text-brand-600 mr-1.5">{item.quantity}x</strong>
                {item.item_name}
              </span>
              <span className="text-slate-500 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">Chef items prepared fresh</p>
        )}
      </div>

      {/* Card Action footer */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isDelivered ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Delivered to your address</span>
            </>
          ) : isCancelled ? (
            <span>Cancelled order</span>
          ) : (
            <span className="text-brand-600 font-bold animate-pulse">
              ● Active Live Tracking available
            </span>
          )}
        </div>

        <Link
          to={`/track-order/${order.id}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isDelivered || isCancelled
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-float'
          }`}
        >
          <span>{isDelivered || isCancelled ? 'View Details' : 'Track Order'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
