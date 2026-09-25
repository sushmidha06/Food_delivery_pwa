import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { VegIndicator } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

interface CartItemRowProps {
  cartItem: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  cartItem,
  onUpdateQuantity,
  onRemove,
}) => {
  const itemTotal = cartItem.price * cartItem.quantity;

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0 gap-3">
      {/* Item info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={cartItem.item.image_url}
            alt={cartItem.item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <VegIndicator isVeg={cartItem.item.is_vegetarian} size="sm" />
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {cartItem.item.name}
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {formatCurrency(cartItem.price)} each
          </p>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
        <button
          onClick={() => onUpdateQuantity(cartItem.menu_item_id, -1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
          aria-label="Decrease quantity"
        >
          {cartItem.quantity === 1 ? (
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
        </button>

        <span className="w-7 text-center text-xs font-black text-slate-900">
          {cartItem.quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(cartItem.menu_item_id, 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Line Total */}
      <div className="text-right w-20 flex-shrink-0">
        <span className="text-sm font-black text-slate-900">
          {formatCurrency(itemTotal)}
        </span>
      </div>
    </div>
  );
};
