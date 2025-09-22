'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Building2, MapPin, DollarSign } from 'lucide-react'

interface PaymentRegion {
  code: string
  name: string
  currency: string
  symbol: string
  methods: PaymentMethod[]
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingFee: number
  availability: string[]
  isRecommended?: boolean
}

export default function MultiRegionPayment() {
  const [selectedRegion, setSelectedRegion] = useState<string>('guyana')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [convertedAmount, setConvertedAmount] = useState<number>(0)

  const paymentRegions: PaymentRegion[] = [
    {
      code: 'guyana',
      name: 'Guyana',
      currency: 'GYD',
      symbol: 'G$',
      methods: [
        {
          id: 'mmg',
          name: 'Mobile Money Guyana (MMG)',
          icon: <Smartphone className="h-5 w-5" />,
          description: 'Pay with your MMG mobile wallet',
          processingFee: 0.02, // 2%
          availability: ['guyana'],
          isRecommended: true
        },
        {
          id: 'cash_office',
          name: 'Cash at Office',
          icon: <Building2 className="h-5 w-5" />,
          description: 'Pay cash at our Georgetown office',
          processingFee: 0,
          availability: ['guyana']
        },
        {
          id: 'bank_transfer',
          name: 'Local Bank Transfer',
          icon: <Building2 className="h-5 w-5" />,
          description: 'Republic Bank, GBTI, or other local banks',
          processingFee: 0.015, // 1.5%
          availability: ['guyana']
        },
        {
          id: 'stripe_local',
          name: 'Credit/Debit Card',
          icon: <CreditCard className="h-5 w-5" />,
          description: 'Visa, Mastercard (local or international)',
          processingFee: 0.029, // 2.9%
          availability: ['guyana', 'international']
        }
      ]
    },
    {
      code: 'us',
      name: 'United States',
      currency: 'USD',
      symbol: '$',
      methods: [
        {
          id: 'stripe_us',
          name: 'Credit/Debit Card',
          icon: <CreditCard className="h-5 w-5" />,
          description: 'Visa, Mastercard, American Express',
          processingFee: 0.029,
          availability: ['us', 'international'],
          isRecommended: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          icon: <DollarSign className="h-5 w-5" />,
          description: 'Pay with PayPal account or card',
          processingFee: 0.034, // 3.4%
          availability: ['us', 'canada', 'uk', 'international']
        }
      ]
    },
    {
      code: 'canada',
      name: 'Canada',
      currency: 'CAD',
      symbol: 'C$',
      methods: [
        {
          id: 'stripe_ca',
          name: 'Credit/Debit Card',
          icon: <CreditCard className="h-5 w-5" />,
          description: 'Visa, Mastercard, Interac',
          processingFee: 0.029,
          availability: ['canada', 'international'],
          isRecommended: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          icon: <DollarSign className="h-5 w-5" />,
          description: 'Pay with PayPal account',
          processingFee: 0.034,
          availability: ['us', 'canada', 'uk', 'international']
        }
      ]
    },
    {
      code: 'uk',
      name: 'United Kingdom',
      currency: 'GBP',
      symbol: '£',
      methods: [
        {
          id: 'stripe_uk',
          name: 'Credit/Debit Card',
          icon: <CreditCard className="h-5 w-5" />,
          description: 'Visa, Mastercard, UK bank cards',
          processingFee: 0.029,
          availability: ['uk', 'international'],
          isRecommended: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          icon: <DollarSign className="h-5 w-5" />,
          description: 'Pay with PayPal account',
          processingFee: 0.034,
          availability: ['us', 'canada', 'uk', 'international']
        }
      ]
    }
  ]

  // Mock exchange rates (in production, fetch from API)
  const exchangeRates = {
    'USD_GYD': 210.50,
    'CAD_GYD': 155.75,
    'GBP_GYD': 267.80,
    'GYD_GYD': 1.00
  }

  const getCurrentRegion = () => {
    return paymentRegions.find(region => region.code === selectedRegion) || paymentRegions[0]
  }

  const calculateConversion = (amount: number, fromCurrency: string) => {
    if (fromCurrency === 'GYD') return amount
    const rate = exchangeRates[`${fromCurrency}_GYD` as keyof typeof exchangeRates] || 1
    return amount * rate
  }

  const formatCurrency = (amount: number, currency: string, symbol: string) => {
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === 'GYD' ? 0 : 2 
    })}`
  }

  useEffect(() => {
    const region = getCurrentRegion()
    const converted = calculateConversion(amount, region.currency)
    setConvertedAmount(converted)
  }, [amount, selectedRegion])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Options</h2>

      {/* Region Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Select Your Location
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentRegions.map(region => (
            <button
              key={region.code}
              onClick={() => setSelectedRegion(region.code)}
              className={`p-3 rounded-lg border text-center ${
                selectedRegion === region.code
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{region.name}</div>
              <div className="text-xs text-gray-500">{region.currency}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Pay
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{getCurrentRegion().symbol}</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>
        {selectedRegion !== 'guyana' && amount > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Equivalent: {formatCurrency(convertedAmount, 'GYD', 'G$')} GYD
          </p>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Payment Method
        </label>
        <div className="space-y-3">
          {getCurrentRegion().methods.map(method => {
            const totalAmount = amount + (amount * method.processingFee)
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${method.isRecommended ? 'ring-2 ring-green-200' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-600">{method.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        {method.name}
                        {method.isRecommended && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {method.processingFee > 0 && (
                      <div className="text-sm text-gray-500">
                        +{(method.processingFee * 100).toFixed(1)}% fee
                      </div>
                    )}
                    {amount > 0 && (
                      <div className="font-medium">
                        {formatCurrency(totalAmount, getCurrentRegion().currency, getCurrentRegion().symbol)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Special Instructions for Guyana */}
      {selectedRegion === 'guyana' && selectedMethod === 'cash_office' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Cash Payment Instructions</h4>
          <p className="text-sm text-blue-800">
            Visit our Georgetown office at [Address] during business hours (Mon-Fri 9AM-5PM).
            Bring your booking reference number for faster processing.
          </p>
        </div>
      )}

      {/* Processing Fee Notice */}
      {amount > 0 && selectedMethod && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(amount, getCurrentRegion().currency, getCurrentRegion().symbol)}</span>
            </div>
            {getCurrentRegion().methods.find(m => m.id === selectedMethod)?.processingFee! > 0 && (
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>{formatCurrency(amount * getCurrentRegion().methods.find(m => m.id === selectedMethod)!.processingFee, getCurrentRegion().currency, getCurrentRegion().symbol)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-1 border-t">
              <span>Total:</span>
              <span>{formatCurrency(amount + (amount * (getCurrentRegion().methods.find(m => m.id === selectedMethod)?.processingFee || 0)), getCurrentRegion().currency, getCurrentRegion().symbol)}</span>
            </div>
            {selectedRegion !== 'guyana' && (
              <div className="flex justify-between text-gray-600">
                <span>Equivalent in GYD:</span>
                <span>{formatCurrency(convertedAmount + (convertedAmount * (getCurrentRegion().methods.find(m => m.id === selectedMethod)?.processingFee || 0)), 'GYD', 'G$')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        disabled={!selectedMethod || amount <= 0}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue to Payment
      </button>
    </div>
  )
}
