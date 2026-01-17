import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AIChatbot from '@/components/layout/AIChatbot'
import PreloaderWrapper from '@/components/PreloaderWrapper'

const DynamicBackground = dynamic(() => import('@/components/DynamicBackground'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Brilliance Advisory - Compare Loans in Singapore',
  description: 'Compare and find the best personal loans, business loans, and more in Singapore. Fast approval, no hidden fees.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <PreloaderWrapper>
          <DynamicBackground />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <AIChatbot />
        </PreloaderWrapper>
      </body>
    </html>
  )
}
