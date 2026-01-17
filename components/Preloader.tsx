'use client'

import { useEffect, useState } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

const loadingTexts = [
  'Assessing your profile…',
  'Matching suitable options…',
  'Preparing your dashboard…',
  'Preparing your experience…',
]

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(loadingTexts[0])
  const [textIndex, setTextIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let textInterval: NodeJS.Timeout

    // Fast progress bar animation (0-100% in ~2 seconds)
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true)
          // Trigger fade out immediately
          setTimeout(() => {
            onComplete()
          }, 200)
          return 100
        }
        // Faster increment for 2 second completion
        let increment = 1.2
        if (prev > 30 && prev < 80) {
          increment = 2.5
        } else if (prev > 80) {
          increment = 1.5
        }
        return Math.min(prev + increment, 100)
      })
    }, 30) // Faster interval

    // Dynamic text changes - faster cycling
    textInterval = setInterval(() => {
      setTextIndex((prev) => {
        const nextIndex = (prev + 1) % loadingTexts.length
        setCurrentText(loadingTexts[nextIndex])
        return nextIndex
      })
    }, 600) // Faster text changes

    return () => {
      if (progressInterval) clearInterval(progressInterval)
      if (textInterval) clearInterval(textInterval)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary-dark to-teal flex items-center justify-center transition-opacity duration-500 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center px-4 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <img 
              src="/images/brilliance-logo.svg" 
              alt="Brilliance Advisory Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // Fallback to PNG if SVG doesn't load
                if (e.currentTarget.src.includes('.svg')) {
                  e.currentTarget.src = '/images/brilliance-logo.png'
                } else {
                  e.currentTarget.style.display = 'none'
                }
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Brilliance Advisory</h2>
          <p className="text-white/80 text-sm">Your Trusted Loan Partner</p>
        </div>

        {/* Dynamic Loading Text */}
        <div className="mb-6 h-12 flex items-center justify-center">
          <p className="text-xl font-medium text-white transition-all duration-300">
            {currentText}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
          <div
            className="bg-white h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-white/70 text-sm font-medium mt-2">{Math.round(progress)}%</p>

        {/* Animated Loading Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
