'use client'

import { Shield, Zap, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { motion } from 'motion/react'
import { MagicCard } from '@/components/ui/magic-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

const features = [
  {
    icon: Shield,
    title: 'Compare Multiple Loans',
    description: 'View and compare loans from top banks and lenders all in one place.',
    revealDirection: 'left' as const,
  },
  {
    icon: Zap,
    title: 'Fast Approval',
    description: 'Get pre-approved in minutes and receive funds quickly after approval.',
    revealDirection: 'up' as const,
  },
  {
    icon: DollarSign,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no hidden charges. See exactly what you\'ll pay.',
    revealDirection: 'right' as const,
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white relative overflow-visible w-full">
      {/* Ambient background with moderate motion */}
      <AmbientBackground intensity="moderate" />
      <GlowBackground intensity="subtle" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with fade animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl">
              Why Choose Brilliance Advisory?
            </AnimatedGradientText>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-body">
            We make finding the right loan simple, fast, and transparent.
          </p>
        </motion.div>
        
        {/* Features grid with fade animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            if (!Icon) {
              console.warn(`Icon missing for feature at index ${index}`)
              return null
            }
            // Determine rotation and horizontal offset based on card position
            const rotation = index === 0 ? -20 : index === 2 ? 20 : 0
            const horizontalOffset = index === 0 ? -30 : index === 2 ? 30 : 0
            
            return (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  rotate: rotation,
                  y: 80,
                  x: horizontalOffset
                }}
                whileInView={{ 
                  opacity: 1, 
                  rotate: 0, 
                  y: 0,
                  x: 0
                }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: index * 0.15 
                }}
              >
                <MagicCard className="relative h-full">
                  <Card hover className="text-center card-hover-lift h-full p-6 flex flex-col">
                    <div className="flex justify-center mb-4 flex-shrink-0">
                      <div className="bg-gradient-to-br from-navy to-teal p-3 rounded-full border-2 border-navy/30 shadow-lg flex items-center justify-center">
                        {Icon && <Icon className="w-8 h-8 text-white flex-shrink-0" />}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-navy flex-shrink-0">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-body flex-grow">
                      {feature.description}
                    </p>
                    <BorderBeam className="opacity-30" />
                  </Card>
                </MagicCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
