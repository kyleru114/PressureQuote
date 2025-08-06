export interface PlaceDetails {
  address: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

// Function to load Google Maps API dynamically
export function loadGoogleMapsAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error('Google Maps API key not found'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    
    document.head.appendChild(script);
  });
}

export function initializeGooglePlaces(inputId: string, onPlaceSelected: (place: PlaceDetails) => void) {
  if (!window.google?.maps?.places) {
    console.error('Google Places API not loaded');
    return null;
  }

  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) {
    console.error('Input element not found');
    return null;
  }

  const autocomplete = new window.google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: 'US' },
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      console.error('No location data available for this place');
      return;
    }

    const placeDetails: PlaceDetails = {
      address: place.formatted_address || place.name || '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    onPlaceSelected(placeDetails);
  });

  return autocomplete;
}

// Function to check if Google Places API is ready
export function isGooglePlacesReady(): Promise<boolean> {
  return new Promise((resolve) => {
    const checkReady = () => {
      if (window.google?.maps?.places) {
        resolve(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });
}
