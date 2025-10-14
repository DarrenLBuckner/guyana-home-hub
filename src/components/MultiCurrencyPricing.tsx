'use client';

import { useState, useEffect } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

interface PricingTier {
  name: string;
  description: string;
  basePrice: number; // USD base price
  properties: number;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonStyle: string;
}

interface MultiCurrencyPricingProps {
  siteId?: string;
  defaultCurrency?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for trying out our platform',
    basePrice: 0,
    properties: 1,
    features: [
      '1 property listing',
      'Basic visibility',
      'Standard support',
      '3 photos per listing',
      'Email notifications'
    ],
    buttonText: 'Get Started Free',
    buttonStyle: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  },
  {
    name: 'Basic',
    description: 'Great for individual property owners',
    basePrice: 25,
    properties: 5,
    features: [
      '5 property listings',
      'Enhanced visibility',
      'Priority support',
      '10 photos per listing',
      'Email & SMS notifications',
      'Property analytics'
    ],
    buttonText: 'Choose Basic',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  {
    name: 'Premium',
    description: 'Best for growing real estate businesses',
    basePrice: 75,
    properties: 20,
    features: [
      '20 property listings',
      'Premium visibility',
      'Featured listings',
      'Unlimited photos',
      '24/7 support',
      'Advanced analytics',
      'Virtual tour integration'
    ],
    popular: true,
    buttonText: 'Choose Premium',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  {
    name: 'Platinum',
    description: 'For established real estate professionals',
    basePrice: 150,
    properties: 999,
    features: [
      'Unlimited property listings',
      'Maximum visibility',
      'Top featured spots',
      'Unlimited photos & videos',
      'Dedicated account manager',
      'Custom branding',
      'API access',
      'White-label options'
    ],
    buttonText: 'Choose Platinum',
    buttonStyle: 'bg-orange-600 text-white hover:bg-orange-700'
  }
];

export default function MultiCurrencyPricing({ siteId = 'guyana', defaultCurrency = 'GYD' }: MultiCurrencyPricingProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('/api/currency?action=currencies');
      const data = await response.json();
      
      if (data.success) {
        setCurrencies(data.currencies);
        setSelectedCurrency(defaultCurrency);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch currencies:', err);
      setError('Failed to load currency options');
      setLoading(false);
    }
  };

  const convertPrice = (usdPrice: number): { amount: number; symbol: string } => {
    if (usdPrice === 0) return { amount: 0, symbol: '' };
    
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency) return { amount: usdPrice, symbol: '$' };
    
    const convertedAmount = Math.round(usdPrice * currency.rate);
    return { amount: convertedAmount, symbol: currency.symbol };
  };

  const formatPrice = (usdPrice: number): string => {
    const { amount, symbol } = convertPrice(usdPrice);
    if (amount === 0) return 'Free';
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        <p className="text-gray-600 mt-2">Showing prices in GYD</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan - Guyana
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transparent pricing for Guyana's real estate market
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-lg">🇬🇾</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          
          <p className="text-sm text-gray-500">
            Prices automatically converted from USD • Updated weekly
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg shadow-sm border p-6 relative ${
                tier.popular ? 'border-2 border-blue-500 shadow-md' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(tier.basePrice)}
                  {tier.basePrice > 0 && (
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {tier.properties === 999 ? '∞' : tier.properties}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    {tier.properties === 1 ? 'property' : 'properties'}  
                  </span>
                </div>
                
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 text-sm">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${tier.buttonStyle}`}>
                {tier.buttonText}
              </button>
              
              {tier.basePrice > 0 && selectedCurrency !== 'USD' && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  ≈ ${tier.basePrice}/month USD
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            🇬🇾 Proudly serving Guyana's real estate community
          </p>
          <p className="text-sm text-gray-500">
            Part of the Portal Home Hub network - connecting the Global South
          </p>
        </div>
      </div>
    </section>
  );
}