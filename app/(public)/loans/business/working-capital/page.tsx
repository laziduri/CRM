'use client'

import Link from 'next/link'
import { 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const benefits = [
  {
    icon: DollarSign,
    title: 'Manage Daily Operations',
    description: 'Cover essential expenses like payroll, rent, utilities, and inventory purchases to ensure smooth business operations without cash flow disruptions.',
  },
  {
    icon: Shield,
    title: 'Bridge Cash Flow Gaps',
    description: 'Address short-term cash flow challenges when customers delay payments or during seasonal fluctuations, maintaining operational continuity.',
  },
  {
    icon: TrendingUp,
    title: 'Seize Growth Opportunities',
    description: 'Take advantage of bulk purchase discounts, expand inventory for peak seasons, launch new products, or enter new markets when opportunities arise.',
  },
  {
    icon: Clock,
    title: 'Flexible Repayment Options',
    description: 'Choose repayment tenures up to 5 years with fixed monthly payments that align with your business cash flow, making financial planning easier.',
  },
]

const eligibilityCriteria = [
  'Registered and operating in Singapore (minimum 1-2 years depending on lender)',
  'Minimum 30% local shareholding (Singaporean or PR ownership)',
  'Annual group sales not exceeding S$100 million OR employment size not exceeding 200 employees',
  'At least 6 months of business operations with consistent revenue',
  'Ability to demonstrate repayment capacity through financial statements',
  'Personal guarantor(s) required - at least one with good credit standing',
  'No default or bankruptcy records outstanding',
  'Minimum annual income of S$24,000 for guarantor(s)',
]

export default function WorkingCapitalLoanPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/10 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/loans/business"
              className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Business Loans
            </Link>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="primary" className="mb-6 animate-scale-in">Working Capital Loan</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-gradient-text animate-float-up">
              Working Capital Loans
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-float-up-delay-2">
              Get up to S$500,000 in working capital financing to manage operations and fuel growth.
            </p>
          </div>
        </div>
      </section>

      {/* What is Working Capital Loan Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-teal-light/5 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-gradient-text animate-slide-in-left">
                What is a Working Capital Loan?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4 animate-slide-in-right">
                A Working Capital Loan is a type of financing specifically designed to help small and medium-sized enterprises (SMEs) manage their daily operational expenses, bridge cash flow gaps, and support business growth. These unsecured loans provide quick access to funds without requiring collateral, making them ideal for businesses that need immediate working capital.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 animate-slide-in-left">
                Under Singapore&apos;s Enterprise Financing Scheme (EFS), eligible SMEs can access up to <strong>S$500,000</strong> in working capital financing. The government provides a 50% default risk share, while younger companies (incorporated within the last 5 years) enjoy a higher risk share of 70%, making it easier to secure funding.
              </p>
            </div>
            
            {/* Key Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary mb-2">Up to S$500,000</div>
                <p className="text-gray-600 text-sm mb-2">Maximum under EFS Working Capital Loan</p>
                <p className="text-xs text-gray-500">DBS: S$300k | OCBC: S$700k | UOB: S$800k</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl font-bold text-primary mb-2">Up to 5 Years</div>
                <p className="text-gray-600 text-sm">Flexible repayment tenure to suit your cash flow</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-primary mb-2">No Collateral</div>
                <p className="text-gray-600 text-sm">Unsecured financing - no assets required</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl font-bold text-primary mb-2">5% - 12%</div>
                <p className="text-gray-600 text-sm mb-2">EIR (Effective Interest Rate) p.a.</p>
                <p className="text-xs text-gray-500">Competitive rates with government support</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How Working Capital Loans Work Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] pointer-events-none radial-glow-teal opacity-30 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-slide-in-left">
              How does a Working Capital Loan Work?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4 animate-slide-in-right">
              Working Capital Loans provide flexible financing to cover your day-to-day operational expenses, ensuring smooth business operations and enabling you to seize growth opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const delayClasses = [
                'animate-float-up-delay-1',
                'animate-float-up-delay-2',
                'animate-float-up-delay-3',
                'animate-float-up-delay-4',
              ]
              return (
                <Card 
                  key={index} 
                  className={`p-6 text-center ${delayClasses[index] || 'animate-float-up'}`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-light/5 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-rotate-in">
                Eligibility Criteria for Working Capital Loans
              </h2>
              <p className="text-lg text-gray-600 animate-slide-in-right">
                To qualify for an EFS Working Capital Loan, companies must meet specific eligibility requirements set by Enterprise Singapore and participating financial institutions.
              </p>
            </div>
            
            <Card className="p-8 animate-scale-in transform hover:scale-[1.02] transition-transform duration-300">
              <div className="space-y-4">
                {eligibilityCriteria.map((criterion, index) => {
                  const delays = ['', '0.1s', '0.2s', '0.3s', '0.4s', '0.5s', '0.6s', '0.7s', '0.8s']
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 animate-slide-in-right"
                      style={{ 
                        animationDelay: delays[index] || `${index * 0.1}s`,
                        opacity: 0
                      }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center mt-0.5 animate-pulse-glow">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-gray-700 flex-grow">{criterion}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>Important:</strong> While most banks require 1-2 years of operating history, some lenders may consider newer businesses with strong financial projections or existing relationships. Businesses that don&apos;t meet EFS criteria may still qualify for non-EFS working capital loans from banks or alternative lenders, though terms and rates may differ. It&apos;s advisable to consult with our team to explore the best option for your specific situation.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg" className="inline-flex items-center justify-center gap-2">
                  Check Your Eligibility
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-teal to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Apply for a Working Capital Loan?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get started today and unlock the funding your business needs to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/apply">
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90 text-lg px-8 py-6 inline-flex items-center justify-center gap-2">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 inline-flex items-center justify-center">
                Speak to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
