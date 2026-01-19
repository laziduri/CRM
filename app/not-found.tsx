import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
