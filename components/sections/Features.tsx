import { Shield, Zap, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: Shield,
    title: 'Compare Multiple Loans',
    description: 'View and compare loans from top banks and lenders all in one place.',
  },
  {
    icon: Zap,
    title: 'Fast Approval',
    description: 'Get pre-approved in minutes and receive funds quickly after approval.',
  },
  {
    icon: DollarSign,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no hidden charges. See exactly what you\'ll pay.',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white relative overflow-visible w-full">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* BrightHub-style animated glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/15 rounded-full blur-[110px] opacity-50 animate-glow-breathe"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[110px] opacity-45 animate-glow-drift-slow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-teal/10 to-primary/10 rounded-full blur-[100px] opacity-30 animate-glow-breathe" style={{ animationDelay: '3s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">
            Why Choose Brilliance Advisory?
          </h2>
          <p className="text-lg text-accent-gray2 max-w-2xl mx-auto">
            We make finding the right loan simple, fast, and transparent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            if (!Icon) {
              console.warn(`Icon missing for feature at index ${index}`)
              return null
            }
            return (
              <Card key={index} hover className="text-center card-hover-lift animate-fade-in-up-stagger" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-primary to-teal p-3 rounded-full border-2 border-teal-light shadow-lg">
                    {Icon && <Icon className="w-8 h-8 text-white" />}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
