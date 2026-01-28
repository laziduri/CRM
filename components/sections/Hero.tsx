'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { ParticleBackground } from '@/components/background/ParticleBackground'

const HEADLINE = 'Find the Best Loans in Singapore'
const WORDS = HEADLINE.split(' ')
const SUBTEXT = (
  <>
    <span className="text-white">Compare personal loans, business loans, and more from top banks. </span>
    <span className="text-gray-200">Fast approval, transparent rates, no hidden fees.</span>
  </>
)

const WORD_STAGGER_MS = 70
const HEADLINE_DURATION_MS = WORDS.length * WORD_STAGGER_MS
const SUBTEXT_DELAY_MS = HEADLINE_DURATION_MS + 200

export default function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Image Layer with Zoom Animation */}
      <div className="absolute inset-0 z-0">
        <NextImage
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
      
      {/* Particles */}
      <ParticleBackground intensity="subtle" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center w-full">
          {/* Main heading: word-by-word drop-in or single fade (reduced motion) */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 leading-tight bg-gradient-to-r from-white via-white to-[hsl(180,45%,70%)] bg-clip-text text-transparent">
            {prefersReducedMotion ? (
              <motion.span
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {HEADLINE}
              </motion.span>
            ) : (
              WORDS.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * (WORD_STAGGER_MS / 1000),
                    ease: 'easeOut',
                  }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))
            )}
          </h1>
          
          {/* Subtext: fade-in after headline */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl mb-12 text-white max-w-4xl mx-auto text-center text-body"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: prefersReducedMotion ? 0.3 : SUBTEXT_DELAY_MS / 1000,
              ease: 'easeOut',
            }}
          >
            {SUBTEXT}
          </motion.p>
          
          {/* Buttons */}
          <motion.div
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.9, 
              delay: prefersReducedMotion ? 0.5 : 1.2,
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
