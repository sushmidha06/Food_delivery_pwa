import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MapPin, Navigation, Compass, Check } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

const POPULAR_LOCATIONS = [
  { address: '100 Feet Rd, Indiranagar', city: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { address: '80 Feet Rd, 4th Block, Koramangala', city: 'Bangalore', latitude: 12.9352, longitude: 77.6245 },
  { address: '27th Main, Sector 1, HSR Layout', city: 'Bangalore', latitude: 12.9121, longitude: 77.6446 },
  { address: 'ITPL Main Rd, Whitefield', city: 'Bangalore', latitude: 12.9698, longitude: 77.7500 },
  { address: 'Linking Road, Bandra West', city: 'Mumbai', latitude: 19.0596, longitude: 72.8295 },
  { address: 'Inner Circle, Connaught Place', city: 'New Delhi', latitude: 28.6315, longitude: 77.2167 },
];

export const LocationModal: React.FC = () => {
  const {
    location,
    locationModalOpen,
    closeLocationModal,
    detectCurrentLocation,
    setLocationManually,
    isDetecting,
    detectionError
  } = useLocation();
  const [manualInput, setManualInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setLocationManually({
        address: manualInput.trim(),
        city: 'Selected Location',
      });
      setManualInput('');
    }
  };

  return (
    <Modal
      isOpen={locationModalOpen}
      onClose={closeLocationModal}
      title="Select Delivery Location"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Use Current GPS Location Button */}
        <button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="w-full flex items-center justify-between p-3.5 bg-brand-50 border border-brand-200 hover:bg-brand-100 rounded-xl transition-all group text-left disabled:opacity-75"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Navigation className={`w-5 h-5 fill-current ${isDetecting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {isDetecting ? 'Detecting your address via GPS...' : 'Use Current Location'}
              </p>
              <p className="text-xs text-slate-500">
                Using device GPS & location services
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
            {isDetecting ? 'Detecting...' : 'Detect'}
          </span>
        </button>

        {/* Detection Error message if permission denied or unavailable */}
        {detectionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2 animate-fade-in">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{detectionError}</span>
          </div>
        )}

        {/* Manual Address Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Area or Street
          </label>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. 5th Block, Koramangala"
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <Button type="submit" size="sm">
              Apply
            </Button>
          </form>
        </div>

        {/* Popular Delivery Hotspots */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Popular Delivery Hubs
          </p>
          <div className="space-y-2">
            {POPULAR_LOCATIONS.map((loc, idx) => {
              const isSelected = location.address === loc.address;
              return (
                <button
                  key={idx}
                  onClick={() => setLocationManually(loc)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-brand-500' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-brand-600' : 'text-slate-800'}`}>
                        {loc.address}
                      </p>
                      <p className="text-xs text-slate-400">{loc.city}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
