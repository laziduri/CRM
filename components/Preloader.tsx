'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'

interface PreloaderProps {
  onComplete: () => void
}

const WORDMARK = 'Brilliance Advisory'
const LETTERS = WORDMARK.split('')
const STAGGER_MS = 50
const LOADING_MS = 1000
const FADE_OUT_MS = 450
const LETTER_PHASE_MS = LETTERS.length * STAGGER_MS

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<'letters' | 'loading' | 'fadeout'>('letters')
  const [isFadeOut, setIsFadeOut] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const hasCalledOnComplete = useRef(false)
  const isMounted = useRef(true)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const letterTimer = setTimeout(() => {
      if (isMounted.current) setPhase('loading')
    }, LETTER_PHASE_MS)
    return () => clearTimeout(letterTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    const fadeTimer = setTimeout(() => {
      if (!isMounted.current) return
      setIsFadeOut(true)
      setPhase('fadeout')
    }, LOADING_MS)
    return () => clearTimeout(fadeTimer)
  }, [phase])

  const handleFadeOutComplete = () => {
    if (hasCalledOnComplete.current) return
    hasCalledOnComplete.current = true
    try {
      onCompleteRef.current()
    } catch (e) {
      console.error('Error in onComplete:', e)
    }
  }

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(220,50%,25%)] via-[hsl(220,45%,20%)] to-[hsl(180,45%,35%)] ${isFadeOut ? 'pointer-events-none' : ''}`}
      initial={false}
      animate={{ opacity: isFadeOut ? 0 : 1 }}
      transition={{ duration: FADE_OUT_MS / 1000, ease: 'easeInOut' }}
      onAnimationComplete={() => isFadeOut && handleFadeOutComplete()}
    >
      <div className="text-center px-4 select-none pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight inline-flex flex-wrap justify-center gap-0.5">
          {LETTERS.map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * (STAGGER_MS / 1000),
                ease: 'easeOut',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h2>

        {phase === 'loading' && (
          <motion.div
            className="mt-8 w-full max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-white/90 text-sm mb-2">Checking loan status...</p>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: LOADING_MS / 1000,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
