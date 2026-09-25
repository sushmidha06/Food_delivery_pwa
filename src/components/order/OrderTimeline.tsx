import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, Utensils, Bike, CheckCircle2, XCircle } from 'lucide-react';

interface OrderTimelineProps {
  status: OrderStatus;
}

const STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Received & sent to kitchen', icon: Check },
  { key: 'preparing', label: 'Restaurant Preparing', desc: 'Chef is cooking your fresh meal', icon: Utensils },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Delivery partner on the way', icon: Bike },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your food!', icon: CheckCircle2 },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-4 text-red-700">
        <XCircle className="w-8 h-8 flex-shrink-0" />
        <div>
          <h4 className="font-extrabold text-base">Order Cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">This order was cancelled and a full refund has been initiated.</p>
        </div>
      </div>
    );
  }

  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="py-6 px-2 sm:px-4">
      <div className="relative">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentIndex > stepNum;
          const isCurrent = currentIndex === stepNum;
          const isPending = currentIndex < stepNum;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative flex items-start gap-4 pb-8 last:pb-0 group">
              {/* Connecting vertical line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-[calc(100%-20px)] transition-colors duration-500 ${
                    currentIndex > stepNum ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 shadow-float animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm sm:text-base font-extrabold ${
                      isCurrent
                        ? 'text-brand-600'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[11px] font-bold text-emerald-600">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
