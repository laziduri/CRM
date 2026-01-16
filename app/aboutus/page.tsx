'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { mockPartners } from '@/lib/data'
import { 
  CheckCircle2, 
  Shield, 
  Target, 
  Users, 
  FileText,
  Building2,
  ArrowRight,
  ArrowUpRight,
  Award,
  Lock,
  Heart,
  Lightbulb,
  UserCheck,
  BarChart3,
  Eye,
  UserPlus,
  Star,
  CircleDot,
  Sprout,
  Plus,
  Minus,
  Briefcase
} from 'lucide-react'

// Unified Foundation Section Component
function UnifiedFoundationSection() {
  const [activeTab, setActiveTab] = useState<'vision-mission' | 'purpose' | 'values'>('vision-mission')

  const tabs = [
    { id: 'vision-mission' as const, label: 'Vision & Mission', icon: Eye },
    { id: 'purpose' as const, label: 'Purpose', icon: Heart },
    { id: 'values' as const, label: 'Values', icon: Star },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation - FinPath Style Smooth Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-base md:text-lg
                tab-button-transition
                ${isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:text-primary border border-gray-200 hover:border-primary/40 hover:bg-gray-50/50'
                }
              `}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-primary'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content - Smooth Transitions */}
      <div className="relative min-h-[500px] pb-8">
        {/* Vision & Mission Content */}
        {activeTab === 'vision-mission' && (
          <div 
            key="vision-mission"
            className="tab-content-enter"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Vision Card */}
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl group h-full card-hover-lift">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
                <div className="relative p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform ring-4 ring-primary/10">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Vision</h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become Singapore&apos;s most trusted application support and client solutions firm, recognised for disciplined preparation, professional standards, and long-term client relationships.
                  </p>
                </div>
              </Card>

              {/* Mission Card */}
              <Card className="relative overflow-hidden border-2 border-teal/20 hover:border-teal/40 transition-all duration-300 hover:shadow-2xl group h-full card-hover-lift">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal/5 rounded-full -ml-20 -mb-20 group-hover:bg-teal/10 transition-colors"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal to-teal-dark"></div>
                <div className="relative p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform ring-4 ring-teal/10">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold text-teal mb-4">Our Mission</h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To provide structured guidance and application support that helps individuals and businesses prepare, coordinate, and submit financing applications with clarity, accountability, and integrity.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Purpose Content */}
        {activeTab === 'purpose' && (
          <div 
            key="purpose"
            className="tab-content-enter"
          >
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 shadow-xl max-w-4xl mx-auto card-hover-lift">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-teal to-primary"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal/5 rounded-full -ml-16 -mb-16 opacity-50"></div>
              <div className="relative p-10 md:p-12">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-teal/10 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-primary/5 shadow-lg">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Purpose</h3>
                </div>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                  Our clients rely on us to support one of the most important decisions in their journey. We exist to uphold standards, maintain discipline, and ensure every engagement is handled with professionalism and responsibility.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Values Content */}
        {activeTab === 'values' && (
          <div 
            key="values"
            className="tab-content-enter"
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Values we live by
                </h3>
              </div>
              
              <Card className="bg-white border-2 border-gray-200/50 overflow-hidden shadow-lg">
                <ValuesAccordion />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Values Accordion Component
function ValuesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const values = [
    {
      icon: CircleDot,
      title: 'Outperform Expectations',
      description: 'We set high standards in preparation and execution. Every application is meticulously prepared, every document carefully reviewed, and every process executed with precision. We don\'t just meet requirements—we exceed them through disciplined attention to detail and unwavering commitment to quality.',
    },
    {
      icon: Lightbulb,
      title: 'Challenge Convention',
      description: 'We continuously refine our processes and improve how applications are managed. By questioning established methods and seeking better approaches, we enhance efficiency, reduce errors, and deliver superior outcomes. Innovation in our workflows means better results for our clients.',
    },
    {
      icon: Star,
      title: 'Champion Opportunity',
      description: 'We enable better outcomes through thoughtful preparation. By understanding each client\'s unique situation and carefully structuring their applications, we help create opportunities for success. Our thorough approach ensures clients are positioned to achieve their financing goals.',
    },
    {
      icon: Sprout,
      title: 'Lead Responsibly',
      description: 'We act with discipline and accountability in every engagement. Professional standards guide our work, and we take full responsibility for the quality and accuracy of our support. Our clients trust us because we consistently demonstrate reliability, integrity, and professional competence.',
    },
    {
      icon: UserPlus,
      title: 'Drive Collaboration',
      description: 'We work as a cohesive team across departments to deliver seamless support. From initial assessment to final submission, our coordinated approach ensures nothing falls through the cracks. Collaboration means our clients receive comprehensive, well-coordinated service at every stage.',
    },
  ]

  return (
    <div>
      {values.map((value, index) => {
        const IconComponent = value.icon
        const isOpen = openIndex === index

        if (!IconComponent) {
          return null
        }

        return (
          <div
            key={`value-${index}`}
            className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
              isOpen ? 'bg-gray-50/50' : ''
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50/30 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center group-hover:border-primary transition-colors">
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-4 animate-fade-in">
                <div className="ml-10 md:ml-12">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Hero Section - Dark with Merge Effect */}
      <section className="relative pt-32 pb-40 md:pb-48 lg:pb-56 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-dark via-primary to-primary-dark overflow-hidden">
        {/* Dark grid background pattern */}
        <div className="absolute inset-0 bg-modern-grid opacity-20"></div>
        
        {/* Glowing digital numbers - scattered across background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[15%] text-teal-light/30 text-4xl md:text-5xl font-mono font-bold blur-sm">
            106.70
          </div>
          <div className="absolute top-[25%] right-[20%] text-teal-light/25 text-3xl md:text-4xl font-mono font-bold blur-sm">
            116.2
          </div>
          <div className="absolute top-[40%] left-[25%] text-teal-light/30 text-5xl md:text-6xl font-mono font-bold blur-sm">
            168.12
          </div>
          <div className="absolute top-[55%] right-[15%] text-teal-light/25 text-4xl md:text-5xl font-mono font-bold blur-sm">
            142.8
          </div>
          <div className="absolute top-[70%] left-[20%] text-teal-light/30 text-3xl md:text-4xl font-mono font-bold blur-sm">
            189.45
          </div>
        </div>

        {/* Glowing upward arrow/graph line - merges with next section */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-80 z-0"
          style={{ transform: 'translateY(50%)' }}
        >
          <defs>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(20, 184, 166, 0.6)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="rgba(20, 184, 166, 0.4)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgba(15, 118, 110, 0.2)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 0 80 Q 25% 40, 50% 30 T 100% 20"
            stroke="url(#arrowGradient)"
            strokeWidth="4"
            fill="none"
            className="drop-shadow-2xl"
            style={{ filter: 'blur(1px)' }}
          />
          <path
            d="M 100% 20 L 95% 15 L 95% 25 Z"
            fill="url(#arrowGradient)"
            className="drop-shadow-2xl"
          />
        </svg>

        {/* Bar chart elements - subtle background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-2 md:gap-4 opacity-20">
          {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
            <div
              key={i}
              className="bg-teal-light"
              style={{
                width: '20px',
                height: `${height}%`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white">
            Who We Are
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            A team of experienced consultants dedicated to helping individuals and businesses navigate Singapore&apos;s lending landscape with clarity and confidence.
          </p>
        </div>

        {/* Gradient fade that merges into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-primary/50 to-white pointer-events-none"></div>
      </section>

      {/* Unified Vision, Mission, Purpose & Values Section - Interactive Tabs */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header - FinPath Style */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-semibold text-primary">Values & Culture</span>
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary">
              The principles and purpose that guide everything we do
            </h2>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="relative z-10">
            <UnifiedFoundationSection />
          </div>
        </div>
      </section>

      {/* Why Brilliance Advisory Section - ItGet Style Numbered List */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-10"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header - Animated Grid Style */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-gradient-text">
              Why Brilliance Advisory?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We don&apos;t just recommend all banks and apply to every loan. We do proper assessments, provide real advice, and create strategic plans tailored to your unique situation.
            </p>
          </div>

          {/* Numbered List - ItGet Style */}
          <div className="space-y-0">
            {/* Item 01 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-300 leading-none block">
                    01
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                    Proper Assessment, Not Mass Applications
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">
                    Unlike online platforms that submit your application to multiple banks simultaneously, we conduct a thorough assessment of your financial profile, goals, and circumstances. We then strategically select the most suitable lenders—not all lenders—based on what&apos;s truly best for you.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Item 02 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-300 leading-none block">
                    02
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                    Real Advice & Strategic Planning
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">
                    Online applications can&apos;t give you real advice. They can&apos;t assess your complete financial picture or help you plan strategically. Our advisors provide genuine guidance, helping you understand your options, structure your application optimally, and plan for long-term financial success.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Item 03 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-300 leading-none block">
                    03
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                    Client-First Philosophy
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">
                    Every decision we make prioritises your best interests. We&apos;re not incentivised to push you toward any particular bank or loan product. Instead, we focus on finding the solution that genuinely fits your needs, even if it means recommending fewer options that are better suited to you.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Item 04 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-300 leading-none block">
                    04
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                    Human-Led Expertise
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">
                    Our experienced advisors work directly with you, understanding your unique situation through personalised consultations. We handle bank communications, negotiate terms, and guide you through every step—providing the human touch that automated systems simply cannot replicate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Human Touch - Comparison Chart Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 animate-gradient-shimmer">Why the Human Touch Matters</h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See the difference between automated online applications and human-led advisory services.
            </p>
          </div>

          <Card className="overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-teal text-white">
                    <th className="px-8 py-6 text-left font-bold text-lg md:text-xl">Feature</th>
                    <th className="px-8 py-6 text-center font-bold text-lg md:text-xl">Online Applications</th>
                    <th className="px-8 py-6 text-center font-bold text-lg md:text-xl bg-teal/20">Brilliance Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Assessment Approach</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Basic form submission</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Comprehensive financial assessment</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Bank Selection</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Applies to all/multiple banks</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Strategic selection of suitable lenders</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Advice & Guidance</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">No personalised advice</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Expert advice & strategic planning</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Application Structuring</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Generic application format</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Tailored case structuring</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Application Support</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Limited or no guidance</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Comprehensive application support & guidance</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Ongoing Support</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Limited or no support</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Continuous guidance until disbursement</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Client Focus</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Volume-based model</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Client-first, quality-focused</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Understanding Your Needs</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Algorithm-based matching</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Human understanding & relationship</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Star-themed background */}
        <div className="absolute inset-0 bg-dots-pattern-white opacity-25 z-0"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-3xl opacity-40 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 animate-gradient-text">
              We&apos;re proud to work alongside a diverse network of partners from reputable banks and fintech to agencies
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
              Our Network of Strategic Partners
            </h3>
          </div>

          {/* Scrolling Logos */}
          <div className="relative overflow-hidden z-20">
            <div className="flex items-center gap-8 md:gap-12 lg:gap-16 animate-scroll-logos">
              {[...mockPartners, ...mockPartners].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex items-center justify-center h-16 md:h-20 lg:h-24 flex-shrink-0 px-4 relative z-20"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    style={{ 
                      imageRendering: 'auto',
                      filter: 'none',
                      opacity: 1,
                      zIndex: 20
                    }}
                    draggable="false"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200"></div>

          {/* Partner Us Button */}
          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Partner Us
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
