'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getAllJobs, getJobBySlug } from '@/lib/jobs'
import { ArrowLeft, Upload, FileText, CheckCircle2 } from 'lucide-react'

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  position: z.string().min(1, 'Please select a position'),
  resume: z.string().min(1, 'Please upload your resume'),
  coverLetter: z.string().optional(),
  experience: z.string().min(10, 'Please provide information about your experience'),
  motivation: z.string().min(20, 'Please tell us why you want to join our team (minimum 20 characters)'),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

function CareerApplicationForm() {
  const searchParams = useSearchParams()
  const positionParam = searchParams.get('position')
  const allJobs = getAllJobs()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resumeFileName, setResumeFileName] = useState('')

  // Get the job title from slug if position param exists
  const selectedJob = positionParam ? getJobBySlug(positionParam) : null
  const defaultPosition = selectedJob ? selectedJob.slug : ''

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      position: defaultPosition,
    },
  })

  const position = watch('position')

  useEffect(() => {
    if (positionParam && selectedJob) {
      setValue('position', selectedJob.slug)
    }
  }, [positionParam, selectedJob, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      // In a real application, you would upload the file to a server
      // For now, we'll just store the filename
      setValue('resume', file.name, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your interest in joining Brilliance Advisory. We&apos;ve received your application and will review it carefully.
                </p>
                <p className="text-gray-600 mb-8">
                  Our team will get back to you within 5-7 business days. We appreciate your patience.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/careers">
                  <Button variant="primary" size="lg">
                    Back to Careers
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/careers"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Job Application
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We&apos;re excited that you&apos;re interested in joining our team. Please fill out the form below and we&apos;ll get back to you soon.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Applied For <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('position')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a position...</option>
                  {allJobs.map((job) => (
                    <option key={job.id} value={job.slug}>
                      {job.title} {job.status === 'Talent Pool' ? '(Talent Pool)' : ''}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                )}
                {selectedJob && (
                  <p className="mt-2 text-sm text-gray-600">
                    Applying for: <span className="font-medium">{selectedJob.title}</span>
                    {selectedJob.status === 'Talent Pool' && (
                      <span className="ml-2 text-blue-600">(Talent Pool)</span>
                    )}
                  </p>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    {resumeFileName && (
                      <p className="text-sm text-primary font-medium mt-2 flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        {resumeFileName}
                      </p>
                    )}
                  </div>
                </div>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  {...register('coverLetter')}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('experience')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Please describe your relevant work experience, skills, and achievements..."
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to join Brilliance Advisory? <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('motivation')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Tell us what motivates you and why you're interested in working with us..."
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-600">{errors.motivation.message}</p>
                )}
              </div>

              {/* Submit Button */}
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

              <p className="text-sm text-gray-500 text-center">
                By submitting this application, you agree to our privacy policy and consent to the processing of your personal data for recruitment purposes.
              </p>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default function CareerApplicationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CareerApplicationForm />
    </Suspense>
  )
}
