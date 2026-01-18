'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BookOpen, FileText, ArrowRight, Calendar, Search, ChevronDown } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { resourcesArticles } from '@/lib/resources'
import { educationArticles } from '@/lib/education'
import { format } from 'date-fns'

type TabType = 'all' | 'blog' | 'education'
type SortType = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'category'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('newest')
  const [isSortOpen, setIsSortOpen] = useState(false)

  const blogPosts = useMemo(() => resourcesArticles || [], [])
  const educationPosts = useMemo(() => educationArticles || [], [])

  const allPosts = useMemo(() => [
    ...blogPosts.map(post => ({ ...post, type: 'blog' as const })),
    ...educationPosts.map(post => ({ ...post, type: 'education' as const }))
  ], [blogPosts, educationPosts])

  // Filter by tab
  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return allPosts
    if (activeTab === 'blog') return allPosts.filter(p => p.type === 'blog')
    return allPosts.filter(p => p.type === 'education')
  }, [activeTab, allPosts])

  // Filter by search query
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab
    
    const query = searchQuery.toLowerCase()
    return filteredByTab.filter(post => 
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query) ||
      post.pillar?.toLowerCase().includes(query)
    )
  }, [filteredByTab, searchQuery])

  // Sort posts
  const displayedPosts = useMemo(() => {
    const sorted = [...filteredBySearch]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date || '').getTime()
          const dateB = new Date(b.date || '').getTime()
          return dateB - dateA
        })
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date || '').getTime()
          const dateB = new Date(b.date || '').getTime()
          return dateA - dateB
        })
      case 'title-asc':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      case 'title-desc':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      case 'category':
        return sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
      default:
        return sorted
    }
  }, [filteredBySearch, sortBy])

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'category', label: 'Category' },
  ]

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort by'

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-teal rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 animate-gradient-text">Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert knowledge library covering personal loans, business financing, credit management, and SME growth strategies
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Resources ({allPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'blog'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog Articles ({blogPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'education'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Education Hub ({educationPosts.length})
          </button>
        </div>

        {/* Search and Sort Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 rounded-full text-primary font-medium hover:border-primary transition-colors min-w-[160px] justify-between"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-lg z-20 min-w-[200px] overflow-hidden">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setIsSortOpen(false)
                        }}
                        className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors ${
                          sortBy === option.value ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-md w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
                className="w-full px-5 py-3 bg-white border-2 border-blue-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                // Focus the input for better UX
                const input = document.querySelector('input[type="text"][placeholder="Search..."]') as HTMLInputElement
                input?.focus()
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          {/* Results count */}
          {searchQuery && (
            <div className="mt-4 text-center text-gray-600">
              Found {displayedPosts.length} result{displayedPosts.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/blog">
            <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary/20">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Blog Articles</h3>
                <p className="text-gray-600 mb-4">
                  Expert insights, market trends, and practical guides on personal and business financing
                </p>
                <div className="text-sm text-primary font-semibold">
                  Browse {blogPosts.length} articles →
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/resources/education">
            <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary/20">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Education Hub</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive guides on loan processes, eligibility, documentation, and financial planning
                </p>
                <div className="text-sm text-primary font-semibold">
                  Explore {educationPosts.length} guides →
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Articles Grid */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => {
              const href = post.type === 'blog' ? `/blog/${post.slug}` : `/resources/education/${post.slug}`
              const date = post.date || (post as any).publishDate || ''
              
              return (
                <Link key={post.slug} href={href}>
                  <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={post.type === 'blog' ? 'primary' : 'secondary'}>
                          {post.type === 'blog' ? 'Blog' : 'Education'}
                        </Badge>
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {date ? format(new Date(date), 'MMM d, yyyy') : 'Recent'}
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600">No articles found in this category.</p>
          </Card>
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
