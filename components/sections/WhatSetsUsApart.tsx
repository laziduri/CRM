'use client'

import { TrendingUp, Shield, Users, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'

// OCBC Logo Component (red circular logo with horizontal lines)
const OCBCLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#E21836"/>
    <rect x="8" y="14" width="24" height="2" fill="white" rx="1"/>
    <rect x="8" y="18" width="24" height="2" fill="white" rx="1"/>
    <rect x="8" y="22" width="24" height="2" fill="white" rx="1"/>
    <rect x="8" y="26" width="24" height="2" fill="white" rx="1"/>
  </svg>
)

// Standard Chartered Logo Component (green and blue intertwined S)
const StandardCharteredLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="white"/>
    {/* Green S */}
    <path d="M12 20C12 15 15 12 20 12C24 12 26 14 26 16C26 18 24 19 22 19C20 19 18 18 18 16" 
          stroke="#00A651" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M28 20C28 25 25 28 20 28C16 28 14 26 14 24C14 22 16 21 18 21C20 21 22 22 22 24" 
          stroke="#00A651" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"/>
    {/* Blue S (slightly offset) */}
    <path d="M13 21C13 16 16 13 20 13C24 13 26 15 26 17C26 19 24 20 22 20C20 20 18 19 18 17" 
          stroke="#0066CC" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M27 19C27 24 24 27 20 27C16 27 14 25 14 23C14 21 16 20 18 20C20 20 22 21 22 23" 
          stroke="#0066CC" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
)

const features = [
  {
    icon: TrendingUp,
    title: 'Access Bigger Funding Amounts',
    description: 'We work with over 40 financial partners and lenders to help you secure the highest possible approval',
    visual: (
      <div className="w-full relative flex flex-col items-center justify-center min-h-[280px] px-3 py-2">
        {/* Total Loan Approved Header */}
        <div className="w-full mb-4 text-center">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">TOTAL LOAN APPROVED</p>
          <p className="text-2xl md:text-3xl font-bold text-navy tracking-tight">$500,000.00</p>
        </div>
        
        {/* Bank List */}
        <div className="w-full space-y-2.5">
          {/* UOB */}
          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <Image src="/images/partners/uob.svg" alt="UOB" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">UOB</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-navy whitespace-nowrap">$120,000.00</span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">2.16%</span>
            </div>
          </div>
          
          {/* Standard Chartered - with light blue glowing background */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5 border border-sky-300/50 shadow-[0_0_15px_rgba(125,211,252,0.4)] relative overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50/80 to-sky-50">
            {/* Subtle animated glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-200/30 via-cyan-200/30 to-sky-200/30"></div>
            <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <StandardCharteredLogo className="w-9 h-9" />
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">Standard Chartered</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2 relative z-10">
              <span className="text-sm font-bold text-navy whitespace-nowrap">$150,000.00</span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">1.89%</span>
            </div>
          </div>
          
          {/* OCBC */}
          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <OCBCLogo className="w-9 h-9" />
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">OCBC</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-navy whitespace-nowrap">$80,000.00</span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">3.33%</span>
            </div>
          </div>
          
          {/* DBS */}
          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                <Image src="/images/partners/dbs.svg" alt="DBS" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">DBS</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-navy whitespace-nowrap">$150,000.00</span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">2.22%</span>
            </div>
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
        <div className="relative w-full h-full">
          {/* Background dots pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-6 gap-3 opacity-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-teal rounded-full"></div>
              ))}
            </div>
          </div>
          
          {/* Central Glowing Shield */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              {/* Outer glow layers for depth */}
              <div className="absolute inset-0 bg-teal/40 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 bg-teal/20 rounded-full blur-xl"></div>
              {/* Shield with enhanced gradient */}
              <div className="relative w-32 h-32 bg-gradient-to-br from-teal via-teal-500 to-navy rounded-full flex items-center justify-center shadow-2xl ring-4 ring-teal/40 border-2 border-white/10">
                <Shield className="w-18 h-18 text-white fill-white drop-shadow-2xl" />
              </div>
              {/* Star inside shield with glow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-md"></div>
                  <div className="relative w-7 h-7 text-yellow-300 fill-yellow-300">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-lg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkmark circles around shield with better positioning */}
          <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-teal to-teal-600 rounded-full flex items-center justify-center shadow-xl ring-3 ring-teal/30 z-20 animate-float">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="absolute bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-teal to-teal-600 rounded-full flex items-center justify-center shadow-xl ring-3 ring-teal/30 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="absolute top-1/2 right-2 transform translate-y-1/2 w-14 h-14 bg-gradient-to-br from-teal to-teal-600 rounded-full flex items-center justify-center shadow-xl ring-3 ring-teal/30 z-20 animate-float" style={{ animationDelay: '1s' }}>
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-teal to-teal-600 rounded-full flex items-center justify-center shadow-xl ring-3 ring-teal/30 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
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
              y1="15%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Professional - Upper right to center */}
            <line
              x1="80%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Formal - Lower right to center */}
            <line
              x1="80%"
              y1="75%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Helpful - Lower left to center */}
            <line
              x1="20%"
              y1="75%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Enthusiastic - Upper left to center */}
            <line
              x1="20%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="#318683"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </svg>
          
          {/* Central Glowing Orb with enhanced gradient */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              {/* Multiple glow layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal/50 via-cyan-400/40 to-teal/50 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal/30 via-cyan-400/20 to-teal/30 rounded-full blur-2xl"></div>
              {/* Inner orb with enhanced styling */}
              <div className="relative w-36 h-36 bg-gradient-to-br from-navy via-teal to-cyan-500 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-teal/40 border-2 border-white/30">
                <Users className="w-18 h-18 text-white drop-shadow-2xl" />
              </div>
            </div>
          </div>
          
          {/* Labels positioned in radial pattern with enhanced styling */}
          {/* Friendly - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white/95 backdrop-blur-md border-2 border-teal/40 rounded-lg px-4 py-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <span className="text-sm font-bold text-navy">Friendly</span>
            </div>
          </div>
          
          {/* Professional - Upper right */}
          <div className="absolute top-1 right-1 z-20">
            <div className="bg-white/95 backdrop-blur-md border-2 border-teal/40 rounded-lg px-4 py-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <span className="text-sm font-bold text-navy">Professional</span>
            </div>
          </div>
          
          {/* Formal - Lower right */}
          <div className="absolute bottom-2 right-1 z-20">
            <div className="bg-white/95 backdrop-blur-md border-2 border-teal/40 rounded-lg px-4 py-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <span className="text-sm font-bold text-navy">Formal</span>
            </div>
          </div>
          
          {/* Helpful - Lower left */}
          <div className="absolute bottom-6 left-1 z-20">
            <div className="bg-white/95 backdrop-blur-md border-2 border-teal/40 rounded-lg px-4 py-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <span className="text-sm font-bold text-navy">Helpful</span>
            </div>
          </div>
          
          {/* Enthusiastic - Upper left */}
          <div className="absolute top-1 left-1 z-20">
            <div className="bg-white/95 backdrop-blur-md border-2 border-teal/40 rounded-lg px-4 py-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <span className="text-sm font-bold text-navy">Enthusiastic</span>
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
              <Card key={index} hover className="flex flex-col card-hover-lift overflow-visible relative z-20">
                <div className="flex flex-col items-center text-center relative z-20 h-full">
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
                  <div className="w-full relative z-10 flex-shrink-0 mt-auto">
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
