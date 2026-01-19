'use client'

import { TrendingUp, Shield, Users, CheckCircle2, ArrowUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: TrendingUp,
    title: 'Access Bigger Funding Amounts',
    description: 'We work with over 40 financial partners and lenders to help you secure the highest possible approval',
    visual: (
      <div className="w-full px-2 relative z-10">
        <div className="p-5 bg-accent-blue rounded-lg relative z-10">
          <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">TOTAL LOAN APPROVED</div>
          <div className="text-3xl font-bold text-primary mb-5">$500,000.00</div>
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
                    ? 'bg-primary text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    loan.highlighted ? 'bg-white' : 'bg-primary'
                  }`}>
                    <span className={`text-xs font-bold ${
                      loan.highlighted ? 'text-primary' : 'text-white'
                    }`}>
                      {loan.bank.charAt(0)}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    loan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}>
                    {loan.bank}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${
                    loan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}>
                    {loan.amount}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${
                      loan.highlighted ? 'text-white' : 'text-gray-600'
                    }`}>
                      {loan.rate}
                    </span>
                    <ArrowUp className="w-3 h-3 text-green-600" />
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
    description: 'With years of experience, Lendela delivers reliable funding solutions and transparent support you can count on.',
    visual: (
      <div className="w-full relative flex items-center justify-center h-56">
        <div className="relative">
          {/* Central Shield */}
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Shield className="w-12 h-12 text-white fill-white" />
          </div>
          
          {/* Checkmark circles around shield */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="absolute top-1/2 -right-8 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          
          {/* Connecting dots */}
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-primary-light rounded-full"></div>
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
              stroke="#14B8A6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Professional - Upper right to center */}
            <line
              x1="75%"
              y1="25%"
              x2="50%"
              y2="50%"
              stroke="#14B8A6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Formal - Lower right to center */}
            <line
              x1="75%"
              y1="70%"
              x2="50%"
              y2="50%"
              stroke="#14B8A6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Helpful - Lower left to center */}
            <line
              x1="25%"
              y1="68%"
              x2="50%"
              y2="50%"
              stroke="#14B8A6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Enthusiastic - Upper left to center */}
            <line
              x1="25%"
              y1="25%"
              x2="50%"
              y2="50%"
              stroke="#14B8A6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          
          {/* Central Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-28 h-28 bg-gradient-to-br from-primary via-teal to-primary-dark rounded-full flex items-center justify-center shadow-lg ring-4 ring-teal-light/30">
              <Users className="w-14 h-14 text-white" />
            </div>
          </div>
          
          {/* Labels positioned in radial pattern */}
          {/* Friendly - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white border border-primary-light rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-900">Friendly</span>
            </div>
          </div>
          
          {/* Professional - Upper right */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white border border-primary-light rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-900">Professional</span>
            </div>
          </div>
          
          {/* Formal - Lower right */}
          <div className="absolute bottom-8 right-4 z-20">
            <div className="bg-white border border-primary-light rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-900">Formal</span>
            </div>
          </div>
          
          {/* Helpful - Lower left */}
          <div className="absolute bottom-12 left-4 z-20">
            <div className="bg-white border border-primary-light rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-900">Helpful</span>
            </div>
          </div>
          
          {/* Enthusiastic - Upper left */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white border border-primary-light rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-sm font-medium text-gray-900">Enthusiastic</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function WhatSetsUsApart() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-visible">
      {/* Star-themed background */}
      <div className="absolute inset-0 bg-dots-pattern-white opacity-35 z-0"></div>
      
      {/* Radial glow effect behind cards */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] pointer-events-none radial-glow-teal opacity-40 z-0"></div>
      
      {/* Additional subtle glow for depth */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100%] h-[60%] pointer-events-none radial-glow-teal-intense opacity-30 z-0"></div>
      
      {/* BrightHub-style animated glows */}
      <div className="absolute top-0 left-0 w-[650px] h-[650px] bg-teal-light/18 rounded-full blur-[115px] opacity-55 animate-glow-breathe z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/18 rounded-full blur-[110px] opacity-50 animate-glow-drift-slow z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-teal/12 rounded-full blur-[100px] opacity-40 animate-glow-breathe z-0" style={{ animationDelay: '4.5s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center mb-16 relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-shimmer">
            What Sets Us Apart
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional advice, proven results, and consultants who genuinely care
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} hover className="flex flex-col p-0 card-hover-lift animate-fade-in-up-stagger overflow-visible relative z-20" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="p-6 flex flex-col items-center text-center relative z-20">
                  {/* Icon */}
                  <div className="mb-4 relative z-10">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 relative z-10">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                  
                  {/* Visual Element */}
                  <div className="w-full relative z-10">
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
