'use client'

import { useState } from 'react'
import { User, Phone, Mail, Building2, Users, MapPin, Heart, CheckCircle2, Info, Plus, Minus, MessageSquare } from 'lucide-react'
import Link from 'next/link'

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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You! 🙌
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-teal to-primary-dark text-white py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm md:text-base font-medium border border-white/30">
              Referral Program
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            It Pays To<br />
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Be Friends
            </span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
            Recommend someone and earn <span className="font-semibold text-white">*10% of our net commission</span> when they secure a loan through us!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Referral Form */}
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
                    <>
                      Submit Referral <Heart className="w-5 h-5 fill-current" />
                    </>
                  )}
              </button>
            </div>
          </form>
        </div>

        {/* WhatsApp Alternative */}
        <div className="bg-gradient-to-r from-primary to-teal rounded-2xl shadow-xl p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Prefer WhatsApp?</h3>
              <p className="text-white/90">You may also submit a referral by messaging us directly.</p>
            </div>
            <a
              href="https://wa.me/6591234567?text=Hello! I would like to pass a referral to Brilliance Advisory."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-5 h-5" />
              Message Us on WhatsApp
            </a>
          </div>
        </div>

        {/* How To Receive Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            How Does the Referral Program Work?
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

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Heading */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-primary">Quick Answers to</span>{' '}
                <span className="text-teal">your burning</span>{' '}
                <span className="text-primary">questions</span>
              </h2>
              <p className="text-lg text-gray-600">
                Don&apos;t see your question listed?
              </p>
            </div>

            {/* Right Column - FAQ Items */}
            <div className="space-y-6">
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
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between gap-4 text-left group"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-2xl font-bold text-primary flex-shrink-0">
                        {index + 1}.
                      </span>
                      <span className="text-lg font-semibold text-gray-900 flex-1 group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      openFAQ === index
                        ? 'bg-primary text-white'
                        : 'bg-teal-100 text-primary group-hover:bg-teal-200'
                    }`}>
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  {openFAQ === index && (
                    <div className="mt-4 ml-12 pr-12">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Section */}
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
      </div>
    </div>
  )
}
