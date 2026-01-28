'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRightLeft, RefreshCw } from 'lucide-react'
import { CURRENCIES, convertCurrencySync, getRateSync, initializeRates } from '@/lib/currency'

interface CurrencyCalculatorWidgetProps {
  initialAmount?: number
  initialFromCurrency?: string
  initialToCurrency?: string
  className?: string
  compact?: boolean
}

export function CurrencyCalculatorWidget({
  initialAmount = 1000000,
  initialFromCurrency = 'GYD',
  initialToCurrency = 'USD',
  className = '',
  compact = false,
}: CurrencyCalculatorWidgetProps) {
  const [amount, setAmount] = useState<string>(initialAmount.toString())
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency)
  const [toCurrency, setToCurrency] = useState(initialToCurrency)
  const [result, setResult] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Available currencies for selection
  const currencyOptions = Object.keys(CURRENCIES)

  // Fetch latest rates on mount
  useEffect(() => {
    const loadRates = async () => {
      try {
        // Initialize rates cache
        await initializeRates()

        // Fetch rate info from API for last updated time
        const res = await fetch('/api/exchange-rates')
        if (res.ok) {
          const data = await res.json()
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }))
          }
        }
      } catch (error) {
        console.warn('Failed to fetch rate info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRates()
  }, [])

  // Calculate conversion
  const calculate = useCallback(() => {
    const numAmount = parseFloat(amount.replace(/,/g, '')) || 0
    const converted = convertCurrencySync(numAmount, fromCurrency, toCurrency)
    setResult(converted)

    // Calculate display rate
    if (fromCurrency === 'USD') {
      setRate(getRateSync(toCurrency))
    } else if (toCurrency === 'USD') {
      setRate(1 / getRateSync(fromCurrency))
    } else {
      // Cross-rate: FROM -> USD -> TO
      const fromToUsd = 1 / getRateSync(fromCurrency)
      const usdToTarget = getRateSync(toCurrency)
      setRate(fromToUsd * usdToTarget)
    }
  }, [amount, fromCurrency, toCurrency])

  // Recalculate when inputs change
  useEffect(() => {
    calculate()
  }, [calculate])

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Format number input
  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal
    const cleaned = value.replace(/[^\d.]/g, '')
    setAmount(cleaned)
  }

  // Get currency info
  const fromInfo = CURRENCIES[fromCurrency] || { symbol: fromCurrency, flag: '' }
  const toInfo = CURRENCIES[toCurrency] || { symbol: toCurrency, flag: '' }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (compact) {
    // Compact version for property cards
    return (
      <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{fromInfo.flag}</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            placeholder="Amount"
          />
          <button
            onClick={swapCurrencies}
            className="p-1 hover:bg-gray-200 rounded"
            title="Swap currencies"
          >
            <ArrowRightLeft className="h-4 w-4 text-gray-500" />
          </button>
          <span className="text-lg">{toInfo.flag}</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {fromInfo.symbol}{parseFloat(amount || '0').toLocaleString()} = <span className="font-semibold text-green-600">{toInfo.symbol}{Math.round(result).toLocaleString()}</span>
          </p>
        </div>
      </div>
    )
  }

  // Full widget version
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-green-600" />
          Currency Calculator
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="text"
            value={amount ? parseFloat(amount).toLocaleString() : ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        {/* Currency Selectors */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {currencyOptions.map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].flag} {code}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="mt-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Swap currencies"
          >
            <ArrowRightLeft className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {currencyOptions.map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].flag} {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">
            {fromInfo.flag} {fromInfo.symbol}{parseFloat(amount || '0').toLocaleString()} =
          </p>
          <p className="text-2xl font-bold text-green-600">
            {toInfo.flag} {toInfo.symbol}{Math.round(result).toLocaleString()}
          </p>
        </div>

        {/* Rate Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>
            Rate: 1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
          </p>
          {lastUpdated && <p>Updated: {lastUpdated}</p>}
        </div>
      </div>
    </div>
  )
}
