import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { mockLoans } from '@/lib/data'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface PageProps {
  params: {
    id: string
  }
}

export default function LoanDetailPage({ params }: PageProps) {
  const loan = mockLoans.find((l) => l.id === params.id)

  if (!loan) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/loans"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loans
        </Link>

        <Card className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-gradient-text">{loan.lender}</h1>
              <Badge variant="primary" className="text-lg px-3 py-1">
                {loan.loanType}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-1">
                {formatPercentage(loan.interestRate)}
              </div>
              <p className="text-sm text-gray-600">Interest Rate (p.a.)</p>
            </div>
          </div>

          {loan.description && (
            <p className="text-lg text-gray-700 mb-6">{loan.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tenure</p>
              <p className="text-xl font-semibold text-gray-900">
                {loan.minTenure} - {loan.maxTenure} months
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Processing Fee</p>
              <p className="text-xl font-semibold text-gray-900">
                {loan.fees?.processingFee === 0 || loan.fees?.processingFee === undefined
                  ? 'Free'
                  : formatCurrency(loan.fees.processingFee)}
              </p>
            </div>
          </div>

          <Link href={`/apply?loan=${loan.id}`}>
            <Button variant="primary" size="lg" className="w-full">
              Apply Now
            </Button>
          </Link>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="space-y-2">
              {loan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
            <ul className="space-y-2">
              {loan.eligibility.map((req, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  {req}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {loan.fees && (
          <Card className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Fees & Charges</h2>
            <div className="space-y-3">
              {loan.fees.processingFee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">
                    {loan.fees.processingFee === 0
                      ? 'Free'
                      : formatCurrency(loan.fees.processingFee)}
                  </span>
                </div>
              )}
              {loan.fees.lateFee && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Payment Fee:</span>
                  <span className="font-semibold">{formatCurrency(loan.fees.lateFee)}</span>
                </div>
              )}
              {loan.fees.earlyRepaymentFee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Early Repayment Fee:</span>
                  <span className="font-semibold">
                    {loan.fees.earlyRepaymentFee === 0
                      ? 'Free'
                      : formatCurrency(loan.fees.earlyRepaymentFee)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
