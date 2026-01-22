'use client'

import { TrendingUp, Shield, Users, CheckCircle2, ArrowUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'

const features = [
  {
    icon: TrendingUp,
    title: 'Access Bigger Funding Amounts',
    description: 'We work with over 40 financial partners and lenders to help you secure the highest possible approval',
    visual: (
      <div className="w-full px-2 relative z-10">
        <div className="p-5 bg-gray-900 rounded-lg border border-gray-800 shadow-lg relative z-10">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">TOTAL LOAN APPROVED</div>
          <div className="text-3xl font-bold text-white mb-5">$500,000.00</div>
          <div className="space-y-2.5 relative z-10">
            {[
              { bank: 'UOB', amount: '$120,000.00', rate: '2.16%' },
              { bank: 'Standard Chartered', amount: '$150,000.00', rate: '2.16%', highlighted: true },
              { bank: 'OCBC', amount: '$80,000.00', rate: '3.33%' },
              { bank: 'DBS', amount: '$150,000.00', rate: '2.22%' },
            ].map((loan, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${
                  loan.highlighted
                    ? 'bg-navy text-white border-2 border-teal-400 shadow-lg shadow-teal-500/50'
                    : 'bg-gray-800 hover:bg-gray-750 text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    loan.highlighted ? 'bg-white' : 'bg-navy'
                  }`}>
                    <span className={`text-xs font-bold ${
                      loan.highlighted ? 'text-navy' : 'text-white'
                    }`}>
                      {loan.bank.charAt(0)}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    loan.highlighted ? 'text-white' : 'text-gray-300'
                  }`}>
                    {loan.bank}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${
                    loan.highlighted ? 'text-white' : 'text-gray-300'
                  }`}>
                    {loan.amount}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${
                      loan.highlighted ? 'text-white' : 'text-gray-400'
                    }`}>
                      {loan.rate}
                    </span>
                    <ArrowUp className="w-3 h-3 text-teal" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: 'Proven Track Record',
    description: 'With years of experience, Brilliance Advisory delivers reliable funding solutions and transparent support you can count on.',
    visual: (
      <div className="w-full relative flex items-center justify-center h-56">
        <div className="relative">
          {/* Central Shield */}
          <div className="w-24 h-24 bg-gradient-to-br from-navy to-teal rounded-full flex items-center justify-center shadow-md">
            <Shield className="w-12 h-12 text-white fill-white" />
          </div>
          
          {/* Checkmark circles around shield */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-teal rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-teal rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="absolute top-1/2 -right-8 w-10 h-10 bg-teal rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          
          {/* Connecting dots */}
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-teal-light rounded-full"></div>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: 'A Team That Puts You First',
    description: 'Our consultants go the extra mile to understand your needs, providing professional guidance and genuine support to make every step simple and stress-free',
    visual: (
      <div className="w-full relative flex items-center justify-center h-72">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* SVG for connecting lines */}
          <svg className="absolute inset-0 w-full h-full z-0" style={{ overflow: 'visible' }}>
            {/* Friendly - Top to center */}
            <line
              x1="50%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Professional - Upper right to center */}
            <line
              x1="75%"
              y1="25%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Formal - Lower right to center */}
            <line
              x1="75%"
              y1="70%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Helpful - Lower left to center */}
            <line
              x1="25%"
              y1="68%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Enthusiastic - Upper left to center */}
            <line
              x1="25%"
              y1="25%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          
          {/* Central Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-28 h-28 bg-gradient-to-br from-navy via-teal to-navy rounded-full flex items-center justify-center shadow-lg ring-4 ring-teal/20">
              <Users className="w-14 h-14 text-white" />
            </div>
          </div>
          
          {/* Labels positioned in radial pattern */}
          {/* Friendly - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-navy">Friendly</span>
            </div>
          </div>
          
          {/* Professional - Upper right */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-navy">Professional</span>
            </div>
          </div>
          
          {/* Formal - Lower right */}
          <div className="absolute bottom-8 right-4 z-20">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-navy">Formal</span>
            </div>
          </div>
          
          {/* Helpful - Lower left */}
          <div className="absolute bottom-12 left-4 z-20">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-navy">Helpful</span>
            </div>
          </div>
          
          {/* Enthusiastic - Upper left */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-navy">Enthusiastic</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function WhatSetsUsApart() {
  return (
    <section className="py-20 bg-white relative overflow-visible">
      {/* Ambient background */}
      <AmbientBackground intensity="moderate" />
      <GlowBackground intensity="subtle" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center mb-16 relative z-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl">
              What Sets Us Apart
            </AnimatedGradientText>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-body">
            Professional advice, proven results, and consultants who genuinely care
          </p>
        </div>
        {/* Glow behind center box extending to side boxes */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[400px] opacity-25 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-radial from-teal/30 via-teal/15 to-transparent rounded-full blur-3xl" 
               style={{
                 background: 'radial-gradient(ellipse 800px 400px at center, hsl(180, 45%, 40%, 0.15) 0%, hsl(180, 45%, 40%, 0.08) 30%, transparent 70%)'
               }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            if (!Icon) {
              console.warn(`Icon missing for feature at index ${index}`)
              return null
            }
            return (
              <Card key={index} hover className="flex flex-col p-0 card-hover-lift overflow-visible relative z-20">
                <div className="p-6 flex flex-col items-center text-center relative z-20 h-full">
                  {/* Icon */}
                  <div className="mb-4 relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-navy to-teal rounded-full flex items-center justify-center shadow-lg">
                      {Icon && <Icon className="w-8 h-8 text-white flex-shrink-0" />}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-navy relative z-10 flex-shrink-0">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed relative z-10 flex-grow">
                    {feature.description}
                  </p>
                  
                  {/* Visual Element */}
                  <div className="w-full relative z-10 flex-shrink-0">
                    {feature.visual}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
