'use client'

import { ArrowUpRight } from 'lucide-react'

interface Solution {
  number: string
  title: string
  description: string
  link?: string
}

const solutions: Solution[] = [
  {
    number: '01',
    title: 'Proper Assessment & Analysis',
    description: 'We don\'t just recommend all banks and apply to every loan. We conduct thorough assessments of your financial position, requirements, and objectives to understand your unique situation before making any recommendations.',
  },
  {
    number: '02',
    title: 'Real Strategic Advice',
    description: 'Our consultants provide genuine, strategic advice tailored to your circumstances. We create customised plans that align with your goals, rather than applying a one-size-fits-all approach.',
  },
  {
    number: '03',
    title: 'Selective Bank Approach',
    description: 'We identify and approach only the most suitable lenders based on your specific profile. This targeted approach improves approval prospects and ensures you receive terms that genuinely benefit your situation.',
  },
  {
    number: '04',
    title: 'End-to-End Case Management',
    description: 'From initial assessment through structuring, bank liaison, negotiation, and final disbursement. We manage your entire financing process, ensuring each step is handled with precision and care.',
  },
]

export default function WhyBrillianceAdvisory() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal/5 via-white to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-modern-dots opacity-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pill-shaped tag */}
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Why Brilliance Advisory?
            </span>
          </div>
        </div>

        {/* Solutions List */}
        <div className="space-y-0">
          {solutions.map((solution, index) => (
            <div key={solution.number}>
              <div className="grid grid-cols-12 gap-6 items-start py-10">
                {/* Number */}
                <div className="col-span-1">
                  <span className="text-6xl md:text-7xl font-bold text-gray-300 leading-none">
                    {solution.number}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-9 md:col-span-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-3xl text-base">
                    {solution.description}
                  </p>
                </div>

                {/* Circular Button */}
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <a
                    href={solution.link || '#'}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group shadow-sm"
                    aria-label={`Learn more about ${solution.title}`}
                  >
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Separator Line */}
              {index < solutions.length - 1 && (
                <div className="border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
