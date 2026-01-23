'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { motion } from 'motion/react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { resourcesArticles } from '@/lib/resources'
import { educationArticles } from '@/lib/education'

export default function ResourcesPreview() {
  // Select 3 interesting topics
  const selectedResources = [
    // Credit Score Impact - from resources (blog)
    resourcesArticles.find(article => article.slug === 'credit-score-impact-personal-loan-eligibility'),
    // Debt Consolidation - from education
    educationArticles.find(article => article.slug === 'debt-consolidation-safe-strategies-singapore'),
    // Personal Loan Interest - from education
    educationArticles.find(article => article.slug === 'personal-loan-interest-singapore'),
  ].filter(Boolean) // Remove any undefined entries

  // If we don't have all 3, use fallbacks
  if (selectedResources.length < 3) {
    // Add fallback resources if needed
    const fallbacks = [
      ...resourcesArticles.slice(0, 3),
      ...educationArticles.slice(0, 3)
    ]
    while (selectedResources.length < 3 && fallbacks.length > 0) {
      const fallback = fallbacks.shift()
      if (fallback && !selectedResources.find(r => r.slug === fallback.slug)) {
        selectedResources.push(fallback)
      }
    }
  }

  const getResourceHref = (resource: any) => {
    // Check if it's from resources (blog) or education
    const isBlog = resourcesArticles.some(article => article.slug === resource.slug)
    if (isBlog) {
      return `/blog/${resource.slug}`
    }
    return `/resources/education/${resource.slug}`
  }

  const getResourceType = (resource: any) => {
    const isBlog = resourcesArticles.some(article => article.slug === resource.slug)
    return isBlog ? 'blog' : 'education'
  }

  // Image mapping for resources
  const resourceImages: Record<string, string> = {
    'credit-score-impact-personal-loan-eligibility': '/images/credit-score-impact.png',
    'debt-consolidation-safe-strategies-singapore': '/images/resource2.png',
    'personal-loan-interest-singapore': '/images/resource3.png',
  }

  return (
    <section className="py-20 bg-white relative overflow-visible w-full">
      {/* Ambient background with moderate motion */}
      <AmbientBackground intensity="moderate" />
      <GlowBackground intensity="subtle" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl">
              Explore Our Resources
            </AnimatedGradientText>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-body">
            Expert insights and comprehensive guides to help you make informed financial decisions.
          </p>
        </motion.div>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {selectedResources.slice(0, 3).map((resource, index) => {
            if (!resource) return null
            
            const href = getResourceHref(resource)
            const imagePath = resourceImages[resource.slug] || ''

            return (
              <motion.div
                key={resource.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={href}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-primary/50 group overflow-hidden bg-white">
                    <div className="h-full flex flex-col">
                      {/* Image with overlay on hover */}
                      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                        {imagePath ? (
                          <>
                            <Image
                              src={imagePath}
                              alt={resource.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Image coming soon</span>
                          </div>
                        )}
                        
                        {/* Category badge - positioned on image */}
                        <div className="absolute top-3 left-3 z-10">
                          <Badge 
                            variant={getResourceType(resource) === 'blog' ? 'primary' : 'secondary'}
                            className="shadow-lg"
                          >
                            {getResourceType(resource) === 'blog' ? 'Blog' : 'Education'}
                          </Badge>
                        </div>
                        
                        {/* Hover excerpt overlay */}
                        {resource.excerpt && (
                          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <p className="text-white text-sm line-clamp-2 drop-shadow-lg">
                              {resource.excerpt}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Title section with better spacing */}
                      <div className="p-5 flex-grow flex flex-col justify-center bg-white">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {resource.title}
                        </h3>
                        {/* Read more indicator */}
                        <div className="mt-3 flex items-center text-sm text-gray-500 group-hover:text-primary transition-colors">
                          <span>Read more</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/resources">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              View All Resources
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
