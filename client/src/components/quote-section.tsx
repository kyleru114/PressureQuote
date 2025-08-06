import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Shield, CheckCircle } from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface QuoteSectionProps {
  area: number;
  onPayNow: (email: string, totalPrice: number, selectedAddons: Addon[]) => void;
}

const ADDONS: Addon[] = [
  {
    id: 'patio',
    name: 'Patio Cleaning',
    description: 'Deep clean your patio surfaces',
    price: 75,
  },
  {
    id: 'sidewalk',
    name: 'Sidewalk Cleaning',
    description: 'Clean walkways and sidewalks',
    price: 50,
  },
  {
    id: 'sealing',
    name: 'Driveway Sealing',
    description: 'Protect with premium sealant',
    price: 150,
  },
];

export default function QuoteSection({ area, onPayNow }: QuoteSectionProps) {
  const [email, setEmail] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const basePrice = area * 0.35;
  const addonTotal = selectedAddons.reduce((total, addonId) => {
    const addon = ADDONS.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);
  const totalPrice = basePrice + addonTotal;

  const handleAddonChange = (addonId: string, checked: boolean) => {
    setSelectedAddons(prev => 
      checked 
        ? [...prev, addonId]
        : prev.filter(id => id !== addonId)
    );
  };

  const handlePayNow = () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    const addonsData = ADDONS.filter(addon => selectedAddons.includes(addon.id));
    onPayNow(email, totalPrice, addonsData);
  };

  return (
    <div className="bg-white rounded-2xl vintage-shadow p-6 quote-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: 'var(--nebraska-red)' }}>
          3
        </div>
        <h3 className="text-lg font-semibold brand-text" style={{ color: 'var(--nebraska-black)' }}>Your Quote</h3>
      </div>
      
      {/* Quote Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--nebraska-bg)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>Driveway Pressure Washing</span>
            <span className="font-semibold brand-text" style={{ color: 'var(--nebraska-red)' }}>${basePrice.toFixed(2)}</span>
          </div>
          <div className="text-sm space-y-1 brand-text" style={{ color: '#6B7280' }}>
            <div className="flex justify-between">
              <span>{area.toLocaleString()} sq ft</span>
              <span>× $0.35/sq ft</span>
            </div>
          </div>
        </div>
        
        {/* Add-ons */}
        <div className="space-y-3">
          <h4 className="font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>Optional Add-ons</h4>
          
          {ADDONS.map((addon) => (
            <label 
              key={addon.id}
              className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200"
              style={{ 
                borderColor: selectedAddons.includes(addon.id) ? 'var(--nebraska-red)' : '#E5E7EB',
                backgroundColor: selectedAddons.includes(addon.id) ? '#FEF2F2' : 'white'
              }}
            >
              <Checkbox
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={(checked) => handleAddonChange(addon.id, checked as boolean)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium brand-text" style={{ color: 'var(--nebraska-black)' }}>{addon.name}</span>
                  <span className="font-semibold brand-text" style={{ color: 'var(--nebraska-red)' }}>+${addon.price}</span>
                </div>
                <p className="text-sm brand-text" style={{ color: '#6B7280' }}>{addon.description}</p>
              </div>
            </label>
          ))}
        </div>
        
        {/* Total */}
        <div className="pt-4" style={{ borderTop: '2px solid var(--nebraska-red)' }}>
          <div className="flex items-center justify-between text-xl font-bold brand-text">
            <span style={{ color: 'var(--nebraska-black)' }}>Total:</span>
            <span style={{ color: 'var(--nebraska-red)' }}>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Email Input */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="email-input" className="block text-sm font-medium brand-text mb-2" style={{ color: 'var(--nebraska-black)' }}>
            Email Address
          </Label>
          <Input
            id="email-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2"
            style={{ borderColor: '#E5E7EB', fontFamily: 'Poppins' }}
            required
          />
          <p className="text-xs mt-1 brand-text" style={{ color: '#6B7280' }}>We'll send you a copy of your quote</p>
        </div>
        
        <button 
          onClick={handlePayNow}
          className="btn-nebraska w-full py-4 text-lg font-bold flex items-center justify-center space-x-2"
        >
          <Lock className="w-6 h-6" />
          <span>Pay Now - Secure Checkout</span>
        </button>
        
        <div className="flex items-center justify-center space-x-4 text-xs brand-text" style={{ color: '#6B7280' }}>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
