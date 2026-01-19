'use client'

import { useState } from 'react'
import Link from 'next/link'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowRight, MessageCircle, Send, X, BookOpen, TrendingUp, Building2, HelpCircle } from 'lucide-react'

// Most Popular FAQs
const mostPopularFAQs = [
  {
    question: 'What is Brilliance Advisory and how do you differ from online loan comparison platforms?',
    answer: 'Brilliance Advisory is a Singapore-based financial consultancy that provides human-led advisory services for personal and business loans. Unlike automated comparison platforms, our advisors work directly with you to understand your financial situation, goals, and constraints. We provide personalised recommendations, help you prepare your application, and guide you through the entire process with ongoing support.',
  },
  {
    question: 'How much does your advisory service cost?',
    answer: 'Brilliance Advisory provides professional loan advisory services tailored to each individual or business situation. Any advisory fees are assessed on a case-by-case basis, depending on the scope and complexity of work involved. We are fully transparent about our fees — all applicable fees, if any, will be clearly explained and agreed upon before any engagement of services. There are no hidden charges.',
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
    question: 'Are you a licensed lender or a loan broker?',
    answer: 'We are neither a lender nor a broker. Brilliance Advisory operates as a financial consultancy that provides advisory services. We do not lend money directly, nor do we charge brokerage fees. Our role is to provide expert guidance and connect you with suitable lenders from our network of banks and licensed financial institutions in Singapore.',
  },
  {
    question: 'How much does your advisory service cost?',
    answer: 'Our advisory service is provided at no direct cost to you. We maintain relationships with various financial institutions, and when a loan is successfully arranged through our advisory, we may receive a referral fee from the lender. This fee does not affect your loan terms, interest rates, or any charges you would otherwise pay directly to the lender.',
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

// AI Chatbot Component
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const response = generateAIResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for Brilliance Advisory questions
    if (lowerMessage.includes('what is brilliance') || lowerMessage.includes('who is brilliance') || lowerMessage.includes('about brilliance')) {
      return 'Brilliance Advisory is a Singapore-based financial consultancy that provides human-led advisory services for personal and business loans. Unlike automated platforms, we offer personalized one-on-one consultations with experienced advisors who understand your unique financial situation and guide you through the entire loan application process. Would you like to speak with one of our advisors?'
    }

    if (lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('price') || lowerMessage.includes('charge')) {
      return 'Brilliance Advisory provides professional loan advisory services tailored to each individual or business situation. Any advisory fees are assessed on a case-by-case basis, depending on the scope and complexity of work involved. We are fully transparent about our fees — all applicable fees, if any, will be clearly explained and agreed upon before any engagement of services. There are no hidden charges. Would you like to speak with one of our advisors to discuss your specific situation?'
    }

    if (lowerMessage.includes('how to') || lowerMessage.includes('how do i') || lowerMessage.includes('process') || lowerMessage.includes('apply')) {
      return 'Getting started is simple! Contact us through our website or phone to schedule a consultation. Our advisor will discuss your financing needs, assess your situation, and guide you through the application process. We handle everything from initial assessment to loan disbursement. Would you like to book an appointment with one of our advisors?'
    }

    // Check for loan-related questions
    if (lowerMessage.includes('personal loan') || lowerMessage.includes('personal financing')) {
      return 'For personal loans in Singapore, basic eligibility typically includes being 21-65 years old, earning a minimum monthly income (usually $2,000-$3,000), and being a Singapore citizen, PR, or holding a valid Employment Pass. Loan amounts can range from 4-8 times your monthly salary. Our advisors can help assess your eligibility and find the best options. Would you like to speak with an advisor?'
    }

    if (lowerMessage.includes('business loan') || lowerMessage.includes('business financing') || lowerMessage.includes('corporate loan')) {
      return 'Business loans in Singapore include term loans, working capital loans, trade financing, equipment financing, and lines of credit. Eligibility typically requires ACRA registration, minimum operational period (6 months to 2 years), and financial statements. Our advisors can help identify the best financing solution for your business needs. Would you like to schedule a consultation?'
    }

    if (lowerMessage.includes('interest rate') || lowerMessage.includes('rate') || lowerMessage.includes('apr')) {
      return 'Interest rates in Singapore vary by loan type and lender. Personal loans typically range from 3.5% to 10% per annum for banks, while business loans range from 4% to 12% per annum. Rates depend on your credit profile, loan amount, and tenure. Our advisors can help you understand rates and find competitive options. Would you like to speak with an advisor?'
    }

    if (lowerMessage.includes('eligibility') || lowerMessage.includes('qualify') || lowerMessage.includes('requirements')) {
      return 'Eligibility requirements vary by loan type and lender. For personal loans, you typically need to be 21-65 years old with minimum monthly income. For business loans, you need ACRA registration and operational history. Our advisors can assess your specific situation and identify suitable options. Would you like to schedule a consultation?'
    }

    if (lowerMessage.includes('document') || lowerMessage.includes('paperwork') || lowerMessage.includes('required')) {
      return 'Required documents vary by loan type. For personal loans: NRIC, payslips, CPF statements, employment letter. For business loans: ACRA profile, financial statements, bank statements, directors\' NOA. Our advisors will guide you through the exact documentation needed for your specific situation. Would you like to speak with an advisor?'
    }

    if (lowerMessage.includes('bank') || lowerMessage.includes('lender') || lowerMessage.includes('financial institution')) {
      return 'We work with a network of major banks and licensed financial institutions in Singapore, including DBS, UOB, OCBC, Standard Chartered, HSBC, and other reputable lenders. Our advisors recommend lenders based on your profile and needs, not all banks. Would you like to learn which lenders might be suitable for you?'
    }

    if (lowerMessage.includes('credit') || lowerMessage.includes('credit score') || lowerMessage.includes('cbs')) {
      return 'Your Credit Bureau Singapore (CBS) score significantly affects loan approval and interest rates. Higher scores (AA-BB) improve approval chances and rates. Our advisors can help you understand your credit situation and explore options even with lower scores. Would you like to speak with an advisor?'
    }

    // Default response - always direct to contact
    return 'I understand you\'re looking for information about loans or our services. For personalized advice tailored to your specific situation, I recommend speaking directly with one of our experienced advisors. They can provide accurate, up-to-date information and guide you through your options. Would you like to schedule a consultation?'
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary to-teal rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-teal text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                setMessages([])
              }}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Hi! I&apos;m here to help answer your questions about loans and Brilliance Advisory.</p>
                <p className="text-xs mt-2">Ask me anything, and I&apos;ll guide you to the right information or connect you with our advisors.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              For detailed advice, <Link href="/contact" className="text-primary hover:underline">contact our advisors</Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default function FAQPage() {
  let questionNumber = 1

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Hero Section - Longer */}
      <section className="relative pt-32 pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-gradient-text">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* Most Popular FAQs Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">
              Most Popular FAQs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to the questions we get asked most often
            </p>
          </div>
          <Card className="bg-white">
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
        </div>
      </section>

      {/* Section 1: About Brilliance Advisory */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-16 border border-secondary-gray3 shadow-md">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">About Brilliance Advisory</h2>
              <p className="text-lg text-accent-gray2 leading-relaxed">
                At Brilliance Advisory, we believe that securing the right financing requires more than just comparing rates. Our human-led approach combines market knowledge with personalised guidance to help you navigate Singapore&apos;s lending landscape with confidence.
              </p>
            </div>
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
          </div>
        </div>
      </section>

      {/* Section 2: Personal Loans */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-16 border border-secondary-gray3 shadow-md">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">Personal Loans</h2>
              <p className="text-lg text-accent-gray2 leading-relaxed">
                Personal loans in Singapore can serve various purposes, from debt consolidation to major purchases or unexpected expenses. This section addresses common questions about eligibility, application processes, and loan terms.
              </p>
            </div>
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
          </div>
        </div>
      </section>

      {/* Section 3: Business & Corporate Loans */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 lg:p-16 border border-secondary-gray3 shadow-md">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">Business & Corporate Loans</h2>
              <p className="text-lg text-accent-gray2 leading-relaxed">
                Business financing in Singapore encompasses various loan types designed to support different corporate needs, from working capital and expansion to equipment purchases and cash flow management.
              </p>
            </div>
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
          </div>
        </div>
      </section>

      {/* Explore Topics Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">
              Explore Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover more resources and information to help you make informed financing decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exploreTopics.map((topic, index) => {
              const Icon = topic.icon
              return (
                <Link key={index} href={topic.href}>
                  <Card hover className="h-full text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                    <div className="flex items-center justify-center text-primary font-medium text-sm">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Don't See Your Question Section with AI Chatbot */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 via-white to-teal/5 border-2 border-primary/20 text-center p-8 md:p-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">
                Don&apos;t see your question here?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our AI assistant can help answer your questions about loans, eligibility, and our services. For personalized advice tailored to your specific situation, our experienced advisors are ready to help.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  const chatbotButton = document.querySelector('button[aria-label="Open AI Chatbot"]') as HTMLButtonElement
                  chatbotButton?.click()
                }}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with AI Assistant
              </button>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  Speak to an Advisor
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* AI Chatbot Component */}
      <AIChatbot />

      {/* Disclaimer */}
      <div className="relative py-8 px-4 sm:px-6 lg:px-8 border-t border-secondary-gray3">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-accent-gray2 italic">
            All information provided is general in nature. Final approvals and loan terms are subject to the respective bank&apos;s assessment and policies. AI responses are for informational purposes only and should not replace professional financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
