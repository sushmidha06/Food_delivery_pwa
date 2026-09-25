import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MapPin, Navigation, Home, Briefcase, Bookmark } from 'lucide-react';
import { Address } from '../../types';
import { useLocation } from '../../hooks/useLocation';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onAddAddress,
}) => {
  const { location, detectCurrentLocation, isDetecting } = useLocation();
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUseCurrentLocation = async () => {
    await detectCurrentLocation();
    setAddressLine(location.address);
    setCity(location.city);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) {
      setError('Please provide a complete street address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onAddAddress({
        label,
        address_line: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        is_default: isDefault,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      onClose();
      setAddressLine('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Delivery Address"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick GPS detect */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isDetecting}
          className="w-full flex items-center justify-center gap-2 p-2.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-xl text-xs font-bold transition-colors border border-brand-200"
        >
          <Navigation className="w-3.5 h-3.5 fill-current" />
          <span>{isDetecting ? 'Detecting via GPS...' : 'Prefill from Current Location'}</span>
        </button>

        {/* Address Type Pill Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Address Label
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Home', icon: Home },
              { id: 'Work', icon: Briefcase },
              { id: 'Other', icon: Bookmark },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setLabel(id as 'Home' | 'Work' | 'Other')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  label === id
                    ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Complete Address Line */}
        <Input
          label="House / Flat / Block & Street Address"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="e.g. Flat 304, Emerald Heights, 12th Main Road"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={error}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="Postal Code (PIN)"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        {/* Default toggle */}
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-brand-500 rounded border-slate-300 focus:ring-brand-500"
          />
          <span className="text-xs font-medium text-slate-700">
            Set as default delivery address
          </span>
        </label>

        {/* Action buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
          >
            Save Address
          </Button>
        </div>
      </form>
    </Modal>
  );
};
