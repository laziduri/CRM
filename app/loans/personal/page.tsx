'use client'

import Link from 'next/link'
import { 
  Wallet, 
  Home, 
  GraduationCap, 
  Heart, 
  Car, 
  Plane, 
  CreditCard,
  Shield,
  CheckCircle2,
  ArrowRight,
  Users,
  Clock,
  TrendingUp,
  FileText,
  FileCheck,
  Sparkles,
  Target
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'

const personalLoanTypes = [
  {
    icon: Home,
    title: 'Home Renovation',
    description: 'Transform your living space with flexible financing solutions tailored to your renovation budget and timeline.',
    highlight: 'Home improvement',
  },
  {
    icon: GraduationCap,
    title: 'Education Financing',
    description: 'Invest in your future or your family&apos;s education with competitive rates and flexible repayment terms.',
    highlight: 'Education investment',
  },
  {
    icon: Heart,
    title: 'Medical Expenses',
    description: 'Cover unexpected medical costs or elective procedures with immediate access to funds when you need them most.',
    highlight: 'Healthcare support',
  },
  {
    icon: Car,
    title: 'Vehicle Purchase',
    description: 'Finance your next vehicle with attractive rates and convenient repayment options designed to suit your lifestyle.',
    highlight: 'Auto financing',
  },
  {
    icon: Plane,
    title: 'Travel & Lifestyle',
    description: 'Plan your dream vacation or special occasions with flexible financing that adapts to your financial situation.',
    highlight: 'Lifestyle goals',
  },
  {
    icon: Wallet,
    title: 'Debt Consolidation',
    description: 'Simplify your finances by consolidating multiple debts into a single, manageable monthly payment with better terms.',
    highlight: 'Financial clarity',
  },
]

const benefits = [
  {
    icon: Shield,
    title: 'Personalized Advisory',
    description: 'Our experienced financial consultants take time to understand your unique circumstances, offering tailored recommendations that align with your financial goals and repayment capacity.',
  },
  {
    icon: Clock,
    title: 'Flexible Terms',
    description: 'Choose from various loan tenures and repayment structures that complement your income flow and lifestyle, ensuring comfortable monthly installments.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Rates',
    description: 'Access preferential interest rates from our extensive network of trusted banking partners, secured through our established relationships and your creditworthiness.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Experience white-glove service with a dedicated consultant who guides you through every step—from initial consultation to final disbursement and beyond.',
  },
]

const eligibilityCriteria = [
  'Singapore Citizens, Permanent Residents, or foreigners with valid employment passes',
  'Minimum age of 21 years and maximum age of 65 years at loan maturity',
  'Minimum annual income of S$20,000 for Singapore Citizens and PRs (higher thresholds apply for foreigners)',
  'Stable employment with at least 6 months in current position for salaried individuals',
  'Good credit standing with no recent defaults or bankruptcy records',
  'Demonstrable repayment capacity through consistent income documentation',
  'Residential address in Singapore (proof of residence required)',
  'Valid identification documents (NRIC, Passport, or Employment Pass)',
]

const requiredDocuments = [
  {
    icon: FileText,
    name: 'Identification Documents',
    importance: 'Required',
    description: 'NRIC for Singaporeans/PRs, or Passport and valid work pass for foreigners',
  },
  {
    icon: FileCheck,
    name: 'Income Verification',
    importance: 'Required',
    description: 'Recent payslips (last 3 months), CPF contribution statements, or latest Notice of Assessment',
  },
  {
    icon: FileText,
    name: 'Address Proof',
    importance: 'Required',
    description: 'Recent utility bill, bank statement, or tenancy agreement showing Singapore address',
  },
  {
    icon: FileCheck,
    name: 'Employment Proof',
    importance: 'Important',
    description: 'Employment letter or employment contract for income verification purposes',
  },
]

const interestRates = [
  {
    category: 'Major Banks',
    loanAmount: 'S$1,000 – S$200,000',
    interestRate: 'EIR: 3.48% – 11.88% p.a.\n(Flat rate: 2.88% – 9.98% p.a.)',
    tenor: '1 – 7 years',
    processingFee: '0% – 3%',
    processingTime: '1 – 3 business days',
    notes: 'Best rates for high-income earners with excellent credit',
  },
  {
    category: 'Digital Banks',
    loanAmount: 'S$5,000 – S$100,000',
    interestRate: 'EIR: 4.5% – 12.5% p.a.',
    tenor: '1 – 5 years',
    processingFee: '0% – 1%',
    processingTime: 'Same day – 2 business days',
    notes: 'Fast approval process, online application preferred',
  },
  {
    category: 'Licensed Moneylenders',
    loanAmount: 'S$500 – S$6,000',
    interestRate: 'Flat: 1% – 4% per month\n(EIR: varies significantly)',
    tenor: '1 – 12 months',
    processingFee: '10% of principal (capped)',
    processingTime: 'Same day approval',
    notes: 'Higher rates, suitable for smaller amounts and urgent needs',
  },
]

const faqs = [
  {
    number: 1,
    question: 'What makes Brilliance Advisory different from online loan comparison platforms?',
    answer: 'While digital platforms offer automated matching, Brilliance Advisory provides personalized financial consulting through experienced advisors. We take time to understand your financial situation, goals, and preferences through one-on-one consultations. Our consultants leverage their expertise and relationships with banking partners to secure the most favorable terms specifically tailored to your profile. You&apos;ll work directly with a dedicated consultant who guides you through the entire process, answers your questions, and ensures you make informed decisions aligned with your financial objectives.',
  },
  {
    number: 2,
    question: 'How do you determine which loan product is best for my situation?',
    answer: 'Our advisory process begins with a comprehensive consultation where we assess your financial profile, including income stability, credit history, existing obligations, and specific funding needs. We consider factors such as loan purpose, desired amount, repayment capacity, and timeline preferences. Based on this analysis, our consultants recommend suitable options from our curated network of lenders, explaining the rationale behind each recommendation. We present multiple options with clear comparisons, enabling you to make an informed choice that best serves your financial goals.',
  },
  {
    number: 3,
    question: 'What is the maximum loan amount I can access through your advisory service?',
    answer: 'Loan limits vary significantly based on your creditworthiness, income level, and the specific lender. Major banks typically offer personal loans ranging from S$1,000 to S$200,000, with amounts often calculated as multiples of your monthly income (commonly 4 to 10 times). Higher-income individuals with excellent credit profiles may qualify for amounts up to S$300,000 or more. Our consultants will evaluate your profile during the initial consultation and provide realistic guidance on the loan amounts you&apos;re likely to qualify for, along with strategies to optimize your borrowing capacity.',
  },
  {
    number: 4,
    question: 'What documents do I need to prepare for the loan application process?',
    answer: 'Required documentation typically includes identification (NRIC for Singaporeans/PRs, or Passport and Employment Pass for foreigners), income verification (recent payslips, CPF statements, or Notice of Assessment), proof of residence (utility bills or bank statements), and employment confirmation (employment letter or contract). Specific requirements may vary by lender and loan amount. Our consultants will provide you with a personalized checklist during your consultation, ensuring you have all necessary documents prepared before submission, which streamlines the approval process.',
  },
  {
    number: 5,
    question: 'How long does the loan application and approval process typically take?',
    answer: 'Processing times vary by lender type and application complexity. Digital banks and licensed moneylenders can often approve applications within the same day or 1-2 business days, particularly for smaller amounts. Major banks typically require 1-3 business days for standard applications, though this can extend to a week for larger amounts or complex cases requiring additional verification. Our consultants work proactively with lenders to expedite your application and provide regular updates throughout the process. With all documentation prepared, most applications are processed within 3-5 business days.',
  },
  {
    number: 6,
    question: 'Are there any early repayment penalties I should be aware of?',
    answer: 'Early repayment terms differ significantly across lenders. Many banks charge early settlement fees ranging from 2% to 5% of the outstanding principal, typically applicable within the first year or two of the loan tenure. Some lenders offer partial prepayment options without penalties, while others have minimum lock-in periods. Digital banks and certain licensed moneylenders may have more flexible early repayment terms. Our consultants will explain the early repayment conditions for each recommended option, helping you choose a loan structure that accommodates potential future prepayments if this is important to your financial planning.',
  },
  {
    number: 7,
    question: 'Can I apply for a personal loan if I have existing debts or credit cards?',
    answer: 'Yes, you can apply, but approval depends on your total debt service ratio (DSR) and creditworthiness. Lenders typically assess your ability to manage all existing obligations plus the new loan. Generally, banks prefer a total DSR below 40-60% of your gross monthly income, though this varies by lender and income level. If you&apos;re consolidating existing debts, this may actually improve your application profile. Our consultants can help you evaluate your current debt situation, optimize your DSR, and structure an application strategy that enhances your approval prospects.',
  },
  {
    number: 8,
    question: 'How does Brilliance Advisory ensure I get the best interest rates available?',
    answer: 'Our competitive advantage lies in our established relationships with multiple banking partners and our deep understanding of their credit assessment criteria. Our consultants leverage their expertise to present your application in the most favorable light, ensuring all positive factors are highlighted. We also negotiate on your behalf, utilizing our relationship managers and knowledge of current promotions or preferential rates. Additionally, by comparing options across our extensive network, we ensure you receive the most competitive terms available for your specific profile. Our commission structure aligns our interests with yours—we succeed when you secure favorable terms.',
  },
]

export default function PersonalLoansPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden bg-business-stars">
        {/* Animated stars background */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/10 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-light/5 rounded-full blur-3xl opacity-30 animate-float"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6 animate-scale-in">Personal Financing</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-gradient-text animate-float-up">
              Personalized Loan Solutions Tailored to Your Financial Goals
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-float-up-delay-2">
              Experience premium financial advisory with one-on-one consultations. Our expert consultants work directly with you to secure personalized loan solutions that align with your unique needs, whether for home improvements, education, debt consolidation, or life&apos;s important moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-float-up-delay-3">
              <Link href="/apply" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2">
                  Schedule a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center">
                  Speak with an Advisor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What are Personal Loans Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-teal-light/5 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-gradient-text animate-slide-in-left">
                What is a Personal Loan?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4 animate-slide-in-right">
                A personal loan is an unsecured financing solution that provides you with immediate access to funds for various personal needs, from home renovations and education expenses to debt consolidation and significant life events. Unlike secured loans that require collateral, personal loans are approved based on your creditworthiness, income stability, and repayment capacity.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Brilliance Advisory, we believe personal loans should be more than transactional—they should be strategic financial decisions made with expert guidance. Our consultants take a holistic approach to understanding your financial landscape, ensuring the loan structure you choose serves both your immediate needs and long-term financial well-being.
              </p>
            </div>
            
            {/* Key Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary mb-2">Up to S$200,000</div>
                <p className="text-gray-600 text-sm mb-2">Maximum loan amount from major banks</p>
                <p className="text-xs text-gray-500">Higher limits for premium profiles</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl font-bold text-primary mb-2">1 – 7 Years</div>
                <p className="text-gray-600 text-sm">Flexible repayment tenure to suit your needs</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-primary mb-2">No Collateral</div>
                <p className="text-gray-600 text-sm">Unsecured financing based on creditworthiness</p>
              </Card>
              <Card className="p-6 text-center animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl font-bold text-primary mb-2">3.48% - 11.88%</div>
                <p className="text-gray-600 text-sm mb-2">EIR (Effective Interest Rate) p.a.</p>
                <p className="text-xs text-gray-500">Competitive rates with expert negotiation</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Uses of Personal Loans Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-rotate-in">
              Common Uses for Personal Loans
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-float-up-delay-2">
              Whether you&apos;re planning for the future, managing expenses, or pursuing personal goals, our consultants help you structure financing that supports your aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalLoanTypes.map((loan, index) => {
              const Icon = loan.icon
              const delayClasses = [
                'animate-float-up-delay-1',
                'animate-float-up-delay-2',
                'animate-float-up-delay-3',
                'animate-float-up-delay-4',
                'animate-float-up-delay-5',
                'animate-float-up-delay-6',
              ]
              return (
                <Card 
                  key={index} 
                  hover 
                  className={`p-6 h-full flex flex-col ${delayClasses[index] || 'animate-float-up'} transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-teal rounded-lg flex items-center justify-center mb-4 animate-pulse-glow">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="success" className="mb-3">{loan.highlight}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{loan.title}</h3>
                  <p className="text-gray-600 flex-grow">{loan.description}</p>
                  <Link href="/apply" className="mt-4 inline-flex items-center text-primary hover:text-teal font-medium group">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How Personal Loans Work Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] pointer-events-none radial-glow-teal opacity-30 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-slide-in-left">
              How Our Personal Loan Advisory Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4 animate-slide-in-right">
              Unlike automated platforms, our human-led approach ensures every recommendation is carefully tailored to your unique financial profile and personal circumstances.
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
                  hover 
                  className={`p-6 text-center ${delayClasses[index] || 'animate-float-up'} transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
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
                Eligibility Criteria for Personal Loans
              </h2>
              <p className="text-lg text-gray-600 animate-slide-in-right">
                While eligibility requirements vary by lender, our consultants work with you to identify options that best match your profile and optimize your approval prospects.
              </p>
            </div>
            
            <Card className="p-8 animate-scale-in transform hover:scale-[1.02] transition-transform duration-300">
              <div className="space-y-4">
                {eligibilityCriteria.map((criterion, index) => {
                  const delays = ['', '0.1s', '0.2s', '0.3s', '0.4s', '0.5s', '0.6s', '0.7s']
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
                <strong>Note:</strong> Meeting minimum eligibility criteria doesn&apos;t guarantee approval. Lenders assess multiple factors including credit history, debt-to-income ratio, and employment stability. Our consultants provide personalized guidance on improving your application profile and can recommend lenders whose criteria align best with your situation.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg" className="inline-flex items-center justify-center gap-2">
                  Assess Your Eligibility
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interest Rates Comparison Table Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-slide-in-left">
              Interest Rates & Terms
            </h2>
            <p className="text-lg text-gray-600 mb-2 animate-slide-in-right">
              Interest rates are determined by your credit profile, income level, loan amount, and chosen lender. Our consultants leverage their expertise and relationships to negotiate the most favorable terms available for your specific situation.
            </p>
            <p className="text-sm text-gray-500 animate-float-up-delay-2">
              <strong>Important:</strong> The Effective Interest Rate (EIR) reflects the true cost of borrowing, including all fees and charges. Processing fees vary from 0% to 3% for banks, with licensed moneylenders charging up to 10% of the principal amount (capped by MAS regulations).
            </p>
          </div>
          
          <div className="overflow-x-auto animate-scale-in" style={{ opacity: 0 }}>
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-xl border border-secondary-gray3/50 shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
                <table className="min-w-full divide-y divide-secondary-gray3/30 bg-white">
                  <thead className="bg-gradient-to-r from-primary to-teal">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Loan Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Interest Rate (EIR)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tenor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Processing Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-gray3/30 bg-white">
                    {interestRates.map((rate, index) => (
                      <tr key={index} className="hover:bg-secondary-gray/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{rate.category}</span>
                          {rate.notes && (
                            <div className="text-xs text-gray-500 mt-1">{rate.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 whitespace-pre-line">{rate.loanAmount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 whitespace-pre-line">{rate.interestRate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{rate.tenor}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{rate.processingFee}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{rate.processingTime}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/calculator">
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white inline-flex items-center justify-center gap-2">
                Calculate Your Loan Repayment
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-teal-light/5 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-rotate-in">
              Required Documents
            </h2>
            <p className="text-lg text-gray-600 animate-slide-in-right">
              Prepare these documents in advance to streamline your application process. Our consultants will provide a personalized checklist based on your specific lender selection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requiredDocuments.map((doc, index) => {
              const Icon = doc.icon
              const delayClasses = [
                'animate-scale-in',
                'animate-scale-in',
                'animate-scale-in',
                'animate-scale-in',
              ]
              return (
                <Card 
                  key={index} 
                  hover 
                  className={`p-6 text-center ${delayClasses[index] || 'animate-scale-in'} transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge 
                    variant={doc.importance === 'Required' ? 'primary' : 'warning'} 
                    className="mb-3"
                  >
                    {doc.importance}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.name}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/apply">
              <Button variant="primary" size="lg" className="inline-flex items-center justify-center gap-2">
                Begin Your Application
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] pointer-events-none radial-glow-teal opacity-40 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-slide-in-left">
              Why Choose Brilliance Advisory for Your Personal Loan Needs?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card hover className="p-8 animate-slide-in-left transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Personalized Consultative Approach</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We prioritize understanding your unique financial situation through comprehensive one-on-one consultations. Unlike automated platforms that simply match profiles to products, our experienced consultants take time to understand your goals, assess your repayment capacity, and recommend solutions that genuinely serve your best interests. Every recommendation is backed by careful analysis and explained in terms you can understand.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card hover className="p-8 animate-slide-in-right transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Strategic Loan Structuring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our consultants don&apos;t just find you a loan—they help you structure financing strategically. We consider factors like your existing obligations, future financial plans, and overall debt management strategy. Whether you&apos;re consolidating debts, financing a major purchase, or managing unexpected expenses, we ensure the loan terms complement your broader financial picture rather than merely addressing an immediate need.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card hover className="p-8 animate-slide-in-left transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Preferential Rates Through Relationships</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our established relationships with leading banks and financial institutions enable us to negotiate preferential terms on your behalf. We leverage our understanding of each lender&apos;s criteria, current promotions, and preferential rate structures to present your application optimally. This often results in more favorable interest rates and terms than what you might secure through direct applications.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card hover className="p-8 animate-slide-in-right transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ongoing Support & Relationship Building</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our commitment extends beyond loan approval and disbursement. Your dedicated consultant remains accessible for questions, guidance on repayment strategies, or future financial needs. We view our relationship as a long-term partnership, helping you navigate your financial journey with expert advice and genuine care for your financial well-being.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-40 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight animate-gradient-text">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have additional questions or ready to begin?
              </p>
              <Link href="/contact">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  Schedule Your Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right Side - FAQ Accordions */}
            <div>
              <AccordionDark>
                {faqs.map((faq) => (
                  <AccordionItemDark 
                    key={faq.number} 
                    number={faq.number} 
                    title={faq.question}
                    defaultOpen={false}
                  >
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </AccordionItemDark>
                ))}
              </AccordionDark>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-teal to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-gradient-text-white">
            Ready to Explore Your Personal Loan Options?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the difference of personalized financial advisory. Schedule a consultation with one of our expert consultants and discover loan solutions tailored specifically to your needs and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/apply">
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90 text-lg px-8 py-6 inline-flex items-center justify-center gap-2">
                Schedule Your Consultation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 inline-flex items-center justify-center">
                Contact an Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
