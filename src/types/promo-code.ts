// Promo Code System Types
// src/types/promo-code.ts

export interface PromoCode {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed' | 'free_trial'
  discount_value: number
  applies_to: 'basic' | 'pro' | 'elite' | 'all'
  trial_duration_days: number
  max_uses: number | null
  current_uses: number
  active: boolean
  created_at: string
  expires_at: string | null
  created_by: string | null
}

export interface PromoCodeUsage {
  id: string
  promo_code_id: string
  user_id: string
  email: string
  used_at: string
  agent_tier: 'basic' | 'pro' | 'elite'
  trial_start_date: string | null
  trial_end_date: string | null
  status: 'active' | 'expired' | 'cancelled' | 'converted'
}

export interface AgentSubscription {
  id: string
  user_id: string
  email: string
  tier: 'basic' | 'pro' | 'elite'
  status: 'trial' | 'active' | 'suspended' | 'cancelled'
  trial_start_date: string | null
  trial_end_date: string | null
  next_billing_date: string | null
  promo_code_used: string | null
  created_at: string
  updated_at: string
}

export interface PromoCodeValidationResult {
  valid: boolean
  error?: string
  code?: string
  description?: string
  discount_type?: 'percentage' | 'fixed' | 'free_trial'
  discount_value?: number
  applies_to?: 'basic' | 'pro' | 'elite' | 'all'
  trial_duration_days?: number
}

export interface PromoCodeApplicationResult {
  valid: boolean
  applied: boolean
  error?: string
  trial_end_date?: string
  discount_type?: 'percentage' | 'fixed' | 'free_trial'
  discount_value?: number
}

export interface AgentTierPricing {
  tier: 'basic' | 'pro' | 'elite'
  name: string
  price: number
  currency: string
  features: string[]
  max_listings: number | 'unlimited'
  max_photos: number
  description: string
}

// Agent pricing configuration
export const AGENT_PRICING: Record<string, AgentTierPricing> = {
  basic: {
    tier: 'basic',
    name: 'Basic Agent',
    price: 6000,
    currency: 'G$',
    features: [
      '5 active listings',
      '8 photos per property',
      'Basic support',
      'Property management tools',
      'Lead capture forms'
    ],
    max_listings: 5,
    max_photos: 8,
    description: 'Perfect for new agents getting started'
  },
  pro: {
    tier: 'pro',
    name: 'Pro Agent',
    price: 11000,
    currency: 'G$',
    features: [
      '20 active listings',
      '15 photos per property',
      'Priority support',
      'Advanced analytics',
      'CRM integration',
      'Featured listing options'
    ],
    max_listings: 20,
    max_photos: 15,
    description: 'Ideal for established agents'
  },
  elite: {
    tier: 'elite',
    name: 'Elite Agent',
    price: 25000,
    currency: 'G$',
    features: [
      'Unlimited listings*',
      '20 photos per property',
      'Premium support',
      'Advanced analytics',
      'CRM integration',
      'Featured listings',
      'Custom branding',
      'Priority placement'
    ],
    max_listings: 'unlimited',
    max_photos: 20,
    description: 'For top-performing agents and teams'
  }
}

// Trial status helpers
export interface TrialStatus {
  isInTrial: boolean
  daysRemaining: number
  trialEndDate: string | null
  status: 'active' | 'expiring_soon' | 'expired'
  needsPayment: boolean
}

export interface PromoCodeFormData {
  code: string
  selectedTier: 'basic' | 'pro' | 'elite'
}

// Admin dashboard types
export interface AdminPromoCodeStats {
  total_codes: number
  active_codes: number
  total_uses: number
  most_popular_code: string
  codes_expiring_soon: PromoCode[]
}

export interface AdminTrialAlert {
  user_id: string
  email: string
  tier: string
  days_remaining: number
  trial_end_date: string
  status: 'expiring_soon' | 'expired' | 'grace_period'
}
