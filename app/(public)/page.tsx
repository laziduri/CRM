import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import WhatSetsUsApart from '@/components/sections/WhatSetsUsApart'
import Testimonials from '@/components/sections/Testimonials'
import Partners from '@/components/sections/Partners'

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <Features />
      <WhatSetsUsApart />
      <Testimonials />
    </>
  )
}
