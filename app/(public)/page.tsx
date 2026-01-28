import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Testimonials from '@/components/sections/Testimonials'
import Partners from '@/components/sections/Partners'
import CalculatorPreview from '@/components/sections/CalculatorPreview'
import ResourcesPreview from '@/components/sections/ResourcesPreview'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find the Best Loans in Singapore',
  description: 'Compare personal loans, business loans, and more from top banks in Singapore. Fast approval, transparent rates, no hidden fees. Expert financial advisory services.',
  openGraph: {
    title: 'Find the Best Loans in Singapore | Brilliance Advisory',
    description: 'Compare personal loans, business loans, and more from top banks in Singapore. Fast approval, transparent rates, no hidden fees.',
    url: '/',
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Partners />
      <Features />
      <CalculatorPreview />
      <Testimonials />
      <ResourcesPreview />
    </main>
  )
}
