import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { stripePromise } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Quote } from '@shared/schema';

const CheckoutForm = ({ quote }: { quote: Quote }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl vintage-shadow p-6">
        <h2 className="text-xl font-semibold brand-text mb-6" style={{ color: 'var(--nebraska-black)' }}>Complete Your Payment</h2>
        
        {/* Quote Summary */}
        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
          <h3 className="font-medium brand-text mb-3" style={{ color: 'var(--nebraska-black)' }}>Order Summary</h3>
          <div className="space-y-2 text-sm brand-text">
            <div className="flex justify-between" style={{ color: 'var(--nebraska-black)' }}>
              <span>Driveway Cleaning ({quote.area} sq ft)</span>
              <span>${quote.basePrice.toFixed(2)}</span>
            </div>
            {quote.addons && quote.addons.map((addon: any, index: number) => (
              <div key={index} className="flex justify-between" style={{ color: 'var(--nebraska-black)' }}>
                <span>{addon.name}</span>
                <span>${addon.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 flex justify-between font-semibold" style={{ borderTop: '1px solid var(--nebraska-red)' }}>
              <span style={{ color: 'var(--nebraska-black)' }}>Total</span>
              <span style={{ color: 'var(--nebraska-red)' }}>${quote.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="btn-nebraska w-full py-3 font-bold"
          >
            {isProcessing ? 'Processing...' : `Pay $${quote.totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [match, params] = useRoute('/checkout/:quoteId');
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");

  const { data: quote, isLoading, error } = useQuery<Quote>({
    queryKey: ['/api/quotes', params?.quoteId],
    enabled: !!params?.quoteId,
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async ({ amount, quoteId }: { amount: number; quoteId: string }) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { amount, quoteId });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: () => {
      useToast().toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (quote && !clientSecret) {
      createPaymentIntentMutation.mutate({
        amount: quote.totalPrice,
        quoteId: quote.id,
      });
    }
  }, [quote, clientSecret]);

  if (!match) {
    setLocation('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--nebraska-red)', borderTopColor: 'transparent' }} />
          <p className="brand-text" style={{ color: 'var(--nebraska-black)' }}>Loading your quote...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="text-center">
          <p className="brand-text mb-4" style={{ color: 'var(--nebraska-black)' }}>Quote not found</p>
          <button onClick={() => setLocation('/')} className="btn-nebraska flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4 animate-spin" style={{ borderColor: 'var(--nebraska-red)', borderTopColor: 'transparent' }} />
          <p className="brand-text" style={{ color: 'var(--nebraska-black)' }}>Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
      {/* Header */}
      <header className="vintage-shadow sticky top-0 z-50" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium brand-text transition-colors hover:opacity-75"
              style={{ color: 'var(--nebraska-red)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <img src="/logo_64.png" alt="Nebraska Pressure Washing" className="h-8 w-auto" />
              <h1 className="text-lg font-semibold brand-text" style={{ color: 'var(--nebraska-black)' }}>Secure Checkout</h1>
            </div>
            <div></div>
          </div>
        </div>
        <div className="vintage-divider"></div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm quote={quote} />
        </Elements>
      </main>
    </div>
  );
}
