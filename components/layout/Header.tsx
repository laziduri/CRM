'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false)

  const navLinks = [
    { href: '/calculator', label: 'Calculator' },
    { href: '/aboutus', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Resources' },
  ]

  const loanLinks = [
    { href: '/loans/business', label: 'Business Loans' },
    { href: '/loans/personal', label: 'Personal Loans' },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-secondary-gray3/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">Brilliance Advisory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative z-10">
            {/* Home Link */}
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Loans Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsLoansDropdownOpen(true)}
              onMouseLeave={() => setIsLoansDropdownOpen(false)}
            >
              <Link
                href="/loans"
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                Loans
                <ChevronDown size={16} className={`transition-transform ${isLoansDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>
              {isLoansDropdownOpen && (
                <>
                  {/* Invisible hover bridge to cover the gap */}
                  <div className="absolute top-full left-0 w-full h-2"></div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 w-48 z-50 mt-2">
                    <div className="bg-white rounded-lg shadow-xl border border-secondary-gray3/50 py-2">
                      {loanLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsLoansDropdownOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors font-medium"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Other Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium relative z-10"
                onClick={() => setIsLoansDropdownOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link href="/apply">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Home */}
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Loans Menu */}
              <div className="space-y-2">
                <Link
                  href="/loans"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Loans
                </Link>
                {loanLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block pl-4 text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Other Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
