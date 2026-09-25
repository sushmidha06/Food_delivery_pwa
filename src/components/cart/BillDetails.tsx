import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Tag } from 'lucide-react';

interface BillDetailsProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  showCouponInput?: boolean;
}

export const BillDetails: React.FC<BillDetailsProps> = ({
  subtotal,
  deliveryFee,
  tax,
  total,
  showCouponInput = true,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
        Bill Summary
      </h3>

      {/* Coupon Banner */}
      {showCouponInput && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold">ZEST50 Applied</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700">₹50 SAVED</span>
        </div>
      )}

      <div className="space-y-2.5 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Item Total</span>
          <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span>Delivery Partner Fee</span>
          </div>
          <span className="font-semibold text-slate-800">
            {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(deliveryFee)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Govt Taxes & Restaurant Packaging (5%)</span>
          <span className="font-semibold text-slate-800">{formatCurrency(tax)}</span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-base">
          <span className="font-black text-slate-900">To Pay</span>
          <span className="font-black text-lg text-slate-900">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Safe & Encrypted Checkout</span>
      </div>
    </div>
  );
};
