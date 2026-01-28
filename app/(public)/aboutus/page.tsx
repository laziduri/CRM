'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PageTransition } from '@/components/layout/PageTransition'
import { ParticleBackground } from '@/components/background/ParticleBackground'
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
  const prevTabRef = useRef<'vision-mission' | 'purpose' | 'values'>('vision-mission')
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const tabs = [
    { id: 'vision-mission' as const, label: 'Vision & Mission', icon: Eye },
    { id: 'purpose' as const, label: 'Purpose', icon: Heart },
    { id: 'values' as const, label: 'Values', icon: Star },
  ]

  // Calculate direction based on tab order
  const getTabIndex = (tabId: 'vision-mission' | 'purpose' | 'values') => {
    return tabs.findIndex(tab => tab.id === tabId)
  }

  const handleTabChange = (newTab: 'vision-mission' | 'purpose' | 'values') => {
    const currentIndex = getTabIndex(activeTab)
    const newIndex = getTabIndex(newTab)
    
    // Determine direction: if moving to higher index, slide left to right, else right to left
    setDirection(newIndex > currentIndex ? 'right' : 'left')
    prevTabRef.current = activeTab
    setActiveTab(newTab)
  }

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
              onClick={() => handleTabChange(tab.id)}
              className={`
                group relative flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-semibold text-base md:text-lg
                tab-button-transition
                ${isActive 
                  ? 'bg-white text-navy shadow-lg' 
                  : 'bg-white/20 text-white border border-white/30 hover:border-white/50 hover:bg-white/30 backdrop-blur-sm'
                }
              `}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${isActive ? 'text-navy' : 'text-white/80 group-hover:text-white'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content - Smooth Transitions with Directional Slides */}
      <div className="relative min-h-[500px] pb-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Vision & Mission Content */}
          {activeTab === 'vision-mission' && (
            <motion.div
              key="vision-mission"
              custom={direction}
              initial={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Vision Card */}
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl group h-full card-hover-lift">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
                  <div className="relative p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-navy to-teal rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform ring-4 ring-navy/20">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Vision</h3>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To become Singapore&apos;s leading consultancy firm, trusted for our standards, consistency, and long-term client relationships.
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
            </motion.div>
          )}

          {/* Purpose Content */}
          {activeTab === 'purpose' && (
            <motion.div
              key="purpose"
              custom={direction}
              initial={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 shadow-xl max-w-4xl mx-auto card-hover-lift">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-teal to-primary"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal/5 rounded-full -ml-16 -mb-16 opacity-50"></div>
                <div className="relative p-10 md:p-12">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-navy/10 to-teal/10 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-navy/5 shadow-lg">
                      <Heart className="w-10 h-10 text-navy" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Purpose</h3>
                  </div>
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                    We exist to guide clients through important financing decisions with clarity, discipline, and professionalism. Our role is to ensure every engagement is handled properly, responsibly, and with care.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Values Content */}
          {activeTab === 'values' && (
            <motion.div
              key="values"
              custom={direction}
              initial={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Values we live by
                  </h3>
                </div>
                
                <Card className="bg-white border-2 border-gray-200 overflow-hidden shadow-lg">
                  <ValuesAccordion />
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                  <IconComponent className="w-6 h-6 text-navy group-hover:text-teal transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-navy group-hover:text-teal transition-colors">
                  {value.title}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <motion.div 
                  className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-navy transition-colors"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5 text-navy group-hover:text-teal transition-colors" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-navy group-hover:text-teal transition-colors" strokeWidth={2.5} />
                  )}
                </motion.div>
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-4">
                    <div className="ml-10 md:ml-12">
                      <p className="text-base text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Hero Section - Background Image with Fade to Blue */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden w-full">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <NextImage
              src="/images/aboutusheader.png"
              alt="Professional business meeting"
              fill
              priority
              className="object-cover object-center animate-zoom-in-slow"
              quality={90}
              sizes="100vw"
            />
          </div>
          
          {/* Overlay for Text Readability - navy only in bottom 1/4 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/25 via-navy/35 via-[75%] to-primary" />
          
          {/* Particles */}
          <ParticleBackground intensity="subtle" />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Main Heading */}
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
                <AnimatedGradientText 
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  colorFrom="hsl(0, 0%, 100%)"
                  colorTo="hsl(180, 45%, 70%)"
                >
                  Who We Are
                </AnimatedGradientText>
              </h1>
            </ScrollReveal>
            
            {/* Description */}
            <ScrollReveal delay={0.1}>
              <p className="text-lg md:text-xl lg:text-2xl text-white mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                A team of experienced consultants dedicated to helping individuals and businesses navigate Singapore&apos;s lending landscape with clarity and confidence.
              </p>
            </ScrollReveal>
          </div>

          {/* Bottom gradient fade to navy */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary via-primary/80 to-transparent pointer-events-none z-[2]" />
        </section>

      {/* Unified Vision, Mission, Purpose & Values Section - Interactive Tabs */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header - FinPath Style */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full border border-white/30">
                <span className="text-sm font-semibold text-white">Values & Culture</span>
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <AnimatedGradientText 
                className="text-4xl md:text-5xl lg:text-6xl"
                colorFrom="hsl(0, 0%, 100%)"
                colorTo="hsl(180, 45%, 80%)"
              >
                The principles and purpose that guide everything we do
              </AnimatedGradientText>
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
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header - Animated Grid Style */}
          <ScrollReveal>
            <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <AnimatedGradientText className="text-4xl md:text-5xl lg:text-6xl">
                Why Brilliance Advisory?
              </AnimatedGradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We don&apos;t just recommend all banks and apply to every loan. We do proper assessments, provide real advice, and create strategic plans tailored to your unique situation.
            </p>
            </div>
          </ScrollReveal>

          {/* Numbered List - ItGet Style */}
          <div className="space-y-0">
            {/* Item 01 */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-none block">
                    01
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy mb-3 md:mb-4">
                    Proper Assessment Over Mass Submissions
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-3xl">
                    We do not send your application blindly to multiple banks. Instead, we take time to understand your financial position, objectives, and constraints. Based on this assessment, we identify and approach only the lenders that are genuinely suitable for your situation, ensuring quality over quantity.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </ScrollReveal>

            {/* Item 02 */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-none block">
                    02
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy mb-3 md:mb-4">
                    Real Advice With Strategic Direction
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-3xl">
                    Online platforms process forms, not people. They cannot evaluate your full financial picture or guide you on long-term planning. Our advisors offer informed guidance, explain your options clearly, structure your application correctly, and help you make decisions that support sustainable financial outcomes.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </ScrollReveal>

            {/* Item 03 */}
            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-none block">
                    03
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy mb-3 md:mb-4">
                    Client-First Approach
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-3xl">
                    Your interests always come first. We are not driven by commissions or pressured to promote specific banks or products. Our focus is on recommending solutions that truly align with your needs, even if that means fewer choices with better outcomes.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
            </ScrollReveal>

            {/* Item 04 */}
            <ScrollReveal delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-8 md:py-10">
                {/* Large Number */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-200 leading-none block">
                    04
                  </span>
                </div>

                {/* Title and Description */}
                <div className="col-span-1 md:col-span-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy mb-3 md:mb-4">
                    Personalised Expert Guidance
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-3xl">
                    You work directly with experienced consultants who take time to understand your circumstances through personalised consultations. We manage bank discussions, negotiate terms, and support you throughout the entire process, delivering clarity and confidence that automated systems cannot provide.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Human Touch - Comparison Chart Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
              <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl">
                Why the Human Touch Matters
              </AnimatedGradientText>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              See the difference between automated online applications and human-led advisory services.
            </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Card className="overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-navy to-teal text-white">
                    <th className="px-8 py-6 text-left font-bold text-lg md:text-xl">Feature</th>
                    <th className="px-8 py-6 text-center font-bold text-lg md:text-xl">Online Applications</th>
                    <th className="px-8 py-6 text-center font-bold text-lg md:text-xl bg-navy/20">Brilliance Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Assessment Approach</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Basic form submission</td>
                    <td className="px-8 py-6 text-center text-navy font-bold text-base md:text-lg">Comprehensive financial assessment</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Bank Selection</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Applies to all/multiple banks</td>
                    <td className="px-8 py-6 text-center text-teal font-bold text-base md:text-lg">Strategic selection of suitable lenders</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Advice & Guidance</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">No personalised advice</td>
                    <td className="px-8 py-6 text-center text-gold font-bold text-base md:text-lg">Expert advice & strategic planning</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Application Structuring</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Generic application format</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Tailored case structuring</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Application Support</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Limited or no guidance</td>
                    <td className="px-8 py-6 text-center text-gold font-bold text-base md:text-lg">Comprehensive application support & guidance</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Ongoing Support</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Limited or no support</td>
                    <td className="px-8 py-6 text-center text-primary font-bold text-base md:text-lg">Continuous guidance until disbursement</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Client Focus</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Volume-based model</td>
                    <td className="px-8 py-6 text-center text-gold font-bold text-base md:text-lg">Client-first, quality-focused</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-8 py-6 font-semibold text-gray-900 text-base md:text-lg">Understanding Your Needs</td>
                    <td className="px-8 py-6 text-center text-gray-600 text-base md:text-lg">Algorithm-based matching</td>
                    <td className="px-8 py-6 text-center text-gold font-bold text-base md:text-lg">Human understanding & relationship</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        <AmbientBackground intensity="moderate" />
        <GlowBackground intensity="subtle" />
        {/* Star-themed background */}
        <div className="absolute inset-0 bg-dots-pattern-white opacity-25 z-0"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-teal/8 rounded-full blur-3xl opacity-40 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <AnimatedGradientText className="text-2xl md:text-3xl lg:text-4xl">
                We&apos;re proud to work alongside a diverse network of partners from reputable banks and fintech to agencies
              </AnimatedGradientText>
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
              Our Network of Strategic Partners
            </h3>
          </div>

          {/* Dual-Layer Scrolling Logos - Same as home page */}
          {(() => {
            // Rearrange partners to avoid consecutive duplicates
            // Interleave the array: [1,5,2,6,3,7,4,8] instead of [1,2,3,4,5,6,7,8]
            const rearrangePartners = (partners: typeof mockPartners) => {
              const midpoint = Math.ceil(partners.length / 2)
              const rearranged: typeof mockPartners = []
              for (let i = 0; i < midpoint; i++) {
                rearranged.push(partners[i])
                if (i + midpoint < partners.length) {
                  rearranged.push(partners[i + midpoint])
                }
              }
              return rearranged
            }

            const rearrangedPartners = rearrangePartners(mockPartners)
            
            // For Layer 2, use a different offset pattern to further avoid repetition
            const offsetPartners = [...rearrangedPartners.slice(4), ...rearrangedPartners.slice(0, 4)]

            // Duplicate partners 4x for seamless infinite scroll
            const duplicatedPartnersLTR = [...rearrangedPartners, ...rearrangedPartners, ...rearrangedPartners, ...rearrangedPartners]
            const duplicatedPartnersRTL = [...offsetPartners, ...offsetPartners, ...offsetPartners, ...offsetPartners]

            return (
              <div className="space-y-6">
                {/* Layer 1: Logos moving left to right */}
                <div className="relative overflow-hidden z-20">
                  <div className="flex items-center gap-8 md:gap-12 lg:gap-16 animate-scroll-logos-ltr">
                    {duplicatedPartnersLTR.map((partner, index) => (
                      <div
                        key={`ltr-${partner.id}-${index}`}
                        className="flex items-center justify-center h-16 md:h-20 lg:h-24 flex-shrink-0 px-4 relative z-20"
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain brightness-0 invert"
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

                {/* Layer 2: Logos moving right to left */}
                <div className="relative overflow-hidden z-20">
                  <div className="flex items-center gap-8 md:gap-12 lg:gap-16 animate-scroll-logos-rtl">
                    {duplicatedPartnersRTL.map((partner, index) => (
                      <div
                        key={`rtl-${partner.id}-${index}`}
                        className="flex items-center justify-center h-16 md:h-20 lg:h-24 flex-shrink-0 px-4 relative z-20"
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain brightness-0 invert"
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
              </div>
            )
          })()}
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
    </PageTransition>
  )
}
