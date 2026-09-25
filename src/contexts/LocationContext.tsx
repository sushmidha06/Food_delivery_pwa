import React, { createContext, useContext, useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { UserLocation } from '../types';

interface LocationContextType {
  location: UserLocation;
  isDetecting: boolean;
  detectionError: string | null;
  locationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  detectCurrentLocation: () => Promise<boolean>;
  setLocationManually: (loc: UserLocation) => void;
  clearDetectionError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION: UserLocation = {
  address: 'Indiranagar 100 Feet Rd, 12th Main',
  city: 'Bangalore',
  latitude: 12.9716,
  longitude: 77.5946,
};

const LOCATION_STORAGE_KEY = 'zestora_user_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (e) {
      console.error(e);
    }
  }, [location]);

  const reverseGeocode = async (lat: number, lng: number): Promise<{ address: string; city: string }> => {
    try {
      // 1. Try BigDataCloud reverse geocode client (fast, no API key, CORS-friendly)
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Detected Area';
        const locality = data.locality || '';
        const suburb = data.localityInfo?.administrative?.find((a: any) => a.order >= 6)?.name || '';
        const street = locality && locality !== city ? locality : suburb;
        const main = street ? `${street}, ${city}` : city;
        const fullAddress = data.postcode ? `${main} - ${data.postcode}` : main;
        return {
          address: fullAddress,
          city: city,
        };
      }
    } catch (e) {
      console.warn('BigDataCloud reverse geocode failed, attempting OpenStreetMap:', e);
    }

    try {
      // 2. Fallback to OpenStreetMap Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.suburb || addr.neighbourhood || addr.residential || '';
        const city = addr.city || addr.town || addr.village || addr.county || 'Detected Area';
        const full = road ? `${road}, ${city}` : (data.display_name?.split(',').slice(0, 2).join(',') || city);
        return {
          address: full,
          city: city,
        };
      }
    } catch (e) {
      console.warn('Nominatim reverse geocode failed:', e);
    }

    return {
      address: `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: 'Current Location',
    };
  };

  const getCoordinates = async (): Promise<{ lat: number; lng: number }> => {
    // 1. Try Native Capacitor Geolocation first
    try {
      const permCheck = await Geolocation.checkPermissions();
      if (permCheck.location !== 'granted') {
        const permReq = await Geolocation.requestPermissions();
        if (permReq.location !== 'granted') {
          throw new Error('Location permission denied. Please allow location access in your device settings.');
        }
      }

      // Try high accuracy
      try {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 6000,
        });
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {
        // Fallback to low accuracy native
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 6000,
        });
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      }
    } catch (nativeErr: any) {
      if (nativeErr?.message?.includes('permission denied')) {
        throw nativeErr;
      }
      // If native not available or in browser environment, proceed to browser Geolocation
    }

    // 2. Browser HTML5 Geolocation
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {
            // Fallback to low accuracy if high accuracy timed out or failed
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              (fallbackErr) => {
                if (fallbackErr.code === fallbackErr.PERMISSION_DENIED) {
                  reject(new Error('Location permission denied. Please enable location access in your browser or device.'));
                } else if (fallbackErr.code === fallbackErr.POSITION_UNAVAILABLE) {
                  reject(new Error('GPS location unavailable. Please check your network/device location or select an area below.'));
                } else {
                  reject(new Error('Location request timed out. Please select an area below or try again.'));
                }
              },
              { enableHighAccuracy: false, timeout: 8000 }
            );
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      });
    }

    throw new Error('Geolocation is not supported by your current browser or device.');
  };

  const detectCurrentLocation = async (): Promise<boolean> => {
    setIsDetecting(true);
    setDetectionError(null);

    try {
      const { lat, lng } = await getCoordinates();
      const { address, city } = await reverseGeocode(lat, lng);

      const detectedLocation: UserLocation = {
        address,
        city,
        latitude: lat,
        longitude: lng,
      };

      setLocation(detectedLocation);
      setLocationModalOpen(false);
      return true;
    } catch (err: any) {
      console.warn('Geolocation detection error:', err);
      setDetectionError(err?.message || 'Could not detect your current location. Please select an area below.');
      return false;
    } finally {
      setIsDetecting(false);
    }
  };

  const setLocationManually = (newLoc: UserLocation) => {
    setLocation(newLoc);
    setDetectionError(null);
    setLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        detectionError,
        locationModalOpen,
        openLocationModal: () => {
          setDetectionError(null);
          setLocationModalOpen(true);
        },
        closeLocationModal: () => {
          setDetectionError(null);
          setLocationModalOpen(false);
        },
        detectCurrentLocation,
        setLocationManually,
        clearDetectionError: () => setDetectionError(null),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
