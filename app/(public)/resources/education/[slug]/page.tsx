import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle2, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import { educationArticles, type EducationArticle } from '@/lib/education'
import { format } from 'date-fns'

interface PageProps {
  params: {
    slug: string
  }
}

export default function EducationArticlePage({ params }: PageProps) {
  const article = educationArticles.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = educationArticles
    .filter((a) => a.slug !== article.slug && (a.category === article.category || a.pillar === article.pillar))
    .slice(0, 3)

  // Parse markdown-style content to HTML sections
  const contentSections = article.content.split(/\n## /).map((section, index) => {
    if (index === 0) return { type: 'intro', content: section }
    const lines = section.split('\n')
    const heading = lines[0]
    const content = lines.slice(1).join('\n')
    return { type: 'section', heading, content }
  })

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/resources/education"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Education Hub
        </Link>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {format(new Date(article.publishDate), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {article.author}
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <Card className="mb-8 bg-blue-50 border-l-4 border-primary">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                Key Takeaways
              </h2>
              <ul className="space-y-3">
                {article.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-primary mr-3 font-bold">{index + 1}.</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {/* Article Content */}
        <Card className="mb-8">
          <div className="prose prose-lg max-w-none p-6 prose-a:no-underline prose-a:cursor-pointer">
            {contentSections.map((section, index) => {
              if (section.type === 'intro') {
                return (
                  <div key={index} className="mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                )
              }
              return (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 cursor-default">{section.heading}</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                        return (
                          <ul key={pIndex} className="list-disc list-inside mb-4 ml-4 space-y-2 cursor-default">
                            {paragraph.split(/[-*]/).filter(p => p.trim()).map((item, i) => (
                              <li key={i} className="cursor-default">{item.trim()}</li>
                            ))}
                          </ul>
                        )
                      }
                      if (paragraph.trim().startsWith('**') && paragraph.includes(':**')) {
                        const [bold, rest] = paragraph.split(':**')
                        return (
                          <p key={pIndex} className="mb-4 cursor-default">
                            <strong>{bold.replace('**', '')}:</strong>
                            {rest}
                          </p>
                        )
                      }
                      if (paragraph.trim() === '') return <br key={pIndex} />
                      return (
                        <p key={pIndex} className="mb-4 cursor-default">
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* FAQ Section */}
        {article.faq && article.faq.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Accordion>
                {article.faq.map((item, index) => (
                  <AccordionItem
                    key={index}
                    title={item.question}
                  >
                    {item.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Card>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/resources/education/${related.slug}`} className="block">
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {related.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{related.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-teal text-white">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Application Support?</h3>
            <p className="text-lg mb-6 opacity-90">
              Get personalized guidance for your funding application
            </p>
            <Link href="/apply">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
