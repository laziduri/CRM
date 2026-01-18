'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageSliderProps {
  images: string[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export default function ImageSlider({
  images = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || !images || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (!images || images.length === 0) return 0
        return (prev + 1) % images.length
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, images])

  const goToPrevious = () => {
    if (!images || images.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    if (!images || images.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    if (!images || images.length === 0 || index < 0 || index >= images.length) return
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  return (
    <div className={cn('relative w-full overflow-hidden bg-white', className)}>
      {/* Slider Container */}
      <div className="relative h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px]">
        {images && images.length > 0 && images.map((image, index) => (
          <div
            key={`slide-${index}-${image}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-in-out',
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain bg-white"
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                console.error(`Failed to load image: ${image}`)
                try {
                  if (e?.currentTarget) {
                    e.currentTarget.style.opacity = '0'
                    e.currentTarget.style.display = 'none'
                  }
                } catch (err) {
                  console.error('Error in image error handler:', err)
                }
              }}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  index === currentIndex
                    ? 'bg-primary w-8 shadow-md'
                    : 'bg-white/60 hover:bg-white/80 w-2.5'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 text-accent-gray2 text-sm px-3 py-1.5 rounded-full shadow-md">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}
