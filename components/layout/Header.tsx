'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, User, LogOut, Settings, FileText, FolderKanban, CheckSquare, Calendar, BarChart3, GitBranch, Mic, MessageSquare, LayoutDashboard } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, client, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false)
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false)
  const [isCalculatorDropdownOpen, setIsCalculatorDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isConsultant, setIsConsultant] = useState(false)
  const [consultant, setConsultant] = useState<any>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Check if user is logged in as consultant - refresh on route changes
  useEffect(() => {
    const checkConsultantAuth = async () => {
      if (typeof window === 'undefined') return

      const consultantToken = localStorage.getItem('consultant_token')
      const consultantId = localStorage.getItem('consultant_id')
      
      if (consultantToken && consultantId) {
        try {
          // Fetch consultant data from API
          const response = await fetch(`/api/consultant/${consultantId}`)
          if (response.ok) {
            const data = await response.json()
            setIsConsultant(true)
            setConsultant(data.consultant)
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('consultant_token')
            localStorage.removeItem('consultant_id')
            setIsConsultant(false)
            setConsultant(null)
          }
        } catch (error) {
          console.error('Error fetching consultant data:', error)
          setIsConsultant(false)
          setConsultant(null)
        }
      } else {
        setIsConsultant(false)
        setConsultant(null)
      }
    }

    checkConsultantAuth()
  }, [pathname]) // Refresh on route changes

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      // Use mousedown instead of click to avoid conflicts with hover
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  // Hide header on CRM pages (they have their own header) - check AFTER all hooks
  if (pathname?.startsWith('/crm')) {
    return null
  }

  const navLinks = [
    { href: '/aboutus', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/resources', label: 'Resources' },
  ]

  const contactLinks = [
    { href: '/contact', label: 'Contact Us' },
    { href: '/appointments', label: 'Schedule Appointment' },
    { href: '/referral', label: 'Refer a Friend' },
  ]

  const loanLinks = [
    { href: '/loans/business', label: 'Business Loans' },
    { href: '/loans/personal', label: 'Personal Loans' },
    ...(isAuthenticated ? [{ href: '/apply', label: 'Apply Loan' }] : []),
  ]

  const calculatorLinks = [
    { href: '/calculator', label: 'Loan Calculator' },
    { href: '/calculator/debt-consolidation', label: 'Debt Consolidation' },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-secondary-gray3/30 w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 flex-shrink-0">
              <img
                src="/images/brilliance-logo.svg"
                alt="Brilliance Advisory Logo"
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  // Fallback to PNG if SVG doesn't exist
                  if (e.currentTarget.src.includes('.svg')) {
                    e.currentTarget.src = '/images/brilliance-logo.png'
                  }
                }}
              />
            </div>
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
              <button
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                Loans
                <ChevronDown size={16} className={`transition-transform ${isLoansDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLoansDropdownOpen && (
                <>
                  {/* Invisible hover bridge to cover the gap between button and menu */}
                  <div className="absolute top-full left-0 w-48 h-4"></div>
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute top-full left-0 w-48 z-50 mt-2"
                    onMouseEnter={() => setIsLoansDropdownOpen(true)}
                    onMouseLeave={() => setIsLoansDropdownOpen(false)}
                  >
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

            {/* Calculator Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCalculatorDropdownOpen(true)}
              onMouseLeave={() => setIsCalculatorDropdownOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                Calculator
                <ChevronDown size={16} className={`transition-transform ${isCalculatorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCalculatorDropdownOpen && (
                <>
                  {/* Invisible hover bridge */}
                  <div className="absolute top-full left-0 w-56 h-4"></div>
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute top-full left-0 w-56 z-50 mt-2"
                    onMouseEnter={() => setIsCalculatorDropdownOpen(true)}
                    onMouseLeave={() => setIsCalculatorDropdownOpen(false)}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-secondary-gray3/50 py-2">
                      {calculatorLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsCalculatorDropdownOpen(false)}
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
                onClick={() => {
                  setIsLoansDropdownOpen(false)
                  setIsCalculatorDropdownOpen(false)
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Contact Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsContactDropdownOpen(true)}
              onMouseLeave={() => setIsContactDropdownOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                Contact
                <ChevronDown size={16} className={`transition-transform ${isContactDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isContactDropdownOpen && (
                <>
                  {/* Invisible hover bridge */}
                  <div className="absolute top-full left-0 w-48 h-4"></div>
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute top-full left-0 w-48 z-50 mt-2"
                    onMouseEnter={() => setIsContactDropdownOpen(true)}
                    onMouseLeave={() => setIsContactDropdownOpen(false)}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-secondary-gray3/50 py-2">
                      {contactLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsContactDropdownOpen(false)}
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
          </div>

          {/* CTA Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {(isAuthenticated && client) || isConsultant ? (
              <div 
                className="relative" 
                ref={profileDropdownRef}
                onMouseEnter={() => {
                  setIsProfileDropdownOpen(true)
                }}
                onMouseLeave={(e) => {
                  // Check if mouse is leaving to go to dropdown
                  const relatedTarget = e.relatedTarget as HTMLElement
                  if (!profileDropdownRef.current?.contains(relatedTarget)) {
                    setIsProfileDropdownOpen(false)
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all"
                >
                  {(client?.profilePicture || consultant?.profilePicture) ? (
                    <img
                      src={client?.profilePicture || consultant?.profilePicture}
                      alt={client?.name || consultant?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>
                {isProfileDropdownOpen && (
                  <>
                    {/* Invisible hover bridge to keep dropdown open when moving mouse */}
                    <div className="absolute top-full right-0 w-80 h-4"></div>
                    {/* Dropdown Menu */}
                    <div 
                      className="absolute top-full right-0 w-64 z-50 mt-2"
                      onMouseEnter={() => setIsProfileDropdownOpen(true)}
                      onMouseLeave={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-secondary-gray3/50 py-2">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{client?.name || consultant?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{client?.email || consultant?.email}</p>
                          {isConsultant && consultant && (
                            <p className="text-xs text-gray-400 mt-1">Consultant ID: {consultant.consultantId}</p>
                          )}
                        </div>
                        {isConsultant ? (
                          <>
                            <Link
                              href="/consultant/dashboard"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Consultant Dashboard
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Features</p>
                            </div>
                            <Link
                              href="/consultant/ai/projects"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <FolderKanban className="w-4 h-4" />
                              AI Project Manager
                            </Link>
                            <Link
                              href="/consultant/ai/tasks"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <CheckSquare className="w-4 h-4" />
                              AI Task Manager
                            </Link>
                            <Link
                              href="/consultant/ai/calendar"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              AI Calendar
                            </Link>
                            <Link
                              href="/consultant/ai/gantt"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <BarChart3 className="w-4 h-4" />
                              AI Gantt Chart
                            </Link>
                            <Link
                              href="/consultant/ai/workflows"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <GitBranch className="w-4 h-4" />
                              AI Workflows
                            </Link>
                            <Link
                              href="/consultant/ai/meeting-assistant"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              AI Meeting Assistant
                            </Link>
                            <Link
                              href="/consultant/ai/meetings"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <Mic className="w-4 h-4" />
                              AI Meeting Notetaker
                            </Link>
                            <Link
                              href="/consultant/ai/chat"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                              AI Chat
                            </Link>
                            <Link
                              href="/consultant/ai/dashboards"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              AI Dashboards
                            </Link>
                            <Link
                              href="/consultant/ai/docs"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              AI Docs Assistant
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                            <Link
                              href="/consultant/dashboard/resources"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              Document Resources
                            </Link>
                            <Link
                              href="/consultant/dashboard/settings"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                localStorage.removeItem('consultant_token')
                                localStorage.removeItem('consultant_id')
                                setIsConsultant(false)
                                setConsultant(null)
                                router.push('/client/login')
                                router.refresh()
                              }}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/client/dashboard"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/client/dashboard/settings"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-light/10 hover:text-primary transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false)
                                logout()
                              }}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {!isConsultant && (
                  <>
                    <Link href="/client/login">
                      <Button variant="secondary" size="md">
                        Login
                      </Button>
                    </Link>
                    <Link href="/apply">
                      <Button variant="primary" size="md">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
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
                <div className="text-gray-700 font-medium px-4 py-2">
                  Loans
                </div>
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

              {/* Mobile Calculator Menu */}
              <div className="space-y-2">
                <div className="text-gray-700 font-medium px-4 py-2">
                  Calculator
                </div>
                {calculatorLinks.map((link) => (
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
              
              {/* Mobile Contact Menu */}
              <div className="space-y-2">
                <div className="text-gray-700 font-medium px-4 py-2">
                  Contact
                </div>
                {contactLinks.map((link) => (
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
              
              {(isAuthenticated && client) || isConsultant ? (
                <div className="pt-2 space-y-2 border-t">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-gray-900">{client?.name || consultant?.name}</p>
                    <p className="text-xs text-gray-500">{client?.email || consultant?.email}</p>
                    {isConsultant && consultant && (
                      <p className="text-xs text-gray-400 mt-1">Consultant ID: {consultant.consultantId}</p>
                    )}
                  </div>
                  {isConsultant ? (
                    <>
                      <Link
                        href="/consultant/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Consultant Dashboard
                      </Link>
                      <Link
                        href="/consultant/dashboard/resources"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Document Resources
                      </Link>
                      <Link
                        href="/consultant/dashboard/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          localStorage.removeItem('consultant_token')
                          localStorage.removeItem('consultant_id')
                          setIsConsultant(false)
                          setConsultant(null)
                          router.push('/client/login')
                          router.refresh()
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/client/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/client/dashboard/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          logout()
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/client/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                    <Button variant="secondary" size="md" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                    <Button variant="primary" size="md" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
