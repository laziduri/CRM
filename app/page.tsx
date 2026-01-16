import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import WhatSetsUsApart from '@/components/sections/WhatSetsUsApart'
import Testimonials from '@/components/sections/Testimonials'
import Partners from '@/components/sections/Partners'
import FAQSection from '@/components/sections/FAQSection'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Partners />
      <WhatSetsUsApart />
      <Testimonials />
      <FAQSection />
    </>
  )
}
