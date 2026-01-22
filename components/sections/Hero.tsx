'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { TypingText } from '@/components/ui/TypingText'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Image Layer with Zoom Animation */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/sean-pollock-PhYq704ffdA-unsplash.jpg"
          alt="Modern skyscrapers"
          fill
          priority
          className="object-cover object-center animate-zoom-in-slow"
          quality={90}
          sizes="100vw"
        />
      </div>
      
      {/* Navy Overlay for Text Readability - Gradient from top to bottom, stronger at top for header */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/80 via-navy/65 to-navy/45" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center w-full">
          {/* Main heading with gradient animation - white/light gradient for contrast */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight">
            <AnimatedGradientText 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              colorFrom="hsl(0, 0%, 100%)"
              colorTo="hsl(180, 45%, 70%)"
            >
              Find the Best Loans in Singapore
            </AnimatedGradientText>
          </h1>
          
          {/* Description with typing animation */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white max-w-4xl mx-auto text-center text-body">
            <TypingText
              text="Compare personal loans, business loans, and more from top banks. "
              speed={40}
              delay={1200}
              className="text-white"
            />
            <TypingText
              text="Fast approval, transparent rates, no hidden fees."
              speed={40}
              delay={1200 + (40 * "Compare personal loans, business loans, and more from top banks. ".length)}
              className="text-gray-200"
            />
          </p>
          
          {/* Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.9, 
              delay: 1.2,
              ease: 'easeOut'
            }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/loans/business">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto shadow-2xl"
              >
                Business Loans
              </Button>
            </Link>
            
            <Link href="/loans/personal">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white hover:border-white/50 shadow-2xl"
              >
                Personal Loans
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient fade - seamless transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[2]"></div>
    </section>
  )
}
