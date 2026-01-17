'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import PersonalLoanForm from '@/components/forms/PersonalLoanForm'
import BusinessLoanForm from '@/components/forms/BusinessLoanForm'
import { Briefcase, User } from 'lucide-react'

export default function ApplyPage() {
  const [loanType, setLoanType] = useState<'personal' | 'business'>('personal')

  // Auto-select business if coming from business loan page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer
      if (referrer.includes('/loans/business')) {
        setLoanType('business')
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-gradient-text">Apply for a Loan</h1>
          <p className="text-lg text-gray-600">
            Select your loan type and complete the assessment form
          </p>
        </div>

        {/* Loan Type Selector */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setLoanType('personal')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                loanType === 'personal'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold">Personal Loan</span>
            </button>
            <button
              onClick={() => setLoanType('business')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all ${
                loanType === 'business'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Business Loan</span>
            </button>
          </div>
        </Card>

        {/* Form Display */}
        {loanType === 'personal' ? <PersonalLoanForm /> : <BusinessLoanForm />}
      </div>
    </div>
  )
}
