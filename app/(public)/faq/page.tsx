'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { ArrowRight, BookOpen, TrendingUp, Building2, HelpCircle } from 'lucide-react'

// Most Popular FAQs
const mostPopularFAQs = [
  {
    question: 'What is Brilliance Advisory and how do you differ from online loan comparison platforms?',
    answer: 'Brilliance Advisory is a Singapore-based financial consultancy that provides human-led advisory services for personal and business loans. Unlike automated comparison platforms, our advisors work directly with you to understand your financial situation, goals, and constraints. We provide personalised recommendations, help you prepare your application, and guide you through the entire process with ongoing support.',
  },
  {
    question: 'How much does your advisory service cost?',
    answer: 'Our consultation fees are assessed on a case-by-case basis, depending on the scope and complexity of work involved. We maintain relationships with various financial institutions, and when a loan is successfully arranged through our advisory, we may also receive a referral fee from the lender. All applicable fees will be clearly explained and agreed upon before any engagement of services. There are no hidden charges.',
  },
  {
    question: 'What are the basic eligibility requirements for a personal loan in Singapore?',
    answer: 'Basic requirements typically include being between 21 and 65 years old, earning a minimum monthly income (usually $2,000 to $3,000 depending on the lender), and being a Singapore citizen, Permanent Resident, or holding a valid Employment Pass. Some lenders may have additional criteria such as minimum employment tenure or specific income thresholds.',
  },
  {
    question: 'How much can I borrow with a personal loan?',
    answer: 'Loan amounts vary by lender and your income profile. Banks typically allow borrowing up to 4 to 8 times your monthly salary, while licensed moneylenders may offer up to 6 times your monthly income. The actual amount approved depends on your credit assessment, existing debt obligations, and the lender\'s policies.',
  },
  {
    question: 'What types of business loans are available in Singapore?',
    answer: 'Common business loan types include term loans (fixed amount repaid over a set period), working capital loans (for daily operations), trade financing (for import/export activities), equipment financing (for machinery and equipment purchases), invoice financing (against outstanding invoices), and lines of credit (flexible credit facilities). Each serves different business needs and has varying eligibility requirements.',
  },
]

// About Brilliance Advisory FAQs
const aboutFAQs = [
  {
    question: 'What is Brilliance Advisory and how do you differ from online loan comparison platforms?',
    answer: 'Brilliance Advisory is a Singapore-based financial consultancy that provides human-led advisory services for personal and business loans. Unlike automated comparison platforms, our advisors work directly with you to understand your financial situation, goals, and constraints. We provide personalised recommendations, help you prepare your application, and guide you through the entire process with ongoing support.',
  },
  {
    question: 'Is Brilliance Advisory a licensed lender?',
    answer: 'We are not a lender. Brilliance Advisory operates as a financial consultancy that provides advisory services. We do not lend money directly. Our role is to provide expert guidance and connect you with suitable lenders from our network of banks and licensed financial institutions in Singapore.',
  },
  {
    question: 'How much does your advisory service cost?',
    answer: 'Our consultation fees are assessed on a case-by-case basis, depending on the scope and complexity of work involved. We maintain relationships with various financial institutions, and when a loan is successfully arranged through our advisory, we may also receive a referral fee from the lender. All applicable fees will be clearly explained and agreed upon before any engagement of services. There are no hidden charges.',
  },
  {
    question: 'What qualifications and experience do your advisors have?',
    answer: 'Our advisors are experienced professionals with deep knowledge of Singapore\'s lending market. They stay current with bank policies, interest rate trends, and regulatory requirements. Our team understands the nuances of different loan products and can help you navigate eligibility criteria, documentation requirements, and application processes across multiple lenders.',
  },
  {
    question: 'Which banks and financial institutions do you work with?',
    answer: 'We maintain relationships with a network of major banks and licensed financial institutions in Singapore, including local banks, international banks, and licensed moneylenders. The specific lenders we recommend depend on your profile, loan requirements, and eligibility. We focus on institutions that offer competitive terms and reliable service standards.',
  },
  {
    question: 'How do you protect my personal and financial information?',
    answer: 'We take data protection seriously and comply with Singapore\'s Personal Data Protection Act (PDPA). Your information is shared only with lenders you choose to apply with, and only after you provide explicit consent. We use secure systems to store and transmit data, and we do not sell or share your information with third parties for marketing purposes.',
  },
  {
    question: 'What happens if I\'m not satisfied with the loan options you recommend?',
    answer: 'You are under no obligation to proceed with any loan recommendation. Our advisory service is designed to provide you with information and options. If the suggested loans don\'t meet your needs or expectations, you can decline to proceed. We can also explore alternative options or discuss other financing strategies that might be more suitable for your situation.',
  },
  {
    question: 'How long does the advisory process typically take?',
    answer: 'The initial consultation and assessment usually takes one to two business days. Once we understand your needs and you\'ve provided the necessary information, we can typically present suitable loan options within a few days. The overall timeline depends on your responsiveness, the complexity of your situation, and the lenders\' processing times for applications.',
  },
  {
    question: 'Do you provide ongoing support after a loan is approved?',
    answer: 'Yes, we provide support throughout the application process and can assist with questions that arise after loan approval. While the loan relationship is directly between you and the lender, we remain available to help clarify terms, discuss refinancing options if your circumstances change, or assist with future financing needs.',
  },
  {
    question: 'Can you help if I have a poor credit history or have been rejected by banks before?',
    answer: 'Yes, we can help assess your situation and explore options that may be available despite previous rejections or credit challenges. This may include lenders with different eligibility criteria, alternative loan structures, or strategies to improve your application profile. However, we cannot guarantee approval, as final decisions rest with the lenders.',
  },
  {
    question: 'Do you offer services for both individuals and businesses?',
    answer: 'Yes, we provide advisory services for both personal loans and business loans. Our team has expertise in both areas and can help individuals secure personal financing as well as assist businesses with various corporate financing needs, including term loans, working capital facilities, and other business credit solutions.',
  },
  {
    question: 'How do I get started with Brilliance Advisory?',
    answer: 'You can contact us through our website, phone, or email to schedule an initial consultation. During this conversation, we\'ll discuss your financing needs, review your situation, and explain how our advisory process works. There\'s no obligation to proceed, and we\'ll only move forward if you\'re comfortable with our approach and recommendations.',
  },
]

// Personal Loans FAQs
const personalLoanFAQs = [
  {
    question: 'What are the basic eligibility requirements for a personal loan in Singapore?',
    answer: 'Basic requirements typically include being between 21 and 65 years old, earning a minimum monthly income (usually $2,000 to $3,000 depending on the lender), and being a Singapore citizen, Permanent Resident, or holding a valid Employment Pass. Some lenders may have additional criteria such as minimum employment tenure or specific income thresholds.',
  },
  {
    question: 'How much can I borrow with a personal loan?',
    answer: 'Loan amounts vary by lender and your income profile. Banks typically allow borrowing up to 4 to 8 times your monthly salary, while licensed moneylenders may offer up to 6 times your monthly income. The actual amount approved depends on your credit assessment, existing debt obligations, and the lender\'s policies.',
  },
  {
    question: 'What interest rates can I expect for personal loans?',
    answer: 'Interest rates in Singapore typically range from 3.5% to 10% per annum for bank loans, depending on your credit profile, loan amount, and tenure. Licensed moneylenders may charge higher rates, up to the legal maximum. Rates are influenced by factors such as your credit score, income stability, and the lender\'s risk assessment of your application.',
  },
  {
    question: 'What documents do I need to apply for a personal loan?',
    answer: 'Commonly required documents include your NRIC or passport, recent payslips (usually last 3 months), CPF contribution history or bank statements showing salary credits, employment letter or contract, and your Credit Bureau Singapore (CBS) report. Some lenders may request additional documents depending on your employment type or income structure.',
  },
  {
    question: 'How long does it take to get approved for a personal loan?',
    answer: 'Approval times vary by lender. Banks typically take 1 to 5 business days for assessment, while licensed moneylenders may process applications faster, sometimes within the same day. The timeline depends on the completeness of your application, the lender\'s internal processes, and whether additional verification is required.',
  },
  {
    question: 'Can I get a personal loan if I\'m self-employed or a freelancer?',
    answer: 'Yes, but the process may be more complex. Self-employed applicants typically need to provide additional documentation such as Notice of Assessment from IRAS, bank statements showing consistent income over 6 to 12 months, and business registration documents. Some lenders may have stricter requirements or offer different terms for self-employed borrowers.',
  },
  {
    question: 'What is the typical loan tenure for personal loans?',
    answer: 'Personal loan tenures in Singapore typically range from 1 to 7 years. Shorter tenures result in higher monthly repayments but lower total interest, while longer tenures reduce monthly payments but increase total interest paid. The maximum tenure offered depends on the lender and your loan amount.',
  },
  {
    question: 'Are there any fees I should be aware of?',
    answer: 'Common fees include processing fees (typically 1% to 3% of the loan amount), late payment fees, early repayment penalties (if you pay off the loan before the agreed tenure), and annual fees in some cases. Always review the loan terms carefully to understand all applicable charges before accepting an offer.',
  },
  {
    question: 'Can I use a personal loan for debt consolidation?',
    answer: 'Yes, personal loans are commonly used for debt consolidation in Singapore. By combining multiple debts into a single loan, you may benefit from a lower overall interest rate, simplified repayment with one monthly payment, and potentially better cash flow management. However, it\'s important to address the underlying spending habits that led to the debt.',
  },
  {
    question: 'What happens if I miss a payment or default on my loan?',
    answer: 'Missing payments will result in late fees and may negatively impact your credit score. Persistent defaults can lead to legal action, and your name may be listed with the Credit Bureau, affecting future loan applications. If you\'re facing financial difficulties, contact your lender immediately to discuss restructuring options or payment arrangements.',
  },
  {
    question: 'Can I apply for multiple personal loans at the same time?',
    answer: 'You can submit applications to multiple lenders, but each application will result in a credit inquiry that appears on your credit report. Multiple inquiries in a short period may raise concerns with lenders. It\'s generally better to apply strategically, focusing on lenders most likely to approve based on your profile, rather than applying broadly.',
  },
  {
    question: 'How does my credit score affect my personal loan application?',
    answer: 'Your Credit Bureau Singapore (CBS) score significantly influences loan approval and interest rates. A higher score (AA to BB) improves your chances of approval and may qualify you for better rates. Lower scores (CC to HH) may result in rejection or higher interest rates. Lenders also consider your credit history, existing debt obligations, and payment patterns.',
  },
]

// Business & Corporate Loans FAQs
const businessLoanFAQs = [
  {
    question: 'What types of business loans are available in Singapore?',
    answer: 'Common business loan types include term loans (fixed amount repaid over a set period), working capital loans (for daily operations), trade financing (for import/export activities), equipment financing (for machinery and equipment purchases), invoice financing (against outstanding invoices), and lines of credit (flexible credit facilities). Each serves different business needs and has varying eligibility requirements.',
  },
  {
    question: 'What are the eligibility requirements for a business loan?',
    answer: 'Requirements typically include being registered with ACRA, having a minimum operational period (often 6 months to 2 years depending on the lender), demonstrating revenue and profitability (or a clear path to profitability), providing financial statements, and having directors with good credit standing. Some lenders may require minimum annual revenue thresholds or specific business activities.',
  },
  {
    question: 'Can a newly registered company apply for a business loan?',
    answer: 'Newly registered companies face more limited options, as most traditional banks require a minimum operational history. However, some lenders offer startup financing programs, and alternative lenders may consider applications from newer companies based on directors\' personal credit, business plans, and projected cash flows. Government-assisted schemes may also be available for qualifying startups.',
  },
  {
    question: 'What documents are required for a business loan application?',
    answer: 'Standard documents include ACRA business profile, financial statements (profit & loss, balance sheet) for the last 2 years, bank statements for the last 6 to 12 months, Notice of Assessment for all directors, Credit Bureau Singapore reports for directors, business registration certificates, and sometimes business plans or cash flow projections. Additional documents may be required depending on loan type and amount.',
  },
  {
    question: 'How much can my business borrow?',
    answer: 'Loan amounts depend on your business\'s financial health, revenue, profitability, and the lender\'s assessment. Banks may offer up to 3 to 5 times your monthly revenue or a percentage of annual turnover. For secured loans, amounts can be higher based on collateral value. Government-assisted schemes may have specific limits, typically up to $500,000 or more depending on the program.',
  },
  {
    question: 'Do I need to provide collateral or personal guarantees for a business loan?',
    answer: 'Many business loans require personal guarantees from directors, especially for smaller businesses or unsecured loans. Collateral may be required for larger amounts or if the business has limited operating history. Secured loans against property or equipment typically offer better rates and higher amounts. The specific requirements depend on the lender, loan type, and your business profile.',
  },
  {
    question: 'What interest rates apply to business loans?',
    answer: 'Business loan interest rates in Singapore typically range from 4% to 12% per annum, depending on factors such as loan type, security provided, business financials, and credit risk. Government-assisted schemes may offer lower rates. Rates can be fixed or variable, and some products may include additional fees that affect the effective cost of borrowing.',
  },
  {
    question: 'How long does the business loan approval process take?',
    answer: 'Approval timelines vary by lender and loan complexity. Simple applications with complete documentation may be processed in 1 to 2 weeks, while more complex cases or larger amounts can take 3 to 6 weeks. Government-assisted schemes may have longer processing times. Delays often occur due to incomplete documentation or the need for additional verification.',
  },
  {
    question: 'Can I get a business loan if my company is not profitable?',
    answer: 'It\'s more challenging but possible, depending on the circumstances. Lenders may consider companies with temporary losses if there\'s a clear recovery plan, strong cash flow, valuable assets, or if losses are due to growth investments. Startups or companies in turnaround situations may need to explore alternative lenders, government schemes, or secured financing options.',
  },
  {
    question: 'What is the typical repayment period for business loans?',
    answer: 'Repayment periods vary by loan type. Working capital and term loans typically range from 1 to 5 years, while equipment financing may extend to 7 years or more. Trade financing is usually short-term, aligned with trade cycles. Lines of credit may have revolving terms with annual reviews. The tenure depends on the loan purpose, amount, and lender policies.',
  },
  {
    question: 'Are there government schemes or grants that can help with business financing?',
    answer: 'Yes, Singapore offers various government-assisted financing schemes, including the SME Working Capital Loan, Temporary Bridging Loan Programme, and sector-specific schemes. These programs often provide more favorable terms, lower interest rates, or reduced collateral requirements. Eligibility depends on business size, industry, and meeting specific criteria set by Enterprise Singapore or other administering agencies.',
  },
  {
    question: 'What happens if my business cannot repay the loan?',
    answer: 'If you\'re facing repayment difficulties, contact your lender immediately to discuss restructuring options, payment extensions, or refinancing. Defaulting can result in legal action, enforcement of personal guarantees, seizure of collateral, and damage to directors\' credit records. Early communication with the lender often leads to more manageable solutions than waiting until the situation becomes critical.',
  },
]

// Explore Topics
const exploreTopics = [
  {
    title: 'Personal Loans',
    description: 'Learn about personal loan options, eligibility, and application processes',
    icon: TrendingUp,
    href: '/loans/personal',
  },
  {
    title: 'Business Loans',
    description: 'Explore business financing solutions and corporate loan options',
    icon: Building2,
    href: '/loans/business',
  },
  {
    title: 'Loan Calculator',
    description: 'Calculate your monthly repayments and total interest',
    icon: BookOpen,
    href: '/calculator',
  },
  {
    title: 'Resources',
    description: 'Access guides, articles, and educational content',
    icon: HelpCircle,
    href: '/resources',
  },
]

import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PageTransition } from '@/components/layout/PageTransition'
import { ParticleBackground } from '@/components/background/ParticleBackground'

export default function FAQPage() {
  let questionNumber = 1
  
  // State-based image fallback handling
  const [heroImageSrc, setHeroImageSrc] = useState<string | null>(null)
  const [heroImageError, setHeroImageError] = useState(false)

  // Preload and validate hero image with fallback
  useEffect(() => {
    const imageSources = ['/images/faq.jpeg', '/images/hand%20raising.png']

    const tryLoadImage = (src: string, index: number): void => {
      if (typeof window === 'undefined') return

      const img = new window.Image()
      img.onload = () => setHeroImageSrc(src)
      img.onerror = () => {
        if (index < imageSources.length - 1) {
          tryLoadImage(imageSources[index + 1], index + 1)
        } else {
          setHeroImageError(true)
        }
      }
      img.src = src
    }

    tryLoadImage(imageSources[0], 0)
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <main id="main-content">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        
        {/* Hero Section - Background Image */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden w-full">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {!heroImageError && heroImageSrc && (
              <div className="absolute inset-0 scale-110">
                <NextImage
                  key={heroImageSrc}
                  src={heroImageSrc}
                  alt="FAQ - question marks background"
                  fill
                  priority
                  className="object-cover object-center animate-zoom-in-slow"
                  quality={90}
                  sizes="100vw"
                />
              </div>
            )}
            {heroImageError && (
              <div className="absolute inset-0 bg-gradient-to-b from-navy to-navy-dark" />
            )}
          </div>

          {/* Overlay for Text Readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/90 via-navy/70 to-navy/50" />
          
          {/* Particles */}
          <ParticleBackground intensity="subtle" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
                <AnimatedGradientText 
                  className="text-5xl md:text-6xl lg:text-7xl"
                  colorFrom="hsl(0, 0%, 100%)"
                  colorTo="hsl(180, 45%, 85%)"
                >
                  Frequently Asked Questions
                </AnimatedGradientText>
              </h1>
            </ScrollReveal>
          </div>
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[2]"></div>
        </section>

      {/* Most Popular FAQs Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">
                  Most Popular FAQs
                </AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to the questions we get asked most often
            </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Card className="bg-white border-gray-200">
              <AccordionDark>
                {mostPopularFAQs.map((faq, index) => (
                  <AccordionItemDark
                    key={`popular-${index}`}
                    number={index + 1}
                    title={faq.question}
                    defaultOpen={index === 0}
                  >
                    <p>{faq.answer}</p>
                  </AccordionItemDark>
                ))}
              </AccordionDark>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 1: About Brilliance Advisory */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">About Brilliance Advisory</AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Brilliance Advisory, we believe that securing the right financing requires more than just comparing rates. Our human-led approach combines market knowledge with personalised guidance to help you navigate Singapore&apos;s lending landscape with confidence.
            </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <AccordionDark>
              {aboutFAQs.map((faq, index) => {
                const num = questionNumber++
                return (
                  <AccordionItemDark 
                    key={`about-${index}`} 
                    number={num} 
                    title={faq.question}
                    defaultOpen={false}
                  >
                    <p>{faq.answer}</p>
                  </AccordionItemDark>
                )
              })}
            </AccordionDark>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2: Personal Loans */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">Personal Loans</AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Personal loans in Singapore can serve various purposes, from debt consolidation to major purchases or unexpected expenses. This section addresses common questions about eligibility, application processes, and loan terms.
            </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <AccordionDark>
              {personalLoanFAQs.map((faq, index) => {
                const num = questionNumber++
                return (
                  <AccordionItemDark 
                    key={`personal-${index}`} 
                    number={num} 
                    title={faq.question}
                    defaultOpen={false}
                  >
                    <p>{faq.answer}</p>
                  </AccordionItemDark>
                )
              })}
            </AccordionDark>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3: Business & Corporate Loans */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">Business & Corporate Loans</AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Business financing in Singapore encompasses various loan types designed to support different corporate needs, from working capital and expansion to equipment purchases and cash flow management.
            </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <AccordionDark>
              {businessLoanFAQs.map((faq, index) => {
                const num = questionNumber++
                return (
                  <AccordionItemDark 
                    key={`business-${index}`} 
                    number={num} 
                    title={faq.question}
                    defaultOpen={false}
                  >
                    <p>{faq.answer}</p>
                  </AccordionItemDark>
                )
              })}
            </AccordionDark>
          </ScrollReveal>
        </div>
      </section>

      {/* Explore Topics Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <AnimatedGradientText className="text-3xl md:text-4xl">Explore Topics</AnimatedGradientText>
              </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover more resources and information to help you make informed financing decisions
            </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exploreTopics.map((topic, index) => {
              const Icon = topic.icon
              return (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Link href={topic.href}>
                    <Card hover className="h-full text-center">
                    <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-navy" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">{topic.title}</h3>
                    <p className="text-gray-700 text-sm mb-4">{topic.description}</p>
                    <div className="flex items-center justify-center text-teal font-medium text-sm">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Don't See Your Question Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <AnimatedGradientText className="text-3xl md:text-4xl">
                Don&apos;t see your question here?
              </AnimatedGradientText>
            </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            We understand that every financial situation is unique. Our experienced advisors are here to provide personalised guidance tailored to your specific circumstances.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
                Contact Our Advisors
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="relative py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 italic">
            All information provided is general in nature. Final approvals and loan terms are subject to the respective bank&apos;s assessment and policies. AI responses are for informational purposes only and should not replace professional financial advice.
          </p>
        </div>
      </div>
      </main>
    </div>
    </PageTransition>
  )
}
