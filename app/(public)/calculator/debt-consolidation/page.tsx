import DebtConsolidationCalculator from '@/components/calculator/DebtConsolidationCalculator'
import { FileText, Calculator, TrendingDown, DollarSign, Calendar, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function DebtConsolidationCalculatorPage() {
  const benefits = [
    {
      icon: Calculator,
      title: 'Understand Your Financial Position',
      description: 'Gain clear insights into your current debt obligations, including total outstanding balances, monthly payment commitments, and estimated payoff timelines. This comprehensive view helps you make informed decisions about debt management strategies.',
    },
    {
      icon: TrendingDown,
      title: 'Compare Consolidation Scenarios',
      description: 'Evaluate different consolidation loan options side-by-side with your current debt situation. See how varying interest rates, loan amounts, and repayment tenures impact your monthly payments and total interest costs.',
    },
    {
      icon: DollarSign,
      title: 'Identify Potential Savings',
      description: 'Discover how consolidating multiple debts into a single loan could reduce your monthly payment burden and total interest expenses. The calculator provides detailed breakdowns of potential savings across different scenarios.',
    },
    {
      icon: Calendar,
      title: 'Plan Your Repayment Strategy',
      description: 'Visualise how long it will take to pay off your debts under different consolidation options. Compare payoff timelines between your current situation and potential consolidated loan arrangements to find the most suitable approach.',
    },
    {
      icon: Shield,
      title: 'Make Informed Financial Decisions',
      description: 'Use the calculator as a planning tool to explore various debt consolidation possibilities before approaching lenders. Understanding your options helps you negotiate better terms and choose the most appropriate solution for your financial circumstances.',
    },
  ]

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient-text">
            Debt Consolidation Calculator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Evaluate how consolidating multiple debts into a single loan could simplify your repayments and potentially reduce your interest costs. Compare your current debt situation with various consolidation options.
          </p>
        </div>

        {/* How to Use This Calculator Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Use This Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Enter Your Current Debts</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Add details for each of your existing debts, including outstanding balances, current interest rates, and monthly payment amounts. You can add multiple debts to get a complete picture of your financial obligations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Review Your Current Situation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      The calculator automatically summarises your total outstanding balance, combined monthly payments, and provides an estimated timeline for paying off all debts under your current repayment schedule.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Explore Consolidation Options</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Adjust the consolidated loan amount, interest rate, and repayment tenure to see how different loan terms would affect your monthly payments and total interest costs. The calculator updates results in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Compare and Analyze</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Review the side-by-side comparison between your current debt situation and the proposed consolidation loan. Examine potential monthly savings, interest savings, and overall cost reductions to determine if consolidation makes sense for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Calculator */}
        <DebtConsolidationCalculator />

        {/* Benefits Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text">
              Benefits of Using a Debt Consolidation Calculator
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A debt consolidation calculator is a valuable financial planning tool that helps you explore different strategies for managing multiple debts more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} hover className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Disclaimer Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Notice</h3>
                <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                  <p>
                    This debt consolidation calculator is provided for informational and illustrative purposes only. The calculations and estimates shown are based on the information you provide and standard loan calculation formulas. Actual loan terms, interest rates, and repayment schedules may vary significantly based on individual credit assessments, lender policies, and prevailing market conditions.
                  </p>
                  <p>
                    <strong>Important:</strong> Brilliance Advisory Pte. Ltd. is not a bank, licensed financial advisory institution, or lender. We do not provide regulated financial advice. All loan approvals, terms, rates, and conditions are subject to third-party lender assessment and policies. The calculator does not include processing fees, administrative charges, early repayment penalties, or other costs that may apply to actual loan products.
                  </p>
                  <p>
                    The estimated payoff times for current debts are simplified calculations and may not reflect actual repayment periods, which depend on payment allocation strategies, interest compounding methods, and other factors. Debt consolidation may not always result in savings, particularly if the consolidated loan has a higher interest rate or longer repayment period than your existing debts.
                  </p>
                  <p>
                    Before making any financial decisions, we recommend consulting with qualified financial advisors and carefully reviewing all terms and conditions from potential lenders. Brilliance Advisory Pte. Ltd. accepts no liability or responsibility for any use of or reliance on any conclusions arising from or in relation to this calculator, including any errors or omissions thereof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
