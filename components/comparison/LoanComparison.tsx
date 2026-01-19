'use client'

import { X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Loan } from '@/types'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface LoanComparisonProps {
  loans: Loan[]
  isOpen: boolean
  onClose: () => void
}

export default function LoanComparison({ loans, isOpen, onClose }: LoanComparisonProps) {
  if (loans.length === 0) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compare Loans" size="xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-4 pr-4 font-semibold text-gray-900">Features</th>
              {loans.map((loan) => (
                <th key={loan.id} className="pb-4 px-4 font-semibold text-gray-900 min-w-[200px]">
                  {loan.lender}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Interest Rate (p.a.)</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPercentage(loan.interestRate)}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Loan Amount</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Tenure</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  {loan.minTenure} - {loan.maxTenure} months
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Processing Fee</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  {loan.fees?.processingFee === 0 || loan.fees?.processingFee === undefined
                    ? 'Free'
                    : formatCurrency(loan.fees.processingFee)}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Late Fee</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  {loan.fees?.lateFee ? formatCurrency(loan.fees.lateFee) : 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-4 pr-4 font-medium text-gray-700">Key Features</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  <ul className="space-y-1">
                    {loan.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 pr-4 font-medium text-gray-700">Eligibility</td>
              {loans.map((loan) => (
                <td key={loan.id} className="py-4 px-4">
                  <ul className="space-y-1">
                    {loan.eligibility.map((req, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        • {req}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {loans.length > 0 && (
          <Button variant="primary" onClick={() => window.location.href = `/apply?loan=${loans[0].id}`}>
            Apply Now
          </Button>
        )}
      </div>
    </Modal>
  )
}
