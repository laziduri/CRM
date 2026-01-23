import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Testimonials from '@/components/sections/Testimonials'
import Partners from '@/components/sections/Partners'
import CalculatorPreview from '@/components/sections/CalculatorPreview'

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <Features />
      <CalculatorPreview />
      <Testimonials />
    </>
  )
}
