import React from 'react';
import { cn } from '../../utils/cn';
import { OrderStatus } from '../../types';

interface VegIndicatorProps {
  isVeg: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg, className, size = 'md' }) => {
  const containerSize = size === 'sm' ? 'w-3.5 h-3.5 border-[1.5px]' : 'w-4 h-4 border-2';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-[4px] bg-white flex-shrink-0',
        containerSize,
        isVeg ? 'border-emerald-600' : 'border-red-600',
        className
      )}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <div
        className={cn(
          'rounded-full',
          dotSize,
          isVeg ? 'bg-emerald-600' : 'bg-red-600'
        )}
      />
    </div>
  );
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    confirmed: { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    preparing: { label: 'Preparing', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
    out_for_delivery: { label: 'Out for Delivery', bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  };

  const config = statusConfig[status] || statusConfig.confirmed;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      {config.label}
    </span>
  );
};

export const DiscountBadge: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-600 border border-brand-200 uppercase tracking-wide',
        className
      )}
    >
      {text}
    </span>
  );
};
