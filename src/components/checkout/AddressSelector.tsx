import React, { useState } from 'react';
import { Address } from '../../types';
import { Button } from '../common/Button';
import { MapPin, Plus, CheckCircle2, Home, Briefcase, Bookmark } from 'lucide-react';
import { AddAddressModal } from './AddAddressModal';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (data: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Home className="w-4 h-4 text-brand-500" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      default:
        return <Bookmark className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-500" />
          <h3 className="font-extrabold text-base text-slate-900">
            Delivery Address
          </h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-slate-500 mb-3">No delivery address saved yet.</p>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Add Delivery Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getLabelIcon(addr.label)}
                      <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                        {addr.label}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-brand-500 fill-brand-100" />
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                    {addr.address_line}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {addr.city}, {addr.postal_code}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[11px]">
                  {addr.is_default && (
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                  <span className={`ml-auto font-bold ${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>
                    {isSelected ? 'Delivering Here' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddAddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddAddress={onAddAddress}
      />
    </div>
  );
};
