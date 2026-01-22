'use client'

import { Search, GitCompare, FileText, CheckCircle } from 'lucide-react'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { motion } from 'motion/react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Search & Compare',
    description: 'Browse through our extensive list of loans and use filters to find what you need.',
    revealDirection: 'left' as const,
  },
  {
    number: 2,
    icon: GitCompare,
    title: 'Compare Options',
    description: 'Use our comparison tool to see loans side-by-side and find the best rates.',
    revealDirection: 'up' as const,
  },
  {
    number: 3,
    icon: FileText,
    title: 'Apply Online',
    description: 'Fill out a simple application form and get pre-approved in minutes.',
    revealDirection: 'up' as const,
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Get Approved',
    description: 'Receive your loan approval and funds directly from the lender.',
    revealDirection: 'right' as const,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Ambient background with moderate motion */}
      <AmbientBackground intensity="moderate" />
      <GlowBackground intensity="subtle" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl">
              How It Works
            </AnimatedGradientText>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-body">
            Getting the right loan is simple with our 4-step process.
          </p>
        </motion.div>
        
        {/* Steps grid with fade animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative card-hover-lift bg-white rounded-xl p-6 border border-gray-200 hover:border-navy/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="text-center flex flex-col flex-grow">
                    <div className="relative inline-flex items-center justify-center mb-6 flex-shrink-0">
                      {/* Large background number */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -z-0">
                        <span className="text-7xl md:text-8xl font-bold text-gray-100 leading-none">
                          {step.number}
                        </span>
                      </div>
                      {/* Icon circle on top */}
                      <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-navy to-teal text-white rounded-full shadow-xl ring-4 ring-navy/20 hover:ring-teal/30 transition-all duration-300">
                        <Icon className="w-10 h-10 flex-shrink-0" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-navy flex-shrink-0">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 text-body leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>
                  {step.number < steps.length && (
                    <div className="hidden lg:block absolute top-10 left-full w-full">
                      <div className="h-0.5 bg-gradient-to-r from-teal/30 to-gray-200 transform translate-x-4"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
