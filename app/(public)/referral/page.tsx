'use client'

import { useState } from 'react'
import { User, Phone, Mail, Building2, Users, MapPin, CheckCircle2, Info, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PageTransition } from '@/components/layout/PageTransition'
import { ParticleBackground } from '@/components/background/ParticleBackground'

export default function ReferralPage() {
  const [formData, setFormData] = useState({
    yourName: '',
    yourContact: '',
    yourEmail: '',
    affiliation: 'Non-Staff',
    partnerName: '',
    consultantName: '',
    friendName: '',
    friendContact: '',
    propertyDetails: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch('/api/submit-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit referral')
      }
      setIsSubmitted(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit. Please try again or contact sales@brillianceadvisory.sg'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <AmbientBackground intensity="moderate" />
          <GlowBackground intensity="subtle" />
          <div className="relative z-10 max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <AnimatedGradientText className="text-3xl md:text-4xl">
                Thank You! 🙌
              </AnimatedGradientText>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your referral submission has been received. We&apos;ll reach out to you soon to connect you with your friend and get them started on their loan journey.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-primary to-teal hover:from-primary-dark hover:to-teal-dark text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Return Home
            </a>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden w-full">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <NextImage
              src="/images/pexels-fauxels-3184418.jpg"
              alt="Team collaboration"
              fill
              priority
              className="object-cover object-center animate-zoom-in-slow"
              quality={90}
              sizes="100vw"
            />
          </div>
          
          {/* Dark overlay for strong text contrast */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/90 via-navy/75 to-navy/55" />
          
          {/* Particles */}
          <ParticleBackground intensity="subtle" />
          
          {/* Bottom fade transition */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[2]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <ScrollReveal>
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-white/95 text-navy rounded-full text-sm md:text-base font-semibold border border-white shadow-lg">
                  Referral Program
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">It Pays To</span>
                <br />
                <AnimatedGradientText 
                  className="text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  colorFrom="hsl(0, 0%, 100%)"
                  colorTo="hsl(174, 70%, 85%)"
                >
                  Be Friends
                </AnimatedGradientText>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-white/95 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                Recommend someone and earn <span className="font-semibold text-white">*10% of our net commission</span> when they secure a loan through us!
              </p>
            </ScrollReveal>
          </div>
        </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Referral Form */}
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 mb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Your Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="yourName"
                    name="yourName"
                    required
                    value={formData.yourName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="yourContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="yourContact"
                    name="yourContact"
                    required
                    value={formData.yourContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+65 9123 4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="yourEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="yourEmail"
                    name="yourEmail"
                    required
                    value={formData.yourEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship with Brilliance Advisory *
                  </label>
                  <select
                    id="affiliation"
                    name="affiliation"
                    required
                    value={formData.affiliation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="Non-Staff">Client / External Partner</option>
                    <option value="Staff">Brilliance Advisory Team Member</option>
                    <option value="Partner">Business Partner</option>
                  </select>
                </div>
                
                {formData.affiliation === 'Partner' && (
                  <div className="md:col-span-2">
                    <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-gray-500 text-sm">(if applicable)</span>
                    </label>
                    <input
                      type="text"
                      id="partnerName"
                      name="partnerName"
                      value={formData.partnerName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your company name"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label htmlFor="consultantName" className="block text-sm font-medium text-gray-700 mb-2">
                    Brilliance Advisory Consultant <span className="text-gray-500 text-sm">(if you know one)</span>
                  </label>
                  <input
                    type="text"
                    id="consultantName"
                    name="consultantName"
                    value={formData.consultantName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Leave blank if not applicable"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Your Friend's Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Referral Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="friendName" className="block text-sm font-medium text-gray-700 mb-2">
                    Referral&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    id="friendName"
                    name="friendName"
                    required
                    value={formData.friendName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="friendContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Referral&apos;s Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="friendContact"
                    name="friendContact"
                    required
                    value={formData.friendContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+65 9123 4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="propertyDetails" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type & Requirements <span className="text-gray-500 text-sm">(optional - helps us prepare better)</span>
                  </label>
                  <textarea
                    id="propertyDetails"
                    name="propertyDetails"
                    rows={4}
                    value={formData.propertyDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about their loan needs: Personal or Business loan? Approximate amount? Purpose? Any specific requirements?"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="text-center pt-2">
              <p className="text-xs md:text-sm text-gray-600">
                All information provided will be kept strictly confidential and used only for the purpose of loan advisory and referral assessment.{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}
            {/* Submit Button */}
            <div className="flex items-center justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-teal hover:from-primary-dark hover:to-teal-dark text-white px-12 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    'Submit Referral'
                  )}
              </button>
            </div>
          </form>
          </div>
        </ScrollReveal>

        {/* WhatsApp Alternative */}
        <ScrollReveal delay={0.1}>
          <div className="bg-gradient-to-r from-primary to-teal rounded-2xl shadow-xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Prefer WhatsApp?</h3>
              <p className="text-white/90">You may also submit a referral by messaging us directly.</p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6591234567'}?text=${encodeURIComponent('Hello! I would like to pass a referral to Brilliance Advisory.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-5 h-5" />
              Message Us on WhatsApp
            </a>
          </div>
        </div>
        </ScrollReveal>

        {/* How To Receive Section */}
        <ScrollReveal delay={0.2}>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <AnimatedGradientText className="text-3xl md:text-4xl">
                How Does the Referral Program Work?
              </AnimatedGradientText>
            </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Share Our Services
              </h3>
              <p className="text-gray-600">
                Have someone in mind who needs financing? Spread the word about Brilliance Advisory and how we can help!
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Submit the Referral
              </h3>
              <p className="text-gray-600">
                Fill out the form above with your details and your friend&apos;s information. Our team will reach out to both of you to coordinate the next steps.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Earn Your Reward
              </h3>
              <p className="text-gray-600">
                Once the loan is successfully processed, you&apos;ll receive 10% of our net commission as a thank you for connecting us!
              </p>
            </div>
          </div>
          </div>
        </ScrollReveal>

        {/* FAQ Section */}
        <ScrollReveal delay={0.3}>
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">
                  Quick Answers to your burning questions
                </AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-600">
              Don&apos;t see your question listed?
            </p>
          </div>
          
          <AccordionDark>
            {[
              {
                question: "Who can make a referral?",
                answer: "Anyone may submit a referral — friends, clients, or business contacts."
              },
              {
                question: "When will I receive my referral reward?",
                answer: "Referral rewards are issued after the loan is successfully disbursed. The timeline will be shared clearly by our team."
              },
              {
                question: "Is there a limit to the number of referrals?",
                answer: "No. You may submit multiple referrals."
              },
              {
                question: "Will my referral be obligated to proceed?",
                answer: "No. Our advisory is provided without obligation."
              }
            ].map((faq, index) => (
              <AccordionItemDark
                key={index}
                number={index + 1}
                title={faq.question}
                defaultOpen={index === 0}
              >
                <p>{faq.answer}</p>
              </AccordionItemDark>
            ))}
          </AccordionDark>
          </div>
        </ScrollReveal>

        {/* Terms Section */}
        <ScrollReveal delay={0.4}>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <h3 className="text-xl font-bold text-gray-900">
              Program Terms & Conditions
            </h3>
          </div>
          
          <ul className="space-y-3 text-gray-700 ml-9">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Commission rates vary depending on the loan product and transaction size.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>This program applies exclusively to successful Personal or Business loan applications that you refer to us.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Referral rewards are calculated as <span className="font-semibold">10% of our net commission</span> received from each completed loan transaction.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>All referral payments are considered taxable income and will be declared accordingly for IRAS reporting purposes.</span>
            </li>
          </ul>
        </div>
        </ScrollReveal>
      </div>
    </div>
    </PageTransition>
  )
}
