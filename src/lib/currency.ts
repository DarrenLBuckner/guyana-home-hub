// Currency conversion utilities
// src/lib/currency.ts

// Current exchange rate (you can make this dynamic later)
const GYD_TO_USD_RATE = 0.0048 // 1 GYD = 0.0048 USD (approximate)

/**
 * Convert Guyana Dollars to USD
 */
export function convertGydToUsd(gydAmount: number): number {
  return Math.round((gydAmount * GYD_TO_USD_RATE) * 100) / 100 // Round to 2 decimal places
}

/**
 * Format currency with both GYD and USD
 */
export function formatCurrencyWithUsd(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)
  return `G$${gydAmount.toLocaleString()} (US$${usdAmount.toLocaleString()})`
}

/**
 * Format currency for display - compact version
 */
export function formatCurrencyCompact(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)
  
  // For large amounts, show in K format
  if (gydAmount >= 1000000) {
    const gydMillion = Math.round(gydAmount / 100000) / 10 // Round to 1 decimal
    const usdThousand = Math.round(usdAmount / 100) / 10 // Round to 1 decimal
    return `G$${gydMillion}M (US$${usdThousand}K)`
  } else if (gydAmount >= 1000) {
    const gydThousand = Math.round(gydAmount / 100) / 10 // Round to 1 decimal  
    const usdAmount = Math.round(convertGydToUsd(gydAmount))
    return `G$${gydThousand}K (US$${usdAmount})`
  }
  
  return formatCurrencyWithUsd(gydAmount)
}

/**
 * Get just the USD equivalent
 */
export function getUsdEquivalent(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)
  return `US$${usdAmount.toLocaleString()}`
}

/**
 * Format for different contexts
 */
export const CurrencyFormatter = {
  // For property cards and listings
  property: (gydAmount: number) => formatCurrencyWithUsd(gydAmount),
  
  // For pricing tables and forms
  pricing: (gydAmount: number) => formatCurrencyWithUsd(gydAmount),
  
  // For compact displays
  compact: (gydAmount: number) => formatCurrencyCompact(gydAmount),
  
  // For titles and headers
  title: (gydAmount: number) => {
    const usd = convertGydToUsd(gydAmount)
    return `G$${gydAmount.toLocaleString()} (~US$${usd.toLocaleString()})`
  }
}

// React component for currency display - move this to a separate component file
export interface CurrencyDisplayProps {
  amount: number
  format?: 'property' | 'pricing' | 'compact' | 'title'
  className?: string
}

export function getCurrencyDisplayText(
  amount: number, 
  format: 'property' | 'pricing' | 'compact' | 'title' = 'property'
): string {
  const formatter = CurrencyFormatter[format]
  return formatter(amount)
}
