'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Building2, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { useCountryTheme } from '@/components/CountryThemeProvider';
import {
  MortgageRate,
  calculateMortgage,
  formatCurrency,
  LOAN_TERMS,
} from '@/lib/mortgage';

interface MortgageCalculatorProps {
  className?: string;
  initialAmount?: number;
  compact?: boolean;
}

export default function MortgageCalculator({
  className = '',
  initialAmount = 25000000,
  compact = false,
}: MortgageCalculatorProps) {
  const { country: countryCode } = useCountryTheme();

  const [rates, setRates] = useState<MortgageRate[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState(initialAmount);
  const [interestRate, setInterestRate] = useState(6.5);
  const [termYears, setTermYears] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch(`/api/mortgage-rates?country=${countryCode}`);
        const data = await response.json();

        if (data.rates && data.rates.length > 0) {
          setRates(data.rates);
          setSelectedBank(data.rates[0].bank_name);
          setInterestRate(data.rates[0].rate_percent);
          setLastUpdated(data.updated_at);
        }
      } catch (error) {
        console.error('Failed to fetch mortgage rates:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRates();
  }, [countryCode]);

  useEffect(() => {
    const bank = rates.find((r: MortgageRate) => r.bank_name === selectedBank);
    if (bank) {
      setInterestRate(bank.rate_percent);
    }
  }, [selectedBank, rates]);

  const calculation = useMemo(() => {
    return calculateMortgage(loanAmount, interestRate, termYears);
  }, [loanAmount, interestRate, termYears]);

  const selectedBankDetails = rates.find((r: MortgageRate) => r.bank_name === selectedBank);

  const currencyMap: Record<string, string> = {
    GY: 'GYD',
    JM: 'JMD',
    CO: 'COP',
  };
  const currency = currencyMap[countryCode] || 'USD';

  const loanLimits: Record<string, { min: number; max: number; step: number }> = {
    GY: { min: 1000000, max: 100000000, step: 500000 },
    JM: { min: 1000000, max: 100000000, step: 500000 },
    CO: { min: 50000000, max: 2000000000, step: 10000000 },
  };
  const { min: minLoan, max: maxLoan, step: loanStep } = loanLimits[countryCode] || loanLimits.GY;

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-gray-700">Mortgage Estimate</span>
        </div>
        <div className="text-2xl font-bold text-primary">
          {formatCurrency(calculation.monthlyPayment, currency)}
          <span className="text-sm font-normal text-gray-500">/mo</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {termYears} years @ {interestRate}%
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mortgage Calculator</h3>
            <p className="text-sm text-white/80">Estimate your monthly payments</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {rates.length > 0 && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
            >
              {rates.map((rate: MortgageRate) => (
                <option key={rate.id} value={rate.bank_name}>
                  {rate.bank_name} — {rate.rate_percent}%
                </option>
              ))}
              <option value="custom">Custom Rate</option>
            </select>
            {selectedBankDetails?.bank_website && (
              <a
                href={selectedBankDetails.bank_website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
              >
                Visit {selectedBank} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Loan Amount
            </span>
            <span className="text-primary font-semibold">
              {formatCurrency(loanAmount, currency)}
            </span>
          </label>
          <input
            type="range"
            min={minLoan}
            max={maxLoan}
            step={loanStep}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(minLoan, currency)}</span>
            <span>{formatCurrency(maxLoan, currency)}</span>
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Interest Rate</span>
            <span className="text-primary font-semibold">{interestRate.toFixed(2)}%</span>
          </label>
          <input
            type="range"
            min={3}
            max={15}
            step={0.25}
            value={interestRate}
            onChange={(e) => {
              setInterestRate(Number(e.target.value));
              setSelectedBank('custom');
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3%</span>
            <span>15%</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            Loan Term
          </label>
          <select
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
          >
            {LOAN_TERMS.map((term: number) => (
              <option key={term} value={term}>
                {term} years ({term * 12} payments)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(calculation.monthlyPayment, currency)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Payment</p>
              <p className="font-semibold text-gray-800">
                {formatCurrency(calculation.totalPayment, currency)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Interest</p>
              <p className="font-semibold text-gray-800">
                {formatCurrency(calculation.totalInterest, currency)}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Estimates only. Contact your bank for exact rates and terms.
          {lastUpdated && (
            <span className="block mt-1">
              Rates updated: {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
