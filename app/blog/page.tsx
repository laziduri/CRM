'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { resourcesArticles } from '@/lib/resources'

// Ensure mockBlogPosts is always an array
const mockBlogPosts = Array.isArray(resourcesArticles) ? resourcesArticles : []
import { format } from 'date-fns'

const pillars = [
  'Personal Loan Intelligence',
  'Business Loan Strategy',
  'Bank & Credit Behaviour',
  'SME Finance & Growth',
] as const

export default function BlogPage() {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)

  const filteredPosts = selectedPillar
    ? mockBlogPosts.filter((post) => post.pillar === selectedPillar)
    : mockBlogPosts

  const groupedByPillar = pillars.reduce((acc, pillar) => {
    acc[pillar] = mockBlogPosts.filter((post) => post.pillar === pillar)
    return acc
  }, {} as Record<string, typeof mockBlogPosts>)

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-4">
            <Link href="/resources" className="text-primary hover:text-primary-dark text-sm mb-2 inline-block">
              ← Back to Resources
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4 animate-gradient-text">Blog Articles</h1>
          <p className="text-lg text-gray-600 mb-6">
            Expert insights, market trends, and practical guides on personal and business financing
          </p>

          {/* Pillar Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedPillar(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPillar === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Articles
            </button>
            {pillars.map((pillar) => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPillar === pillar
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped by Pillar View (when no filter) */}
        {!selectedPillar ? (
          <div className="space-y-16">
            {pillars.map((pillar) => {
              const posts = groupedByPillar[pillar]
              if (posts.length === 0) return null

              return (
                <div key={pillar}>
                  <div className="mb-6 pb-3 border-b-2 border-primary">
                    <h2 className="text-3xl font-bold text-gray-900">{pillar}</h2>
                    <p className="text-gray-600 mt-2">
                      {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <Card hover className="h-full">
                          <Badge variant="secondary" className="mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(post.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Filtered View */
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedPillar}</h2>
              <p className="text-gray-600">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card hover className="h-full">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(post.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
