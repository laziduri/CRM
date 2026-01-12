import { Search, GitCompare, FileText, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Search & Compare',
    description: 'Browse through our extensive list of loans and use filters to find what you need.',
  },
  {
    number: 2,
    icon: GitCompare,
    title: 'Compare Options',
    description: 'Use our comparison tool to see loans side-by-side and find the best rates.',
  },
  {
    number: 3,
    icon: FileText,
    title: 'Apply Online',
    description: 'Fill out a simple application form and get pre-approved in minutes.',
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Get Approved',
    description: 'Receive your loan approval and funds directly from the lender.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Star-themed background */}
      <div className="absolute inset-0 bg-dots-pattern-white opacity-30"></div>
      
      {/* Soft gradient overlays */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-teal-light/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text">
            How It Works
          </h2>
          <p className="text-lg text-accent-gray2 max-w-2xl mx-auto">
            Getting the right loan is simple with our 4-step process.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Large background number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 -z-0">
                      <span className="text-7xl md:text-8xl font-bold text-secondary-gray2 opacity-40">
                        {step.number}
                      </span>
                    </div>
                    {/* Icon circle on top */}
                    <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-teal to-primary-dark text-white rounded-full shadow-xl ring-4 ring-teal-light/20">
                      <Icon className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-accent-gray2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {step.number < steps.length && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <div className="h-0.5 bg-gradient-to-r from-teal-light to-primary-light transform translate-x-4"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
