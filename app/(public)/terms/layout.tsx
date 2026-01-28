import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read Brilliance Advisory\'s Terms & Conditions. Understand our advisory services, client responsibilities, fees, and terms of engagement.',
  openGraph: {
    title: 'Terms & Conditions | Brilliance Advisory',
    description: 'Terms & Conditions for Brilliance Advisory\'s loan advisory services.',
    url: '/terms',
  },
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
