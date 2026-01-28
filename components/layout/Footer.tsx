'use client'

import { useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  // State-based image fallback handling
  const [logoSrc, setLogoSrc] = useState('/images/whitelogo.svg')
  const footerLinks = {
    company: [
      { href: '/aboutus', label: 'About Us' },
      { href: '/careers', label: 'Careers' },
      { href: '/resources', label: 'Resources' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
    products: [
      { href: '/loans/personal', label: 'Personal Loans' },
      { href: '/loans/business', label: 'Business Loans' },
    ],
    resources: [
      { href: '/calculator', label: 'Loan Calculator' },
      { href: '/apply', label: 'Apply Now' },
      { href: '/crm', label: 'Consultant CRM' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-neutral-900 border-t border-gray-800 text-neutral-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <NextImage
                  src={logoSrc}
                  alt="Brilliance Advisory Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                  onError={() => {
                    // Fallback to PNG if SVG doesn't exist
                    if (logoSrc.includes('.svg')) {
                      setLogoSrc('/images/whitelogo.png')
                    }
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-white cursor-pointer">Brilliance Advisory</h3>
            </Link>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-gray-400 hover:text-teal transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-2 md:space-y-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Brilliance Advisory Pte. Ltd. All rights reserved.</p>
            <p className="text-gray-500">
              <Link href="/disclaimer" className="hover:text-teal transition-colors">Disclaimer</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
