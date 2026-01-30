import MortgageCalculator from '@/components/MortgageCalculator';
import { CurrencyCalculatorWidget } from '@/components/CurrencyCalculatorWidget';

export const metadata = {
  title: 'Mortgage Calculator | HomeHub',
  description: 'Calculate your mortgage payments with current rates from local banks.',
};

export default function MortgageCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mortgage Calculator
          </h1>
          <p className="text-gray-600">
            Estimate your monthly payments with current rates from local banks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MortgageCalculator />
          <CurrencyCalculatorWidget />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Understanding Your Mortgage
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Principal</h3>
              <p>The original loan amount you borrow from the bank to purchase your property.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Interest Rate</h3>
              <p>The annual percentage charged by the bank. Rates vary by bank and may be fixed or variable.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Loan Term</h3>
              <p>The length of time to repay. Longer terms mean lower monthly payments but more total interest.</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This calculator provides estimates only. Actual rates, terms, and eligibility
              depend on your credit history, income, down payment, and the bank&apos;s current policies.
              Contact banks directly for official quotes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
