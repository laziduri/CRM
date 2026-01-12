'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Users,
  Clock,
  Percent,
  FileCheck,
  BarChart3,
  CreditCard,
  Receipt
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'

const businessLoanTypes = [
  {
    icon: Briefcase,
    title: 'Business Term Loan',
    description: 'The most versatile loan for all your business needs. Get up to 6x your monthly cashflow. Repay monthly.',
    highlight: 'Collateral-free',
  },
  {
    icon: Receipt,
    title: 'Invoice Financing',
    description: 'Unlock trapped cash in your receivables. Get up to 80% of your invoice value immediately.',
    highlight: 'Fast approval',
  },
  {
    icon: Building2,
    title: 'Property-Backed Loan',
    description: 'Up to 80% LTV for new purchase, refinancing or equity cash-out. Options to pay interest only.',
    highlight: 'Lower rates',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Based Financing',
    description: 'Similar to a business term loan but repay based on a percentage of your revenue.',
    highlight: 'Flexible repayment',
  },
  {
    icon: CreditCard,
    title: 'Line of Credit',
    description: 'Get a standby credit facility for urgent use, pay interest only when you utilize.',
    highlight: 'On-demand',
  },
  {
    icon: BarChart3,
    title: 'Working Capital Loan',
    description: 'Unsecured financing up to S$500,000 under Enterprise Financing Scheme. Maximum tenure of up to 5 years. Interest rates from 5% to 12% p.a. (EIR). Government risk share support available.',
    highlight: 'Government-assisted',
  },
]

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

const requiredDocuments = [
  {
    icon: FileText,
    name: '6 Months Bank Statement',
    importance: 'Required',
    description: 'Recent bank statements showing business cash flow',
  },
  {
    icon: FileCheck,
    name: 'Financial Statements',
    importance: 'Required',
    description: 'Past 2 years financial statements or management accounts',
  },
  {
    icon: FileText,
    name: 'Credit Bureau Report',
    importance: 'Important',
    description: 'CBS report for guarantor(s) - at least one required',
  },
  {
    icon: FileCheck,
    name: 'Notice of Assessment',
    importance: 'Required',
    description: 'Personal NOA for the 2 latest years for guarantor(s)',
  },
]

const interestRates = [
  {
    category: 'Banks (EFS Working Capital Loan)',
    loanAmount: 'Up to S$500,000\n(DBS: up to S$300k\nOCBC: up to S$700k\nUOB: up to S$800k)',
    interestRate: 'EIR: 5% – 12% p.a.\n(Flat rate: 3.6% – 5.5% p.a.)',
    tenor: 'Up to 5 years',
    processingFee: '1% – 3%',
    processingTime: '1 – 3 weeks',
    notes: 'Government risk share: 50% (70% for companies < 5 years)',
  },
  {
    category: 'Digital Banks',
    loanAmount: 'S$30,000 – S$300,000',
    interestRate: 'EIR: 6% – 12% p.a.',
    tenor: '1 – 5 years',
    processingFee: '1% – 2%',
    processingTime: '1 – 2 weeks',
    notes: 'Faster approval process, online application',
  },
  {
    category: 'Non-Bank Lenders',
    loanAmount: 'S$10,000 – S$1,000,000',
    interestRate: 'Flat: 1.5% – 4% per month\n(EIR: 6% – 36% p.a.)',
    tenor: '6 – 24 months',
    processingFee: '2% – 5%',
    processingTime: '1 – 5 business days',
    notes: 'More flexible eligibility, higher rates',
  },
]

const faqs = [
  {
    number: 1,
    question: 'What types of businesses benefit from Working Capital Loans?',
    answer: 'Working Capital Loans are ideal for SMEs that need funds to manage daily operations, bridge temporary cash flow gaps, or seize growth opportunities. This includes businesses that: (1) Experience seasonal fluctuations in revenue, (2) Need to pay suppliers before receiving customer payments, (3) Require funds for inventory purchases, payroll, or rent, (4) Want to take advantage of bulk purchase discounts or business expansion opportunities. Businesses registered in Singapore with at least 30% local shareholding and annual sales not exceeding S$100 million are eligible for EFS Working Capital Loans.',
  },
  {
    number: 2,
    question: 'Are there cheaper financing options than a Working Capital Loan?',
    answer: 'Yes, if you have available collaterals, secured options typically offer lower interest rates. Property-backed loans can offer rates as low as 3% p.a. If you have outstanding invoices, invoice financing can provide rates of 3-4% p.a., which is often lower than unsecured working capital loans. However, working capital loans under the EFS scheme offer competitive rates (5-12% p.a. EIR) with government risk-sharing support, making them attractive for businesses without collateral.',
  },
  {
    number: 3,
    question: 'What is the maximum amount I can take from a Working Capital Loan?',
    answer: 'Under the Enterprise Financing Scheme (EFS), eligible SMEs can access up to S$500,000 in working capital financing. The government provides a 50% default risk share, while younger companies (incorporated within the last 5 years) enjoy a higher risk share of 70%. Individual bank limits vary: DBS offers up to S$300,000, OCBC up to S$700,000, and UOB up to S$800,000 for working capital loans. Non-bank lenders typically offer S$10,000 to S$1,000,000 depending on your business profile and creditworthiness.',
  },
  {
    number: 4,
    question: 'What documents do I need to prepare before applying for a Working Capital Loan?',
    answer: 'Required documents typically include: (1) Past 6 months of business bank statements, (2) Financial statements for the past 2 years (Management Accounts are acceptable if audited statements are not available), (3) Credit Bureau Singapore (CBS) report for guarantor(s) - at least one guarantor required, (4) Personal Notice of Assessment (NOA) for the 2 latest years for guarantor(s), (5) Company registration documents (ACRA BizFile), (6) Business licenses (if applicable). For loans above S$50,000, additional documentation may be required. Some lenders offer simplified documentation for smaller loan amounts.',
  },
  {
    number: 5,
    question: 'How long does a Working Capital Loan application usually take?',
    answer: 'Processing times vary by lender type. Banks typically take 1-3 weeks for assessment and approval, with UOB offering feedback within 1 business day for initial eligibility. Digital banks generally process applications in 1-2 weeks due to streamlined online processes. Non-bank lenders can approve and disburse funds as quickly as 1-5 business days, making them ideal for urgent funding needs. Processing time largely depends on document completeness, business creditworthiness, and the loan amount requested. The Enterprise Financing Scheme does not significantly extend processing times.',
  },
  {
    number: 6,
    question: 'What are the penalties for paying my business loan earlier?',
    answer: 'Most banks have an early repayment penalty applicable of about 2-5%. Some non-bank lenders allow for early repayment without fee, and some have a minimum loan period of 6 months and is without fee after that period. It&apos;s important to clarify the early repayment terms with your lender before signing the loan agreement.',
  },
  {
    number: 7,
    question: 'How many guarantors are needed and how do I know if they qualify?',
    answer: 'Typically at least one personal guarantor is required. The guarantor needs to be qualified such that they: Have at least an annual income of more than S$24,000, Is a Singaporean or PR, and Has no default or bankruptcy records outstanding. The guarantor&apos;s credit score also plays a crucial role in loan approval and interest rate determination.',
  },
  {
    number: 8,
    question: 'How long are typical Working Capital Loan repayment periods?',
    answer: 'Working Capital Loans typically offer repayment periods of up to 5 years. Banks (DBS, OCBC, UOB) generally offer maximum tenures of 5 years, which allows for smaller monthly payments and better cash flow management. Digital banks offer flexible tenures from 1 to 5 years. Non-bank lenders typically provide shorter tenures of 6 to 24 months. The tenure you qualify for depends on your business&apos;s financial health, cash flow projections, and the lender&apos;s risk assessment. Longer tenures mean lower monthly payments but higher total interest costs.',
  },
]

export default function BusinessLoansPage() {
  const [cardsFanned, setCardsFanned] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setCardsFanned(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <Badge variant="primary" className="mb-6 animate-scale-in">Business Financing</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-gradient-text animate-float-up">
                Working Capital Loans to Fuel Your Business Growth
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-float-up-delay-2">
                Access up to S$500,000 in working capital financing to manage daily operations, bridge cash flow gaps, and seize growth opportunities. Connect with Singapore&apos;s leading banks and financial institutions through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-float-up-delay-3">
                <Link href="/apply" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2">
                    Get Started Today
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center">
                    Speak to an Expert
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Loan Offer Cards (Photo-like visual) */}
            <div className="relative h-auto md:h-[380px] flex flex-col md:block items-center md:items-start justify-center mb-8 md:mb-0 gap-4 md:gap-0">
              {/* Mobile: Stack vertically without overlap */}
              <div className="md:hidden w-full max-w-[280px] space-y-4">
                {/* First Card - DBS */}
                <div className="w-full bg-white rounded-lg shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-primary">DBS</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Business Term Loan</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,155</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.90%</div>
                    </div>
                  </div>
                  {/* Improved buttons */}
                  <div className="flex gap-2 pointer-events-none">
                    <div className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white border-2 border-teal/30 bg-gradient-to-r from-teal/5 to-teal-light/5 text-teal-700 shadow-sm">
                      MORE INFO
                    </div>
                    <div className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal to-teal-light text-white shadow-md">
                      CHOOSE OFFER
                    </div>
                  </div>
                </div>
                
                {/* Second Card - CIMB */}
                <div className="w-full bg-white rounded-lg shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-red-600">CIMB</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Working Capital Loan</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,160</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.91%</div>
                    </div>
                  </div>
                  {/* Improved buttons */}
                  <div className="flex gap-2 pointer-events-none">
                    <div className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white border-2 border-teal/30 bg-gradient-to-r from-teal/5 to-teal-light/5 text-teal-700 shadow-sm">
                      MORE INFO
                    </div>
                    <div className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal to-teal-light text-white shadow-md">
                      CHOOSE OFFER
                    </div>
                  </div>
                </div>
                
                {/* Third Card - CIMB */}
                <div className="w-full bg-white rounded-lg shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-red-600">CIMB</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Working Capital Loan</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,160</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.91%</div>
                    </div>
                  </div>
                  {/* Improved buttons */}
                  <div className="flex gap-2 pointer-events-none">
                    <div className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white border-2 border-teal/30 bg-gradient-to-r from-teal/5 to-teal-light/5 text-teal-700 shadow-sm">
                      MORE INFO
                    </div>
                    <div className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal to-teal-light text-white shadow-md">
                      CHOOSE OFFER
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Overlapping cards with fan-out animation */}
              <div className="hidden md:block relative w-full max-w-[320px] h-[420px] ml-auto">
                {/* Third Card - UOB (Top, Behind) */}
                <div 
                  className={`absolute w-[260px] bg-white rounded-xl shadow-xl p-5 border border-gray-100 transition-all duration-1000 ease-out ${
                    cardsFanned 
                      ? 'top-0 right-12 rotate-[-4deg] z-10 opacity-90' 
                      : 'bottom-0 left-0 rotate-0 z-10 opacity-60'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-primary">UOB</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Business Term Loan</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,158</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.89%</div>
                    </div>
                  </div>
                </div>

                {/* First Card - DBS (Middle) */}
                <div 
                  className={`absolute w-[260px] bg-white rounded-xl shadow-xl p-5 border border-gray-100 transition-all duration-1000 ease-out ${
                    cardsFanned 
                      ? 'top-[40px] right-6 rotate-[-2deg] z-20 opacity-95' 
                      : 'bottom-0 left-0 rotate-0 z-20 opacity-75'
                  }`}
                  style={{ transitionDelay: cardsFanned ? '0.1s' : '0s' }}
                >
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-primary">DBS</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Business Term Loan</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,155</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.90%</div>
                    </div>
                  </div>
                </div>
                
                {/* Second Card - CIMB (Bottom, Front) - Main visible card */}
                <div 
                  className={`absolute w-[260px] bg-white rounded-xl shadow-2xl p-5 border border-gray-100 transition-all duration-1000 ease-out ${
                    cardsFanned 
                      ? 'bottom-0 left-0 rotate-[3deg] z-30' 
                      : 'bottom-0 left-0 rotate-0 z-30'
                  }`}
                  style={{ transitionDelay: cardsFanned ? '0.2s' : '0s' }}
                >
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-bold text-red-600">CIMB</div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Working Capital Loan</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Approved Loan</div>
                      <div className="text-lg font-bold text-gray-900">$100,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Cost</div>
                      <div className="text-lg font-bold text-gray-900">$3,160</div>
                    </div>
                    <div>
                      <div className="text-xs text-teal-600 mb-0.5">Monthly Rate</div>
                      <div className="text-lg font-bold text-gray-900">0.91%</div>
                    </div>
                  </div>
                  {/* Improved buttons */}
                  <div className="flex gap-2 pointer-events-none">
                    <div className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-teal/5 to-teal-light/5 border-2 border-teal/30 text-teal-700 shadow-sm">
                      MORE INFO
                    </div>
                    <div className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal to-teal-light text-white shadow-md">
                      CHOOSE OFFER
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Types of Business Loans Section */}
      <section className="py-20 bg-white relative overflow-hidden bg-business-stars">
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-rotate-in">
              Types of Business Loans We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-float-up-delay-2">
              Unlock cashflow, leverage on your properties, or simply get a loan to finance your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessLoanTypes.map((loan, index) => {
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
                  className={`p-6 h-full flex flex-col group ${delayClasses[index] || 'animate-float-up'} transform hover:scale-105 transition-all duration-300 hover:bg-gradient-to-br hover:from-primary hover:via-teal hover:to-primary-dark hover:border-teal-light`}
                >
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-teal rounded-lg flex items-center justify-center mb-4 group-hover:bg-white group-hover:from-white group-hover:to-white transition-all duration-300">
                      <Icon className="w-7 h-7 text-white group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <Badge variant="success" className="mb-3 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30">{loan.highlight}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">{loan.title}</h3>
                  <p className="text-gray-600 flex-grow group-hover:text-white/95 transition-colors duration-300">{loan.description}</p>
                  <Link href="/apply" className="mt-4 inline-flex items-center text-primary hover:text-teal font-medium group-hover:text-white transition-colors duration-300 group/link">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How Business Term Loans Work Section */}
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
              Interest rates vary based on your credit profile, business performance, and the lender. Banks typically offer EIR (Effective Interest Rate) of 5% to 12% p.a. for working capital loans under the Enterprise Financing Scheme.
            </p>
            <p className="text-sm text-gray-500 animate-float-up-delay-2">
              <strong>Note:</strong> EIR is the actual cost of borrowing including all fees. Processing fees typically range from 1% to 3% for banks, and 2% to 5% for non-bank lenders. Government-assisted EFS Working Capital Loans offer competitive rates with risk-sharing support.
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
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
                Calculate Your Loan Repayment
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
              Ensure you have these documents ready before applying!
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
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:from-white group-hover:to-white transition-all duration-300">
                    <Icon className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <Badge 
                    variant={doc.importance === 'Required' ? 'primary' : 'warning'} 
                    className="mb-3 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30"
                  >
                    {doc.importance}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">{doc.name}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/95 transition-colors duration-300">{doc.description}</p>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/apply">
              <Button variant="primary" size="lg">
                Apply Now
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
              Why Get Your Working Capital Loan Through Brilliance Advisory?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card hover className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">A Team That Will Support You</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We have a dedicated team that will walk you through your entire loan process and help you do the market research you need.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card hover className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">We Let Lenders Compete for Your Loan</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Be ready to be spoilt for choice when we help you compare the best deals across all banks and non-banks so you only get the lowest interest rate and the highest cash out amount. Our rates are same as what the banks can offer or even better.
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text animate-rotate-in">
                Frequently Asked Questions
              </h2>
            </div>
            
            <AccordionDark>
              {faqs.map((faq) => (
                <AccordionItemDark 
                  key={faq.number} 
                  number={faq.number} 
                  title={faq.question}
                  defaultOpen={faq.number === 1}
                >
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </AccordionItemDark>
              ))}
            </AccordionDark>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Link href="/contact">
                <Button variant="primary" size="lg" className="inline-flex items-center justify-center gap-2">
                  Contact Us
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
            Take your business to the next level with the financial boost it needs!
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Apply for a business loan today and unlock growth opportunities like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/apply">
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90 text-lg px-8 py-6 inline-flex items-center justify-center gap-2">
                Apply for a Business Loan
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