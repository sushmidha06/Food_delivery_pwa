import React from 'react';
import { OrderStatus } from '../../types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface OrderStatusDemoControllerProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}

export const OrderStatusDemoController: React.FC<OrderStatusDemoControllerProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const statuses: { id: OrderStatus; label: string }[] = [
    { id: 'confirmed', label: '1. Confirmed' },
    { id: 'preparing', label: '2. Preparing' },
    { id: 'out_for_delivery', label: '3. Out for Delivery' },
    { id: 'delivered', label: '4. Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
            Client Presentation Demo Controls
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Simulate Real-time Status
        </span>
      </div>

      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        Click any stage below to test the live tracker transitions instantly:
      </p>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const isActive = currentStatus === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-float scale-105 ring-2 ring-brand-300'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {isActive && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
