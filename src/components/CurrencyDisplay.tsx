// Currency Display Component
// src/components/CurrencyDisplay.tsx

import React from 'react'
import { CurrencyFormatter } from '@/lib/currency'

interface CurrencyDisplayProps {
  amount: number
  format?: 'property' | 'pricing' | 'compact' | 'title'
  className?: string
}

export function CurrencyDisplay({ 
  amount, 
  format = 'property',
  className = ''
}: CurrencyDisplayProps) {
  const formatter = CurrencyFormatter[format]
  
  return (
    <span className={className}>
      {formatter(amount)}
    </span>
  )
}

// Alternative inline text function for use in strings
export function formatCurrency(amount: number, format: 'property' | 'pricing' | 'compact' | 'title' = 'property'): string {
  return CurrencyFormatter[format](amount)
}
