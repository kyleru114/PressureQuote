import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import StepIndicator from '@/components/step-indicator';
import AddressInput from '@/components/address-input';
import MapSection from '@/components/map-section';
import QuoteSection from '@/components/quote-section';
import { Phone, Check } from 'lucide-react';
import type { PlaceDetails } from '@/lib/google-places';
import type { Quote } from '@shared/schema';

const STEPS = ['Address', 'Draw Area', 'Quote', 'Payment'];

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [drawnPolygon, setDrawnPolygon] = useState<[number, number][]>([]);

  const createQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const response = await apiRequest('POST', '/api/quotes', quoteData);
      return response.json();
    },
    onSuccess: (quote: Quote) => {
      setLocation(`/checkout/${quote.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddressSelected = (place: PlaceDetails) => {
    setSelectedPlace(place);
  };

  const handleLoadMap = () => {
    if (!selectedPlace) return;
    setCurrentStep(2);
  };

  const handleAreaCalculated = (area: number, polygon: [number, number][]) => {
    setCalculatedArea(area);
    setDrawnPolygon(polygon);
  };

  const handleContinueToQuote = () => {
    if (calculatedArea === 0) return;
    setCurrentStep(3);
  };

  const handlePayNow = (email: string, totalPrice: number, selectedAddons: any[]) => {
    if (!selectedPlace || calculatedArea === 0) return;

    const quoteData = {
      email,
      address: selectedPlace.address,
      area: calculatedArea,
      basePrice: calculatedArea * 0.35,
      addons: selectedAddons,
      totalPrice,
      polygon: drawnPolygon,
    };

    createQuoteMutation.mutate(quoteData);
  };

  return (
    <div className="min-h-screen font-poppins" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
      {/* Header */}
      <header className="vintage-shadow sticky top-0 z-50" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="header-responsive flex items-center justify-between">
            <div className="header-left flex-1"></div>
            <div className="header-center flex items-center justify-center flex-1">
              <img 
                src="/logo_cropped.png" 
                alt="Nebraska Pressure Washing Logo" 
                className="header-logo w-auto"
              />
            </div>
            <div className="header-right flex-1 flex justify-end">
              <div className="text-right">
                <p className="header-call-text font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>Call Now</p>
                <p className="header-phone font-bold brand-text whitespace-nowrap" style={{ color: 'var(--nebraska-red)' }}>(402) 555-WASH</p>
              </div>
            </div>
          </div>
        </div>
        <div className="vintage-divider"></div>
      </header>

      {/* Progress Steps */}
      <StepIndicator currentStep={currentStep} totalSteps={4} steps={STEPS} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Welcome Section */}
        {currentStep === 1 && (
          <div className="vintage-shadow rounded-2xl p-8 text-white" style={{ 
            background: 'linear-gradient(135deg, var(--nebraska-red) 0%, #C71732 100%)' 
          }}>
            <h2 className="brand-header text-3xl font-bold mb-3 text-white">Get Your Instant Quote</h2>
            <p className="mb-6 text-red-100 brand-text">Professional pressure washing for your driveway in Nebraska. Just enter your address, draw your area, and get an instant quote!</p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-white" />
                <span className="brand-text font-semibold">$0.35/sq ft</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-white" />
                <span className="brand-text font-semibold">Same Day Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-white" />
                <span className="brand-text font-semibold">Fully Insured</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Address Input */}
        {currentStep === 1 && (
          <AddressInput 
            onAddressSelected={handleAddressSelected}
            onLoadMap={handleLoadMap}
          />
        )}

        {/* Step 2: Map and Drawing */}
        {currentStep === 2 && selectedPlace && (
          <MapSection 
            place={selectedPlace}
            onAreaCalculated={handleAreaCalculated}
            onContinue={handleContinueToQuote}
          />
        )}

        {/* Step 3: Quote Display */}
        {currentStep === 3 && (
          <QuoteSection 
            area={calculatedArea}
            onPayNow={handlePayNow}
          />
        )}

        {/* Loading State */}
        {createQuoteMutation.isPending && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="text-center py-8">
              <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Creating your quote...</p>
              <p className="text-sm text-slate-500 mt-1">Please wait while we prepare your checkout</p>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--nebraska-black)' }} className="text-white mt-12">
        <div className="vintage-divider"></div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <img src="/logo_64.png" alt="Nebraska Pressure Washing" className="h-8 w-auto mr-3" />
                <h4 className="brand-header text-lg" style={{ color: 'var(--nebraska-red)' }}>Nebraska Pressure Washing</h4>
              </div>
              <p className="text-sm text-gray-400 brand-text">Professional pressure washing services for residential and commercial properties throughout Nebraska.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 brand-text">Contact</h4>
              <div className="text-sm text-gray-400 space-y-1 brand-text">
                <p>(402) 555-WASH</p>
                <p>info@nebraska-pressure-washing.com</p>
                <p>Available 7 days a week</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 brand-text">Service Areas</h4>
              <div className="text-sm text-gray-400 space-y-1 brand-text">
                <p>Omaha & Lincoln</p>
                <p>Grand Island & Kearney</p>
                <p>Same-day service available</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Nebraska Pressure Washing. All rights reserved. Licensed & Insured.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
