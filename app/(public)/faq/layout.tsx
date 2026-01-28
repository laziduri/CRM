import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Get answers to common questions about personal loans, business loans, and our advisory services in Singapore. Learn about eligibility, interest rates, application process, and more.',
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | Brilliance Advisory',
    description: 'Get answers to common questions about loans and our advisory services in Singapore.',
    url: '/faq',
  },
  alternates: {
    canonical: '/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
