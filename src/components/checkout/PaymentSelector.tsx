import React from 'react';
import { Banknote, CreditCard, Zap, ShieldCheck } from 'lucide-react';

interface PaymentSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods = [
    {
      id: 'Demo Instant Pay (UPI / Card)',
      title: 'Demo Instant Pay (UPI / Card)',
      subtitle: 'Simulates instant digital confirmation for client demo',
      icon: Zap,
      recommended: true,
    },
    {
      id: 'Cash on Delivery',
      title: 'Cash on Delivery',
      subtitle: 'Pay with cash upon physical food arrival',
      icon: Banknote,
      recommended: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-500" />
          <h3 className="font-extrabold text-base text-slate-900">
            Payment Method
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Demo Mode Secure
        </span>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {method.title}
                  </span>
                  {method.recommended && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {method.subtitle}
                </p>
              </div>

              <div className="pt-0.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
