// Payment Types and Service Definitions
// src/types/payment.ts

export interface PaymentProvider {
  id: string
  name: string
  type: 'card' | 'wallet' | 'bank' | 'cash' | 'crypto'
  regions: string[]
  currencies: string[]
  processingFee: number
  settlementTime: string // e.g., "instant", "1-2 days", "3-5 days"
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  amountGYD: number // Always convert to GYD for internal processing
  provider: string
  region: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  metadata: {
    propertyId?: string
    agentId?: string
    listingType?: 'property' | 'agent_subscription' | 'promotion'
    customerId: string
    invoiceNumber: string
  }
  paymentMethodDetails?: {
    type: string
    last4?: string
    brand?: string
    wallet?: string
  }
  createdAt: string
  completedAt?: string
}

export interface ExchangeRates {
  USD_GYD: number
  CAD_GYD: number
  GBP_GYD: number
  EUR_GYD: number
  updatedAt: string
}

export interface PaymentRegionConfig {
  code: string
  name: string
  currency: string
  symbol: string
  taxRate: number
  availableProviders: string[]
  defaultProvider: string
  requiresVerification: boolean
  localBankingInfo?: {
    accountName: string
    accountNumber: string
    bankName: string
    routingCode: string
    instructions: string
  }
  cashOfficeInfo?: {
    address: string
    hours: string
    phone: string
    instructions: string
  }
}

// Payment Service Configuration
export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'stripe_international',
    name: 'Credit/Debit Card (Stripe)',
    type: 'card',
    regions: ['us', 'canada', 'uk', 'eu', 'international'],
    currencies: ['USD', 'CAD', 'GBP', 'EUR'],
    processingFee: 0.029, // 2.9% + 30¢
    settlementTime: '1-2 days'
  },
  {
    id: 'stripe_local',
    name: 'Local Card Payment',
    type: 'card', 
    regions: ['guyana'],
    currencies: ['GYD'],
    processingFee: 0.035, // Higher for local processing
    settlementTime: '2-3 days'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'wallet',
    regions: ['us', 'canada', 'uk', 'eu'],
    currencies: ['USD', 'CAD', 'GBP', 'EUR'],
    processingFee: 0.034, // 3.4% + fixed fee
    settlementTime: 'instant'
  },
  {
    id: 'mmg',
    name: 'Mobile Money Guyana',
    type: 'wallet',
    regions: ['guyana'],
    currencies: ['GYD'],
    processingFee: 0.02, // 2%
    settlementTime: 'instant'
  },
  {
    id: 'bank_transfer_gy',
    name: 'Local Bank Transfer',
    type: 'bank',
    regions: ['guyana'],
    currencies: ['GYD'],
    processingFee: 0.015, // 1.5%
    settlementTime: '1-2 days'
  },
  {
    id: 'cash_office',
    name: 'Cash at Office',
    type: 'cash',
    regions: ['guyana'],
    currencies: ['GYD'],
    processingFee: 0, // No fee for cash
    settlementTime: 'instant'
  }
]

export const PAYMENT_REGIONS: PaymentRegionConfig[] = [
  {
    code: 'guyana',
    name: 'Guyana',
    currency: 'GYD',
    symbol: 'G$',
    taxRate: 0.16, // 16% VAT
    availableProviders: ['mmg', 'cash_office', 'bank_transfer_gy', 'stripe_local'],
    defaultProvider: 'mmg',
    requiresVerification: false,
    localBankingInfo: {
      accountName: 'Guyana Home Hub Ltd.',
      accountNumber: '1234567890',
      bankName: 'Republic Bank Guyana Limited',
      routingCode: 'RBGY',
      instructions: 'Include your booking reference in the transfer description'
    },
    cashOfficeInfo: {
      address: '123 Main Street, Georgetown, Guyana',
      hours: 'Monday-Friday 9:00 AM - 5:00 PM',
      phone: '+592-123-4567',
      instructions: 'Bring valid ID and booking reference number'
    }
  },
  {
    code: 'us',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    taxRate: 0, // Varies by state, handle separately
    availableProviders: ['stripe_international', 'paypal'],
    defaultProvider: 'stripe_international',
    requiresVerification: true
  },
  {
    code: 'canada',
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    taxRate: 0.13, // Average HST/GST
    availableProviders: ['stripe_international', 'paypal'],
    defaultProvider: 'stripe_international',
    requiresVerification: true
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    taxRate: 0.20, // 20% VAT
    availableProviders: ['stripe_international', 'paypal'],
    defaultProvider: 'stripe_international',
    requiresVerification: true
  }
]
