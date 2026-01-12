import Link from 'next/link'
import { Check } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Checkbox from '@/components/ui/Checkbox'
import { Loan } from '@/types'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface LoanCardProps {
  loan: Loan
  onCompareChange?: (loanId: string, checked: boolean) => void
  isComparing?: boolean
}

export default function LoanCard({ loan, onCompareChange, isComparing = false }: LoanCardProps) {
  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{loan.lender}</h3>
          <Badge variant="primary">{loan.loanType}</Badge>
        </div>
        {onCompareChange && (
          <Checkbox
            checked={isComparing}
            onChange={(e) => onCompareChange(loan.id, e.target.checked)}
            label="Compare"
          />
        )}
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-primary mb-1">
          {formatPercentage(loan.interestRate)}
        </div>
        <p className="text-sm text-gray-600">Interest Rate (p.a.)</p>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Loan Amount:</span>
          <span className="font-semibold">
            {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tenure:</span>
          <span className="font-semibold">
            {loan.minTenure} - {loan.maxTenure} months
          </span>
        </div>
        {loan.fees?.processingFee !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Fee:</span>
            <span className="font-semibold">
              {loan.fees.processingFee === 0 ? 'Free' : formatCurrency(loan.fees.processingFee)}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
        <ul className="space-y-1">
          {loan.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4 space-y-2">
        <Link href={`/loans/${loan.id}`} className="block">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Link href={`/apply?loan=${loan.id}`}>
          <Button variant="primary" className="w-full">
            Apply Now
          </Button>
        </Link>
      </div>
    </Card>
  )
}
