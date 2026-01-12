import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, CheckCircle2, ExternalLink } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { resourcesArticles } from '@/lib/resources'

// Ensure mockBlogPosts is always an array
const mockBlogPosts = Array.isArray(resourcesArticles) ? resourcesArticles : []
import { format } from 'date-fns'

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = mockBlogPosts
    .filter((p) => p.slug !== post.slug && (p.pillar === post.pillar || p.category === post.category))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {post.pillar && (
              <Badge variant="secondary">
                {post.pillar}
              </Badge>
            )}
            <Badge variant="secondary">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-6 animate-gradient-text">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8 space-x-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </div>
          </div>
          
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                Key Takeaways
              </h2>
              <ul className="space-y-3">
                {post.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-primary mr-3 font-bold">{index + 1}.</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6 font-medium">{post.excerpt}</p>
            <div className="text-gray-700 leading-relaxed">
              {post.content ? (
                <div className="space-y-4">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    This is a sample blog post. In a real application, this would contain the full
                    article content with proper formatting, images, and detailed information about
                    the topic.
                  </p>
                </div>
              )}
            </div>
          </div>

          {post.internalLinks && post.internalLinks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
              <div className="flex flex-wrap gap-3">
                {post.internalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link}
                    className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {link.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card hover>
                    <Badge variant="secondary" className="mb-2">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
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
