// Promo Code Service - Secure validation and application
// src/lib/promo-code-service.ts

import { createClient } from '@supabase/supabase-js'
import { 
  PromoCodeValidationResult, 
  PromoCodeApplicationResult, 
  TrialStatus,
  AgentSubscription,
  PromoCode
} from '@/types/promo-code'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class PromoCodeService {
  
  /**
   * Validate a promo code without applying it
   */
  static async validatePromoCode(
    code: string, 
    userEmail: string, 
    userId: string
  ): Promise<PromoCodeValidationResult> {
    try {
      const { data, error } = await supabase
        .rpc('validate_promo_code', {
          code_input: code.toUpperCase().trim(),
          user_email: userEmail,
          user_id_input: userId
        })

      if (error) {
        console.error('Promo code validation error:', error)
        return { valid: false, error: 'Failed to validate promo code' }
      }

      return data as PromoCodeValidationResult
    } catch (error) {
      console.error('Promo code validation exception:', error)
      return { valid: false, error: 'Network error while validating promo code' }
    }
  }

  /**
   * Apply a promo code to a user's account
   */
  static async applyPromoCode(
    code: string,
    userId: string,
    userEmail: string,
    selectedTier: 'basic' | 'pro' | 'elite'
  ): Promise<PromoCodeApplicationResult> {
    try {
      const { data, error } = await supabase
        .rpc('apply_promo_code', {
          code_input: code.toUpperCase().trim(),
          user_id_input: userId,
          user_email_input: userEmail,
          selected_tier: selectedTier
        })

      if (error) {
        console.error('Promo code application error:', error)
        return { valid: false, applied: false, error: 'Failed to apply promo code' }
      }

      return data as PromoCodeApplicationResult
    } catch (error) {
      console.error('Promo code application exception:', error)
      return { valid: false, applied: false, error: 'Network error while applying promo code' }
    }
  }

  /**
   * Get user's current trial status
   */
  static async getTrialStatus(userId: string): Promise<TrialStatus | null> {
    try {
      const { data, error } = await supabase
        .from('agent_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        return null
      }

      const subscription = data as AgentSubscription
      
      if (!subscription.trial_end_date || subscription.status !== 'trial') {
        return {
          isInTrial: false,
          daysRemaining: 0,
          trialEndDate: null,
          status: 'expired',
          needsPayment: subscription.status === 'suspended'
        }
      }

      const trialEndDate = new Date(subscription.trial_end_date)
      const today = new Date()
      const daysRemaining = Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      let status: 'active' | 'expiring_soon' | 'expired' = 'active'
      if (daysRemaining <= 0) {
        status = 'expired'
      } else if (daysRemaining <= 5) {
        status = 'expiring_soon'
      }

      return {
        isInTrial: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        trialEndDate: subscription.trial_end_date,
        status,
        needsPayment: daysRemaining <= 0
      }
    } catch (error) {
      console.error('Trial status check error:', error)
      return null
    }
  }

  /**
   * Get user's subscription details
   */
  static async getUserSubscription(userId: string): Promise<AgentSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('agent_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return data as AgentSubscription
    } catch (error) {
      console.error('Subscription fetch error:', error)
      return null
    }
  }

  /**
   * Check if user can access tier features
   */
  static async canAccessTierFeatures(
    userId: string, 
    tier: 'basic' | 'pro' | 'elite'
  ): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      
      if (!subscription) return false
      
      // If they're in trial, they can access features
      if (subscription.status === 'trial') {
        const trialStatus = await this.getTrialStatus(userId)
        return trialStatus?.isInTrial || false
      }
      
      // If they're paying, check tier match
      if (subscription.status === 'active') {
        return subscription.tier === tier
      }
      
      return false
    } catch (error) {
      console.error('Tier access check error:', error)
      return false
    }
  }

  /**
   * Get active promo codes (for admin)
   */
  static async getActivePromoCodes(): Promise<PromoCode[]> {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Active promo codes fetch error:', error)
        return []
      }

      return data as PromoCode[]
    } catch (error) {
      console.error('Active promo codes fetch exception:', error)
      return []
    }
  }

  /**
   * Send trial expiration notification (called by cron job)
   */
  static async sendTrialExpirationNotifications(): Promise<void> {
    try {
      // Get users with trials expiring in 5 days or less
      const { data: expiringTrials, error } = await supabase
        .from('agent_subscriptions')
        .select('*')
        .eq('status', 'trial')
        .lte('trial_end_date', new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString())
        .gte('trial_end_date', new Date().toISOString())

      if (error) {
        console.error('Expiring trials fetch error:', error)
        return
      }

      // TODO: Implement email notifications
      // For now, just log the users who need notifications
      console.log('Users with expiring trials:', expiringTrials)
      
    } catch (error) {
      console.error('Trial notification error:', error)
    }
  }

  /**
   * Format promo code for display
   */
  static formatPromoCode(code: string): string {
    return code.toUpperCase().trim()
  }

  /**
   * Check if promo code format is valid
   */
  static isValidPromoCodeFormat(code: string): boolean {
    const trimmed = code.trim()
    return trimmed.length >= 4 && trimmed.length <= 50 && /^[A-Z0-9]+$/.test(trimmed.toUpperCase())
  }
}

// Utility functions for promo code calculations
export const PromoCodeUtils = {
  
  /**
   * Calculate discounted price
   */
  calculateDiscountedPrice(
    originalPrice: number,
    discountType: 'percentage' | 'fixed' | 'free_trial',
    discountValue: number
  ): number {
    switch (discountType) {
      case 'percentage':
        return Math.max(0, originalPrice * (1 - discountValue / 100))
      case 'fixed':
        return Math.max(0, originalPrice - discountValue)
      case 'free_trial':
        return 0 // Free during trial
      default:
        return originalPrice
    }
  },

  /**
   * Format trial period for display
   */
  formatTrialPeriod(days: number): string {
    if (days === 0) return 'No trial'
    if (days === 1) return '1 day'
    if (days < 30) return `${days} days`
    
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    
    if (months === 1 && remainingDays === 0) return '1 month'
    if (months === 2 && remainingDays === 0) return '2 months'
    if (remainingDays === 0) return `${months} months`
    
    return `${months} month${months > 1 ? 's' : ''} and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  },

  /**
   * Get trial urgency level
   */
  getTrialUrgency(daysRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysRemaining <= 0) return 'critical'
    if (daysRemaining <= 2) return 'high'
    if (daysRemaining <= 5) return 'medium'
    return 'low'
  }
}
