'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, BookOpen, TrendingUp, Building2, FileText, Target } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { educationArticles, type EducationArticle } from '@/lib/education'
import { format } from 'date-fns'

const categories = [
  { id: 'Personal Loan Education', label: 'Personal Loan Education', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  { id: 'Business Loan & SME Financing', label: 'Business Loan & SME Financing', icon: Building2, color: 'bg-green-100 text-green-800' },
  { id: 'Bank Processes & Credit Behaviour', label: 'Bank Processes & Credit', icon: TrendingUp, color: 'bg-purple-100 text-purple-800' },
  { id: 'Financial Planning & Borrower Strategy', label: 'Financial Planning', icon: Target, color: 'bg-orange-100 text-orange-800' },
] as const

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = selectedCategory
    ? educationArticles.filter((article) => article.category === selectedCategory)
    : educationArticles

  const groupedByCategory = categories.reduce((acc, category) => {
    acc[category.id] = educationArticles.filter((article) => article.category === category.id)
    return acc
  }, {} as Record<string, typeof educationArticles>)

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div className="mb-4">
            <Link href="/resources" className="text-primary hover:text-primary-dark text-sm mb-2 inline-block">
              ← Back to Resources
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4 animate-gradient-text">Education Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides on personal loans, business financing, credit management, and financial planning in Singapore
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Articles
          </button>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Articles Grid */}
        {selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link key={article.slug} href={`/resources/education/${article.slug}`}>
                <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(article.publishDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const articles = groupedByCategory[category.id] || []
              if (articles.length === 0) return null
              
              const Icon = category.icon
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.label}</h2>
                    <span className="text-gray-500">({articles.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <Link key={article.slug} href={`/resources/education/${article.slug}`}>
                        <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(new Date(article.publishDate), 'MMM d, yyyy')}
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
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-teal text-white">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-lg mb-6 opacity-90">
                Get personalized application support for your funding needs
              </p>
              <Link href="/apply">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Your Application
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
