import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, MapPin } from 'lucide-react';
import { initializeGooglePlaces, isGooglePlacesReady, loadGoogleMapsAPI, type PlaceDetails } from '@/lib/google-places';

interface AddressInputProps {
  onAddressSelected: (place: PlaceDetails) => void;
  onLoadMap: () => void;
}

export default function AddressInput({ onAddressSelected, onLoadMap }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const setupGooglePlaces = async () => {
      try {
        await loadGoogleMapsAPI();
        await isGooglePlacesReady();
        
        autocompleteRef.current = initializeGooglePlaces('address-input', (place: PlaceDetails) => {
          setSelectedPlace(place);
          setAddress(place.address);
          onAddressSelected(place);
        });
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    setupGooglePlaces();
  }, [onAddressSelected]);

  const handleLoadMap = () => {
    if (!address.trim()) {
      alert('Please enter an address first');
      return;
    }
    onLoadMap();
  };

  return (
    <div className="bg-white rounded-2xl vintage-shadow p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: 'var(--nebraska-red)' }}>
          1
        </div>
        <h3 className="text-lg font-semibold brand-text" style={{ color: 'var(--nebraska-black)' }}>Enter Your Address</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="address-input" className="block text-sm font-medium brand-text mb-2" style={{ color: 'var(--nebraska-black)' }}>
            Property Address
          </Label>
          <div className="relative">
            <Input
              id="address-input"
              type="text"
              placeholder="Start typing your Nebraska address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border-2"
              style={{ borderColor: '#E5E7EB', fontFamily: 'Poppins' }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MapPin className="w-5 h-5" style={{ color: 'var(--nebraska-red)' }} />
            </div>
          </div>
          <p className="text-xs mt-1 brand-text" style={{ color: '#6B7280' }}>We'll show you a satellite view of your property</p>
        </div>
        
        <button 
          onClick={handleLoadMap}
          className="btn-nebraska w-full flex items-center justify-center space-x-2"
        >
          <span>Load Map</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
