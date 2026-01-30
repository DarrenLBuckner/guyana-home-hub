export interface MortgageRate {
  id: string;
  bank_name: string;
  country_code: string;
  rate_percent: number;
  min_term_years: number;
  max_term_years: number;
  min_loan_amount: number | null;
  max_loan_amount: number | null;
  bank_website: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface MortgageCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  interestRate: number;
  termYears: number;
}

export function calculateMortgage(
  principal: number,
  annualRate: number,
  termYears: number
): MortgageCalculation {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  let monthlyPayment: number;

  if (monthlyRate === 0) {
    monthlyPayment = principal / numPayments;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanAmount: principal,
    interestRate: annualRate,
    termYears,
  };
}

export function formatCurrency(amount: number, currency: string = 'GYD'): string {
  const symbols: Record<string, string> = {
    GYD: 'G$',
    USD: '$',
    CAD: 'C$',
    GBP: '£',
    EUR: '€',
    JMD: 'J$',
    COP: 'COL$',
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export const LOAN_TERMS = [5, 10, 15, 20, 25, 30];
