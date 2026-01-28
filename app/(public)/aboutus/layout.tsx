import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Brilliance Advisory, Singapore\'s trusted financial consultancy. Our experienced team provides personalized loan advisory services with integrity and professionalism.',
  openGraph: {
    title: 'About Us | Brilliance Advisory',
    description: 'Learn about Brilliance Advisory, Singapore\'s trusted financial consultancy providing personalized loan advisory services.',
    url: '/aboutus',
  },
  alternates: {
    canonical: '/aboutus',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
