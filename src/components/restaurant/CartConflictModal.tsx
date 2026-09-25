import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const CartConflictModal: React.FC = () => {
  const { conflictModalOpen, conflictRestaurantName, restaurant, confirmClearAndAdd, cancelConflict } = useCart();

  return (
    <Modal
      isOpen={conflictModalOpen}
      onClose={cancelConflict}
      maxWidth="sm"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Replace cart items?
        </h3>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Your cart currently contains delicious items from{' '}
          <strong className="text-slate-800">{restaurant?.name || 'another restaurant'}</strong>.
          Would you like to clear your cart and add items from{' '}
          <strong className="text-brand-600">{conflictRestaurantName}</strong> instead?
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            fullWidth
            onClick={cancelConflict}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={confirmClearAndAdd}
          >
            Clear & Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};
