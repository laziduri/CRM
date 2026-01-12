import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    company: [
      { href: '/aboutus', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
      { href: '/terms', label: 'Terms & Conditions' },
    ],
    products: [
      { href: '/loans/personal', label: 'Personal Loans' },
      { href: '/loans/business', label: 'Business Loans' },
    ],
    resources: [
      { href: '/calculator', label: 'Loan Calculator' },
      { href: '/apply', label: 'Apply Now' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/">
              <h3 className="text-2xl font-bold text-white mb-4 hover:text-teal-light transition-colors cursor-pointer">Brilliance Advisory</h3>
            </Link>
            <p className="text-sm mb-4 leading-relaxed">
              Singapore-based financial consultancy specialising in human-led personal and business loan advisory. We provide personalised guidance to help you secure the right financing solution.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-gray-400 hover:text-white transition-colors"
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
                    className="text-sm hover:text-white transition-colors"
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
                    className="text-sm hover:text-white transition-colors"
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
                    className="text-sm hover:text-white transition-colors"
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
            <p>&copy; {new Date().getFullYear()} Brilliance Advisory Pte. Ltd. All rights reserved.</p>
            <p className="text-gray-500">
              <Link href="/faq" className="hover:text-white transition-colors">Disclaimer</Link>
              {' • '}
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              {' • '}
              <span>Licensed financial consultancy in Singapore</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
