'use client'

import Link from 'next/link'
import AccordionDark, { AccordionItemDark } from '@/components/ui/AccordionDark'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const faqs = [
  {
    number: 1,
    question: 'What does Brilliance Advisory actually do?',
    answer: 'Brilliance Advisory is Singapore\'s trusted financial advisory and consulting firm specializing in loan and grant solutions. Unlike automated matching platforms, we provide personalized one-on-one consultations with our experienced team. Our consultants take the time to understand your unique financial situation, business needs, and goals. We then provide expert guidance, compare options from our extensive network of banks and financial institutions, and personally guide you through the entire application process. We believe in building genuine relationships with our clients, offering tailored advice and ongoing support throughout your financing journey.',
  },
  {
    number: 2,
    question: 'How much does Brilliance Advisory charge for advisory services?',
    answer: 'Brilliance Advisory provides professional loan advisory services tailored to each individual or business situation. Any advisory fees are assessed on a case-by-case basis, depending on the scope and complexity of work involved. We are fully transparent about our fees — all applicable fees, if any, will be clearly explained and agreed upon before any engagement of services. There are no hidden charges.',
  },
  {
    number: 3,
    question: 'What makes Brilliance Advisory different from other platforms?',
    answer: 'What sets us apart is our focus on human connection and personalized service. While other platforms rely on automated algorithms, our team of experienced financial consultants takes the time to understand your unique situation through one-on-one consultations. We believe that every business and individual has different needs, and we provide tailored advice based on your specific circumstances. Our consultants are accessible, responsive, and genuinely care about your success. From the initial consultation to post-disbursement support, you\'ll have a dedicated consultant to guide you every step of the way. We prioritize building long-term relationships with our clients, not just processing transactions.',
  },
  {
    number: 4,
    question: 'Do I need to meet with a consultant in person?',
    answer: 'We offer flexible consultation options to suit your preference and convenience. You can meet with our consultants in person at our office, schedule a phone consultation, or have a virtual meeting via video call. While we value face-to-face interactions for building stronger relationships, we understand that your time is valuable. Our team is committed to providing the same level of personalized service and attention whether we meet in person, over the phone, or virtually. The most important thing is that you feel comfortable and can communicate your needs effectively with your dedicated consultant.',
  },
  {
    number: 5,
    question: 'Is my personal information secure with Brilliance Advisory?',
    answer: 'Absolutely. Your privacy and data security are of utmost importance to us. We maintain strict confidentiality standards and only share information relevant to your loan application with our trusted partner financial institutions with your explicit consent. All our banking and financial partners are legally required to comply with Singapore\'s strict privacy regulations and data protection laws. Your information is encrypted and securely handled throughout our processes. We never sell your data to third parties or use it for any purpose other than helping you secure the best financing solution. Our team is trained in data protection best practices, ensuring your personal and business information remains confidential and secure.',
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Soft gradient overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight animate-gradient-text">
              Quick Answers to your burning questions
            </h2>
            <p className="text-lg text-accent-gray2 mb-8">
              Don&apos;t see your question listed?
            </p>
            <Link href="/faq">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                View All FAQs
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
                  <p>{faq.answer}</p>
                </AccordionItemDark>
              ))}
            </AccordionDark>
          </div>
        </div>
      </div>
    </section>
  )
}
