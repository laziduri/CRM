import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Referral Program',
  description: 'Refer a friend to Brilliance Advisory and earn 10% of our net commission. Help others find the best loans in Singapore while earning rewards.',
  openGraph: {
    title: 'Referral Program | Brilliance Advisory',
    description: 'Refer a friend and earn rewards. Help others find the best loans in Singapore.',
    url: '/referral',
  },
  alternates: {
    canonical: '/referral',
  },
}

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
