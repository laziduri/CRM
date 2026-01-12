'use client'

import { Star } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Review {
  id: number
  rating: string
  comment: string
  author: string
  role?: string
}

const reviews: Review[] = [
  {
    id: 1,
    rating: '5/5',
    comment: 'The process with Brilliance Advisory was smooth and straightforward. Their consultant guided me step by step and helped secure my grant approval quickly. Definitely worth it.',
    author: 'Michelle T.',
  },
  {
    id: 2,
    rating: '5/5',
    comment: 'Honestly didn\'t expect much at first, but they proved me wrong. Got my loan approved fast and even higher than what I expected.',
    author: 'faiz_works',
  },
  {
    id: 3,
    rating: '4.9/5',
    comment: 'Friendly and knowledgeable consultants. They made my grant process so simple and stress-free. Highly recommend for business owners.',
    author: 'gracie_lml',
  },
  {
    id: 4,
    rating: '4.9/5',
    comment: 'Applied for a business loan through them, and approval came in smoothly. The Consultant was honest and professional. Great experience overall.',
    author: 'rajkumar.sg',
  },
  {
    id: 5,
    rating: '4.9/5',
    comment: 'Smooth and easy experience applying for a grant. The team was patient and very responsive to all my questions. Trusted service for sure.',
    author: 'nuraisyah_89',
  },
  {
    id: 6,
    rating: '5/5',
    comment: 'Needed a loan for my expansion and they helped me secure more than I expected. Process was transparent and quick.',
    author: 'Dan Wong',
  },
  {
    id: 7,
    rating: '5/5',
    comment: 'I was referred by a friend and now I understand why. They helped me get a grant approved quickly and even guided me on how to use it effectively.',
    author: 'amirah.z',
  },
  {
    id: 8,
    rating: '4.9/5',
    comment: 'First time applying for a grant, and honestly didn\'t know where to start. Brilliance Advisory handled everything for me and it went through without issues. Very thankful.',
    author: 'joel.tch90',
  },
  {
    id: 9,
    rating: '4.5/5',
    comment: 'Impressed with how professional the team was. They didn\'t overpromise, but delivered what they said. My business loan was approved faster than expected.',
    author: 'Dylangoh86',
  },
  {
    id: 10,
    rating: '4.9/5',
    comment: 'My grant application was handled smoothly. What stood out was how friendly and patient the consultant was. They made the whole process so much less stressful.',
    author: 'elaine_teo',
  },
  {
    id: 11,
    rating: '5/5',
    comment: 'Wasn\'t sure if I qualified for any funding, but they took time to review my business properly and helped me secure both a grant and a loan. Solid work!',
    author: 'zul.rahman',
    role: 'Crypto Blogger, BlockSavvy',
  },
  {
    id: 12,
    rating: '5/5',
    comment: 'was quite doubtful at first because too many companies claim they can help with grants, but Brilliance Advisory really delivered. Everything was transparent, smooth, and done properly. Got my approval faster than expected',
    author: 'Keith L.',
  },
  {
    id: 13,
    rating: '5/5',
    comment: 'My grant application went through smoothly. I enjoyed working with someone who is patient and explained everything clearly',
    author: 'chonghui_88',
  },
  {
    id: 14,
    rating: '4.9/5',
    comment: 'I\'ve been rejected by a few banks before, but Brilliance helped combine offers from different lenders to secure a higher total amount. Professional and transparent service.',
    author: 'sean.tay_01',
  },
  {
    id: 15,
    rating: '4.9/5',
    comment: 'Very professional team. They explained how my business could qualify for certain grants and handled the full process. Hassle-free and reliable.',
    author: 'ravi_raja',
  },
  {
    id: 16,
    rating: '5/5',
    comment: 'Was skeptical at first but they turned out to be very reliable. My grant went through smoothly and the consultant followed up after approval to make sure I received the disbursement.',
    author: 'Mei Lin Y.',
  },
  {
    id: 17,
    rating: '4.9/5',
    comment: 'I worked with Rachel for both a grant and loan. She\'s knowledgeable, polite, and genuine. Everything was handled professionally and with care. Highly recommended.',
    author: 'Lucas',
  },
  {
    id: 18,
    rating: '4.9/5',
    comment: 'I came to Brilliance looking for financing options. Marcus helped me secure a higher loan approval by comparing offers from different banks. Really appreciate the transparency.',
    author: 'H3nry.1990',
  },
  {
    id: 19,
    rating: '5/5',
    comment: 'I\'ve applied for loans before but this time was different. Brilliance actually explained the options properly and structured my case well. Ended up with a higher approval amount.',
    author: 'Caleb.L',
  },
  {
    id: 20,
    rating: '4.9/5',
    comment: 'The experience was excellent. My grant was approved quickly and I was updated every step of the way. Trustworthy people who know their stuff.',
    author: 'kav_23',
  },
  {
    id: 21,
    rating: '4.9/5',
    comment: 'I was unsure if I qualified for a loan, but they checked across several banks and helped me secure one that matched my business perfectly. Really appreciate the help.',
    author: 'User09381',
  },
  {
    id: 22,
    rating: '5/5',
    comment: 'I didn\'t expect much at first but they surprised me. My loan went through at a higher amount and better terms than I could get directly with a bank. Would recommend',
    author: 'daniel.k',
  },
]

// Duplicate reviews for seamless infinite scroll
const duplicatedReviews = [...reviews, ...reviews]

// Split reviews into two columns - alternate between columns
const leftColumnReviews = duplicatedReviews.filter((_, index) => index % 2 === 0)
const rightColumnReviews = duplicatedReviews.filter((_, index) => index % 2 === 1)

function getRatingNumber(ratingString: string): number {
  const num = parseFloat(ratingString.split('/')[0])
  return isNaN(num) ? 5 : num
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const rating = getRatingNumber(review.rating)
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              )
            } else if (i === fullStars && hasHalfStar) {
              return (
                <div key={i} className="relative w-4 h-4">
                  <Star className="w-4 h-4 text-gray-300 fill-gray-300 absolute" />
                  <div className="absolute overflow-hidden w-2 h-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              )
            } else {
              return (
                <Star
                  key={i}
                  className="w-4 h-4 text-gray-300 fill-gray-300"
                />
              )
            }
          })}
        </div>
        <span className="text-sm font-semibold text-primary">
          {review.rating}
        </span>
      </div>
      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
        {review.comment}
      </p>
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900 text-sm">
          {review.author}
        </p>
        {review.role && (
          <p className="text-xs text-gray-600 mt-1">
            {review.role}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Animated stars background - using brand colors from Hero section */}
      <div className="absolute inset-0 bg-animated-stars opacity-100">
        <div className="bg-animated-stars-layer-2"></div>
        <div className="bg-animated-stars-layer-3"></div>
      </div>
      
      {/* Soft gradient overlays */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-teal-light/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Static Content */}
          <div className="lg:sticky lg:top-24">
            <div className="mb-6">
              <a
                href="https://www.google.com/search?q=Brilliance+Advisory+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                See our 543 reviews on{' '}
                <span className="font-semibold text-primary">Google</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </a>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-gradient-text">
              Trusted by SMEs Nationwide
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Hear what Singaporeans are saying about Brilliance Advisory
            </p>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Drop Us a Review
            </Button>
          </div>

          {/* Right Column - Animated Scrolling Reviews in 2 Columns */}
          <div className="relative h-[600px] overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left Review Column - Scrolls Up */}
              <div className="relative overflow-hidden">
                <div className="space-y-4 scroll-reviews-animation-up">
                  {leftColumnReviews.map((review, index) => (
                    <ReviewCard
                      key={`left-${review.id}-${index}`}
                      review={review}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Right Review Column - Scrolls Down */}
              <div className="relative overflow-hidden">
                <div className="space-y-4 scroll-reviews-animation-down">
                  {rightColumnReviews.map((review, index) => (
                    <ReviewCard
                      key={`right-${review.id}-${index}`}
                      review={review}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Gradient fade at top and bottom */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
