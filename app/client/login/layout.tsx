import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Brilliance Advisory',
  description: 'Login to access your Brilliance Advisory account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
