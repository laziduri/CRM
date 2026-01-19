'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  loanAmount: z.number().min(1000, 'Minimum loan amount is $1,000').max(500000, 'Maximum loan amount is $500,000'),
  loanPurpose: z.string().min(1, 'Please select a loan purpose'),
  employmentStatus: z.string().min(1, 'Please select employment status'),
  monthlyIncome: z.number().min(1000, 'Monthly income must be at least $1,000'),
  tenure: z.number().min(12, 'Minimum tenure is 12 months').max(84, 'Maximum tenure is 84 months'),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export default function LoanApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            Thank you for your application. We&apos;ll review it and get back to you within 24 hours.
          </p>
        </div>
        <Button variant="primary" onClick={() => window.location.href = '/'}>
          Return to Home
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Application</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Monthly Income (SGD)"
            type="number"
            {...register('monthlyIncome', { valueAsNumber: true })}
            error={errors.monthlyIncome?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status
            </label>
            <select
              {...register('employmentStatus')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="freelancer">Freelancer</option>
              <option value="unemployed">Unemployed</option>
            </select>
            {errors.employmentStatus && (
              <p className="mt-1 text-sm text-red-600">{errors.employmentStatus.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose
            </label>
            <select
              {...register('loanPurpose')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="debt-consolidation">Debt Consolidation</option>
              <option value="home-renovation">Home Renovation</option>
              <option value="education">Education</option>
              <option value="wedding">Wedding</option>
              <option value="medical">Medical Expenses</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
            {errors.loanPurpose && (
              <p className="mt-1 text-sm text-red-600">{errors.loanPurpose.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Loan Amount (SGD)"
            type="number"
            {...register('loanAmount', { valueAsNumber: true })}
            error={errors.loanAmount?.message}
          />
          <Input
            label="Loan Tenure (months)"
            type="number"
            {...register('tenure', { valueAsNumber: true })}
            error={errors.tenure?.message}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
