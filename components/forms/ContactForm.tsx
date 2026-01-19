'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-accent-gray2">
            Thank you for contacting us. We&apos;ll get back to you within 24 hours.
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Your Name"
            type="text"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <div>
          <label className="block text-sm font-medium text-accent-gray2 mb-2">
            Your Message
          </label>
          <textarea
            {...register('message')}
            rows={6}
            className="w-full px-4 py-3 border border-secondary-gray3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-accent-error">{errors.message.message}</p>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
