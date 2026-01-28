'use client'

import NextImage from 'next/image'
import { mockPartners } from '@/lib/data'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

export default function Partners() {
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
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Star-themed background */}
      <div className="absolute inset-0 bg-dots-pattern-white opacity-10 z-0"></div>
      
      {/* Soft gradient overlays */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-teal/8 rounded-full blur-3xl opacity-40 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 opacity-0 animate-fade-in">
            <AnimatedGradientText 
              className="text-2xl md:text-3xl lg:text-4xl"
              colorFrom="hsl(220, 50%, 25%)"
              colorTo="hsl(180, 45%, 40%)"
            >
              We&apos;re proud to work alongside a diverse network of partners from reputable banks and fintech to agencies
            </AnimatedGradientText>
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700">
            Our Network of Strategic Partners
          </h3>
        </div>

        {/* Dual-Layer Scrolling Logos */}
        <div className="space-y-6">
          {/* Layer 1: Logos moving left to right */}
          <div className="relative overflow-hidden z-20">
            <div className="flex items-center gap-8 md:gap-12 lg:gap-16 animate-scroll-logos-ltr">
              {duplicatedPartnersLTR.map((partner, index) => (
                      <div
                        key={`ltr-${partner.id}-${index}`}
                        className="flex items-center justify-center h-16 md:h-20 lg:h-24 flex-shrink-0 px-4 relative z-20"
                      >
                        <NextImage
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          width={180}
                          height={100}
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
                        <NextImage
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          width={180}
                          height={100}
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
        <div className="mt-8 border-t border-gray-200"></div>
      </div>
    </section>
  )
}
