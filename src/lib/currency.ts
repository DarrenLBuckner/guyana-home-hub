// Enterprise Currency Conversion System
// src/lib/currency.ts
// Fetches rates from database, caches in memory, supports multi-currency

// =============================================================================
// TYPES
// =============================================================================

export interface ExchangeRate {
  target_currency: string
  rate: number
  inverse_rate: number
  updated_at: string
}

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  flag: string
}

// =============================================================================
// CURRENCY METADATA
// =============================================================================

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  GYD: { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', flag: '🇬🇾' },
  JMD: { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', flag: '🇯🇲' },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  TTD: { code: 'TTD', name: 'Trinidad Dollar', symbol: 'TT$', flag: '🇹🇹' },
  BBD: { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', flag: '🇧🇧' },
  XCD: { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$', flag: '🇦🇬' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
}

// =============================================================================
// FALLBACK RATES (Used if database unavailable)
// =============================================================================

const FALLBACK_RATES: Record<string, number> = {
  GYD: 209.50,
  JMD: 157.25,
  COP: 4100.00,
  KES: 129.00,
  TTD: 6.79,
  BBD: 2.00,
  XCD: 2.70,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
}

// =============================================================================
// RATE CACHE
// =============================================================================

let ratesCache: Record<string, number> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch exchange rates from database
 * Uses memory cache to avoid excessive DB calls
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  // Return cached if fresh
  if (ratesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return ratesCache
  }

  try {
    // Dynamic import to avoid issues in different contexts
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('target_currency, rate')

    if (error || !data || data.length === 0) {
      console.warn('Failed to fetch exchange rates from database, using fallback:', error?.message)
      return FALLBACK_RATES
    }

    // Build rates object
    ratesCache = {}
    data.forEach((row: { target_currency: string; rate: number }) => {
      ratesCache![row.target_currency] = row.rate
    })
    cacheTimestamp = Date.now()

    return ratesCache
  } catch (error) {
    console.warn('Error fetching exchange rates:', error)
    return FALLBACK_RATES
  }
}

/**
 * Get rate for specific currency (1 USD = X currency)
 */
export async function getRate(currency: string): Promise<number> {
  const rates = await getExchangeRates()
  return rates[currency.toUpperCase()] || 1
}

/**
 * Get inverse rate (1 currency = X USD)
 */
export async function getInverseRate(currency: string): Promise<number> {
  const rate = await getRate(currency)
  return 1 / rate
}

// =============================================================================
// SYNCHRONOUS HELPERS (use cached/fallback rates)
// =============================================================================

/**
 * Get rate synchronously - uses cache or fallback
 * For use in non-async contexts like React components
 */
export function getRateSync(currency: string): number {
  if (ratesCache && ratesCache[currency.toUpperCase()]) {
    return ratesCache[currency.toUpperCase()]
  }
  return FALLBACK_RATES[currency.toUpperCase()] || 1
}

/**
 * Convert amount between currencies (synchronous)
 */
export function convertCurrencySync(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
    return amount
  }

  const fromRate = fromCurrency.toUpperCase() === 'USD' ? 1 : getRateSync(fromCurrency)
  const toRate = toCurrency.toUpperCase() === 'USD' ? 1 : getRateSync(toCurrency)

  // Convert: amount in FROM → USD → TO
  const amountInUSD = amount / fromRate
  const amountInTarget = amountInUSD * toRate

  return amountInTarget
}

// =============================================================================
// ASYNC CONVERSION FUNCTIONS
// =============================================================================

/**
 * Convert amount between currencies (async - fetches fresh rates)
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
    return amount
  }

  const rates = await getExchangeRates()
  const fromRate = fromCurrency.toUpperCase() === 'USD' ? 1 : rates[fromCurrency.toUpperCase()]
  const toRate = toCurrency.toUpperCase() === 'USD' ? 1 : rates[toCurrency.toUpperCase()]

  if (!fromRate || !toRate) {
    console.error(`Missing rate for ${fromCurrency} or ${toCurrency}`)
    return amount
  }

  const amountInUSD = amount / fromRate
  const amountInTarget = amountInUSD * toRate

  return amountInTarget
}

// =============================================================================
// BACKWARD COMPATIBLE FUNCTIONS (maintain existing API)
// =============================================================================

/**
 * Convert Guyana Dollars to USD (backward compatible)
 * @deprecated Use convertCurrencySync(amount, 'GYD', 'USD') instead
 */
export function convertGydToUsd(gydAmount: number): number {
  const rate = getRateSync('GYD')
  const usdAmount = gydAmount / rate
  return Math.round(usdAmount * 100) / 100
}

/**
 * Format currency with both GYD and USD
 */
export function formatCurrencyWithUsd(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)
  return `G$${gydAmount.toLocaleString()} (~US$${usdAmount.toLocaleString()})`
}

/**
 * Format currency for display - compact version
 */
export function formatCurrencyCompact(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)

  if (gydAmount >= 1000000) {
    const gydMillion = Math.round(gydAmount / 100000) / 10
    const usdThousand = Math.round(usdAmount / 100) / 10
    return `G$${gydMillion}M (~US$${usdThousand}K)`
  } else if (gydAmount >= 1000) {
    const gydThousand = Math.round(gydAmount / 100) / 10
    return `G$${gydThousand}K (~US$${Math.round(usdAmount)})`
  }

  return formatCurrencyWithUsd(gydAmount)
}

/**
 * Get just the USD equivalent
 */
export function getUsdEquivalent(gydAmount: number): string {
  const usdAmount = convertGydToUsd(gydAmount)
  return `~US$${usdAmount.toLocaleString()}`
}

// =============================================================================
// GENERIC FORMATTING FUNCTIONS
// =============================================================================

/**
 * Format any currency amount for display
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: { decimals?: number; showSymbol?: boolean }
): string {
  const { decimals = 0, showSymbol = true } = options || {}
  const info = CURRENCIES[currency.toUpperCase()]
  const symbol = showSymbol ? (info?.symbol || currency + ' ') : ''

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${symbol}${formatted}`
}

/**
 * Format with USD equivalent
 */
export function formatWithUsdEquivalent(
  amount: number,
  currency: string
): string {
  const info = CURRENCIES[currency.toUpperCase()]
  const symbol = info?.symbol || currency + ' '
  const usdAmount = convertCurrencySync(amount, currency, 'USD')

  return `${symbol}${amount.toLocaleString()} (~US$${Math.round(usdAmount).toLocaleString()})`
}

// =============================================================================
// FORMATTER OBJECT (backward compatible)
// =============================================================================

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
  },

  // Generic formatter for any currency
  generic: (amount: number, currency: string) => formatWithUsdEquivalent(amount, currency),
}

// =============================================================================
// HELPER TYPES AND FUNCTIONS
// =============================================================================

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

/**
 * Get currency code for a country
 */
export function getCurrencyForCountry(countryCode: string): string {
  const map: Record<string, string> = {
    GY: 'GYD',
    JM: 'JMD',
    CO: 'COP',
    KE: 'KES',
    TT: 'TTD',
    BB: 'BBD',
    AG: 'XCD', // Antigua
    DM: 'XCD', // Dominica
    GD: 'XCD', // Grenada
    KN: 'XCD', // St Kitts
    LC: 'XCD', // St Lucia
    VC: 'XCD', // St Vincent
    US: 'USD',
    CA: 'CAD',
    GB: 'GBP',
  }
  return map[countryCode.toUpperCase()] || 'USD'
}

/**
 * Initialize rates cache (call on app start)
 */
export async function initializeRates(): Promise<void> {
  await getExchangeRates()
}
