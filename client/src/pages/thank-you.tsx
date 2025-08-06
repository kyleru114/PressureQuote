import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone } from 'lucide-react';

export default function ThankYou() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Add any analytics tracking here
    console.log('Payment successful - thank you page loaded');
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
      {/* Header */}
      <header className="vintage-shadow" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src="/logo_256.png" 
              alt="Nebraska Pressure Washing Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        <div className="vintage-divider"></div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl vintage-shadow p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--nebraska-red)' }}>
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold brand-text mb-4 brand-header" style={{ color: 'var(--nebraska-red)' }}>Payment Successful!</h1>
          <p className="brand-text mb-6" style={{ color: 'var(--nebraska-black)' }}>
            Thank you for choosing Nebraska Pressure Washing. We've received your payment and will contact you within 24 hours to schedule your service.
          </p>
          
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
            <h3 className="font-semibold brand-text mb-2" style={{ color: 'var(--nebraska-black)' }}>What happens next?</h3>
            <ol className="text-sm brand-text space-y-1 text-left" style={{ color: '#6B7280' }}>
              <li>1. You'll receive a confirmation email with your receipt</li>
              <li>2. Our team will call you within 24 hours to schedule</li>
              <li>3. We'll arrive on time with professional equipment</li>
              <li>4. Your driveway will be clean and protected</li>
            </ol>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm brand-text" style={{ color: '#6B7280' }}>
              Questions? Call us at{' '}
              <span className="font-semibold brand-text" style={{ color: 'var(--nebraska-red)' }}>(402) 555-WASH</span>
            </p>
            <button 
              onClick={() => setLocation('/')}
              className="btn-nebraska py-2 px-6"
            >
              Get Another Quote
            </button>
          </div>
        </div>
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
