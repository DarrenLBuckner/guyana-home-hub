// Promo Code Input Component for Agent Registration
// src/components/PromoCodeInput.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { Tag, Check, X, Clock, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { PromoCodeService, PromoCodeUtils } from '@/lib/promo-code-service'
import { PromoCodeValidationResult } from '@/types/promo-code'
import { AGENT_PRICING } from '@/types/promo-code'

interface PromoCodeInputProps {
  selectedTier: 'basic' | 'pro' | 'elite'
  userEmail: string
  userId?: string
  onPromoCodeAppliedAction?: (result: PromoCodeValidationResult) => void
  onPromoCodeRemovedAction?: () => void
  className?: string
}

export function PromoCodeInput({
  selectedTier,
  userEmail,
  userId,
  onPromoCodeAppliedAction,
  onPromoCodeRemovedAction,
  className
}: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<PromoCodeValidationResult | null>(null)
  const [showInput, setShowInput] = useState(false)
  const [appliedCode, setAppliedCode] = useState<PromoCodeValidationResult | null>(null)

  const originalPrice = AGENT_PRICING[selectedTier].price
  const currency = AGENT_PRICING[selectedTier].currency

  // Reset when tier changes
  useEffect(() => {
    if (appliedCode && appliedCode.applies_to !== 'all' && appliedCode.applies_to !== selectedTier) {
      handleRemovePromoCode()
    }
  }, [selectedTier])

  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) return

    const trimmedCode = promoCode.trim().toUpperCase()

    if (!PromoCodeService.isValidPromoCodeFormat(trimmedCode)) {
      setValidationResult({ valid: false, error: 'Invalid promo code format' })
      return
    }

    setIsValidating(true)

    try {
      // Pass undefined for userId if not present
      const result = await PromoCodeService.validatePromoCode(
        trimmedCode,
        userEmail,
        userId || undefined
      )

      setValidationResult(result)

      if (result.valid) {
        // Check if code applies to selected tier
        if (result.applies_to !== 'all' && result.applies_to !== selectedTier) {
          setValidationResult({
            valid: false,
            error: `This code only applies to ${result.applies_to} tier agents`
          })
        } else {
          setAppliedCode(result)
          onPromoCodeAppliedAction?.(result)
        }
      }
    } catch (error) {
      setValidationResult({ valid: false, error: 'Network error. Please try again.' })
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemovePromoCode = () => {
    setPromoCode('')
    setValidationResult(null)
    setAppliedCode(null)
    setShowInput(false)
    onPromoCodeRemovedAction?.()
  }

  const calculateSavings = () => {
    if (!appliedCode) return { discountedPrice: originalPrice, savings: 0 }
    
    const discountedPrice = PromoCodeUtils.calculateDiscountedPrice(
      originalPrice,
      appliedCode.discount_type!,
      appliedCode.discount_value!
    )
    
    return {
      discountedPrice,
      savings: originalPrice - discountedPrice
    }
  }

  const { discountedPrice, savings } = calculateSavings()

  if (appliedCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Tag className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800">Promo Code Applied!</h4>
              <p className="text-sm text-green-700 mt-1">
                <strong>{appliedCode.code}</strong> - {appliedCode.description}
              </p>
              
              {appliedCode.discount_type === 'free_trial' && (
                <div className="mt-2 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {PromoCodeUtils.formatTrialPeriod(appliedCode.trial_duration_days!)} FREE
                  </span>
                </div>
              )}
              
              {appliedCode.discount_type !== 'free_trial' && savings > 0 && (
                <div className="mt-2">
                  <span className="text-lg font-bold text-green-800">
                    Save {currency}{savings.toLocaleString()}!
                  </span>
                  <span className="text-sm text-green-600 ml-2">
                    ({currency}{discountedPrice.toLocaleString()} instead of {currency}{originalPrice.toLocaleString()})
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemovePromoCode}
            className="text-green-700 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {!showInput ? (
        <Button
          variant="outline"
          onClick={() => setShowInput(true)}
          className="w-full border-dashed border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600"
        >
          <Tag className="h-4 w-4 mr-2" />
          Have a promo code?
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                maxLength={50}
              />
            </div>
            <Button
              onClick={handleValidatePromoCode}
              disabled={!promoCode.trim() || isValidating}
              className="px-4"
            >
              {isValidating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                'Apply'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowInput(false)}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {validationResult && !validationResult.valid && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{validationResult.error}</span>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>Popular codes: <code className="bg-gray-100 px-1 rounded">NEWAGENT2025</code>, <code className="bg-gray-100 px-1 rounded">BASICFREE60</code></p>
          </div>
        </div>
      )}
    </div>
  )
}
