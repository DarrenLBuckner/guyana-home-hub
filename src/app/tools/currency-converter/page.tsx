'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRightLeft, Home, RefreshCw, TrendingUp } from 'lucide-react'
import { CURRENCIES, convertCurrencySync, getRateSync, initializeRates, type CurrencyInfo } from '@/lib/currency'

// Popular conversion examples
const POPULAR_CONVERSIONS = [
  { from: 'GYD', to: 'USD', amount: 10000000 },
  { from: 'GYD', to: 'USD', amount: 50000000 },
  { from: 'JMD', to: 'USD', amount: 1000000 },
  { from: 'COP', to: 'USD', amount: 100000000 },
]

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>('1000000')
  const [fromCurrency, setFromCurrency] = useState('GYD')
  const [toCurrency, setToCurrency] = useState('USD')
  const [result, setResult] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [rates, setRates] = useState<Record<string, number>>({})

  // Available currencies for selection
  const currencyOptions = Object.entries(CURRENCIES) as [string, CurrencyInfo][]

  // Fetch latest rates on mount
  useEffect(() => {
    const loadRates = async () => {
      try {
        await initializeRates()

        const res = await fetch('/api/exchange-rates')
        if (res.ok) {
          const data = await res.json()
          if (data.rates) {
            setRates(data.rates)
          }
          if (data.updated_at) {
            setLastUpdated(new Date(data.updated_at).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }))
          }
        }
      } catch (error) {
        console.warn('Failed to fetch rates:', error)
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
      const fromToUsd = 1 / getRateSync(fromCurrency)
      const usdToTarget = getRateSync(toCurrency)
      setRate(fromToUsd * usdToTarget)
    }
  }, [amount, fromCurrency, toCurrency])

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
    const cleaned = value.replace(/[^\d.]/g, '')
    setAmount(cleaned)
  }

  // Quick conversion click
  const handleQuickConversion = (conv: typeof POPULAR_CONVERSIONS[0]) => {
    setFromCurrency(conv.from)
    setToCurrency(conv.to)
    setAmount(conv.amount.toString())
  }

  const fromInfo = CURRENCIES[fromCurrency] || { symbol: fromCurrency, flag: '', name: fromCurrency }
  const toInfo = CURRENCIES[toCurrency] || { symbol: toCurrency, flag: '', name: toCurrency }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-green-100 hover:text-white flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span className="text-green-200">/</span>
            <span>Tools</span>
            <span className="text-green-200">/</span>
            <span>Currency Converter</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Currency Converter</h1>
          <p className="text-green-100 text-lg">
            Convert between local and international currencies for property pricing
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={amount ? parseFloat(amount).toLocaleString() : ''}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="w-full px-4 py-4 text-2xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Currency Selectors */}
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white"
                      >
                        {currencyOptions.map(([code, info]) => (
                          <option key={code} value={code}>
                            {info.flag} {code} - {info.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={swapCurrencies}
                      className="mt-6 md:mt-0 p-3 bg-gray-100 hover:bg-green-100 rounded-full transition-colors group"
                      title="Swap currencies"
                    >
                      <ArrowRightLeft className="h-6 w-6 text-gray-500 group-hover:text-green-600 transition-colors" />
                    </button>

                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white"
                      >
                        {currencyOptions.map(([code, info]) => (
                          <option key={code} value={code}>
                            {info.flag} {code} - {info.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Result Display */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-100">
                    <p className="text-gray-600 mb-2">
                      {fromInfo.flag} {fromInfo.symbol}{parseFloat(amount || '0').toLocaleString()} {fromCurrency} =
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-green-600">
                      {toInfo.flag} {toInfo.symbol}{Math.round(result).toLocaleString()}
                    </p>
                    <p className="text-lg text-gray-500 mt-2">{toInfo.name}</p>
                  </div>

                  {/* Rate Info */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Exchange Rate: 1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}</span>
                    </div>
                    {lastUpdated && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Last Updated: {lastUpdated}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Popular Conversions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Conversions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {POPULAR_CONVERSIONS.map((conv, idx) => {
                const fromI = CURRENCIES[conv.from]
                const toI = CURRENCIES[conv.to]
                const converted = convertCurrencySync(conv.amount, conv.from, conv.to)
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickConversion(conv)}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors text-left"
                  >
                    <span className="text-gray-600">
                      {fromI?.flag} {fromI?.symbol}{conv.amount.toLocaleString()}
                    </span>
                    <span className="text-green-600 font-medium">
                      {toI?.flag} {toI?.symbol}{Math.round(converted).toLocaleString()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Available Currencies */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Currencies</h2>
            <div className="flex flex-wrap gap-2">
              {currencyOptions.map(([code, info]) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                >
                  <span>{info.flag}</span>
                  <span className="font-medium">{code}</span>
                </span>
              ))}
            </div>

            {/* Rate Table */}
            {Object.keys(rates).length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Current Rates (1 USD =)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(rates).map(([currency, rateValue]) => {
                    const info = CURRENCIES[currency]
                    return (
                      <div key={currency} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">
                          {info?.flag || ''} {currency}
                        </span>
                        <span className="font-mono text-sm">
                          {typeof rateValue === 'number' ? rateValue.toFixed(2) : rateValue}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
