'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const businessLoanSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  uen: z.string().min(8, 'UEN must be at least 8 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  businessType: z.string().min(1, 'Please select business type'),
  industry: z.string().min(1, 'Please select industry'),
  yearsInOperation: z.number().min(0, 'Years in operation cannot be negative'),
  annualRevenue: z.number().min(0, 'Annual revenue cannot be negative'),
  loanAmount: z.number().min(50000, 'Minimum loan amount is $50,000').max(5000000, 'Maximum loan amount is $5,000,000'),
  loanPurpose: z.string().min(1, 'Please select loan purpose'),
  tenure: z.number().min(12, 'Minimum tenure is 12 months').max(120, 'Maximum tenure is 120 months'),
})

type BusinessLoanFormData = z.infer<typeof businessLoanSchema>

export default function BusinessLoanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessLoanFormData>({
    resolver: zodResolver(businessLoanSchema),
  })

  const onSubmit = async (data: BusinessLoanFormData) => {
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
          <p className="text-gray-600 mb-4">
            Thank you for your business loan application. Our advisor will review it and contact you within 24-48 hours.
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Loan Application</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Business Name"
            type="text"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
          <Input
            label="UEN (Unique Entity Number)"
            type="text"
            placeholder="12345678A"
            {...register('uen')}
            error={errors.uen?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Person Name"
            type="text"
            {...register('contactName')}
            error={errors.contactName?.message}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <select
              {...register('businessType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="sole-proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llp">Limited Liability Partnership (LLP)</option>
              <option value="private-limited">Private Limited Company</option>
              <option value="public-limited">Public Limited Company</option>
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              {...register('industry')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="retail">Retail</option>
              <option value="f&b">Food & Beverage</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction</option>
              <option value="logistics">Logistics & Transportation</option>
              <option value="technology">Technology</option>
              <option value="professional-services">Professional Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="hospitality">Hospitality</option>
              <option value="other">Other</option>
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
            )}
          </div>
          <Input
            label="Years in Operation"
            type="number"
            {...register('yearsInOperation', { valueAsNumber: true })}
            error={errors.yearsInOperation?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Annual Revenue (SGD)"
            type="number"
            {...register('annualRevenue', { valueAsNumber: true })}
            error={errors.annualRevenue?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose
            </label>
            <select
              {...register('loanPurpose')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="working-capital">Working Capital</option>
              <option value="expansion">Business Expansion</option>
              <option value="equipment">Equipment Purchase</option>
              <option value="inventory">Inventory Financing</option>
              <option value="refinancing">Debt Refinancing</option>
              <option value="property">Property Purchase</option>
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
            {isSubmitting ? 'Submitting...' : 'Submit Business Loan Application'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
