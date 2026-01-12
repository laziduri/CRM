import LoanCalculator from '@/components/calculator/LoanCalculator'

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-gradient-text">Loan Calculator</h1>
          <p className="text-lg text-gray-600">
            Calculate your monthly payments, total interest, and see a detailed payment schedule
          </p>
        </div>
        <LoanCalculator />
      </div>
    </div>
  )
}
