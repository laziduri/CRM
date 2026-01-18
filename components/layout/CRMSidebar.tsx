'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar as CalendarIcon,
  MessageSquare,
  TrendingUp,
  DollarSign,
  FolderKanban,
  CheckSquare,
  BarChart3,
  GitBranch,
  Mic,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Briefcase,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavCategory {
  label: string
  items: NavItem[]
  defaultOpen?: boolean
}

export default function CRMSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    ai: true,
    core: true,
  })

  const navCategories: NavCategory[] = [
    {
      label: 'Core',
      defaultOpen: true,
      items: [
        { label: 'Dashboard', href: '/consultant/dashboard', icon: LayoutDashboard },
        { label: 'Clients', href: '/consultant/clients', icon: Users },
        { label: 'Pipeline', href: '/consultant/pipeline', icon: FolderKanban },
        { label: 'Messages', href: '/consultant/messages', icon: MessageSquare },
        { label: 'Appointments', href: '/consultant/appointments', icon: CalendarIcon },
        { label: 'Summaries', href: '/consultant/summaries', icon: FileText },
      ],
    },
    {
      label: 'AI Features',
      defaultOpen: true,
      items: [
        { label: 'AI Project Manager', href: '/consultant/ai/projects', icon: FolderKanban },
        { label: 'AI Task Manager', href: '/consultant/ai/tasks', icon: CheckSquare },
        { label: 'AI Calendar', href: '/consultant/ai/calendar', icon: CalendarIcon },
        { label: 'AI Gantt Chart', href: '/consultant/ai/gantt', icon: BarChart3 },
        { label: 'AI Workflows', href: '/consultant/ai/workflows', icon: GitBranch },
        { label: 'AI Meeting Assistant', href: '/consultant/ai/meeting-assistant', icon: CalendarIcon },
        { label: 'AI Meeting Notetaker', href: '/consultant/ai/meetings', icon: Mic },
        { label: 'AI Chat', href: '/consultant/ai/chat', icon: MessageSquare },
        { label: 'AI Dashboards', href: '/consultant/ai/dashboards', icon: LayoutDashboard },
        { label: 'AI Docs Assistant', href: '/consultant/ai/docs', icon: FileText },
      ],
    },
    {
      label: 'Analytics & Performance',
      items: [
        { label: 'Performance', href: '/consultant/performance', icon: TrendingUp },
        { label: 'Commission', href: '/consultant/commission', icon: DollarSign },
      ],
    },
    {
      label: 'Settings',
      items: [
        { label: 'Settings', href: '/consultant/dashboard/settings', icon: Settings },
        { label: 'Resources', href: '/consultant/dashboard/resources', icon: FileText },
      ],
    },
  ]

  const toggleCategory = (categoryLabel: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryLabel]: !prev[categoryLabel],
    }))
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const handleNavClick = () => {
    // Close mobile menu when clicking a link
    if (window.innerWidth < 768) {
      setIsMobileOpen(false)
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Initialize category states
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    navCategories.forEach((cat) => {
      initial[cat.label] = cat.defaultOpen ?? false
    })
    setOpenCategories((prev) => ({ ...prev, ...initial }))
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-40
          bg-white border-r border-gray-200
          w-64 md:w-64
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link href="/consultant/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Brilliance CRM</h2>
                <p className="text-xs text-gray-500">Consultant Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {/* My Tasks - Quick Access */}
            <Link
              href="/consultant/ai/tasks"
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg mb-4
                transition-colors
                ${isActive('/consultant/ai/tasks')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm font-medium">My Tasks</span>
            </Link>

            {/* Workspaces Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Workspaces
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <span className="text-gray-400 text-lg">+</span>
                </button>
              </div>
            </div>

            {/* Navigation Categories */}
            {navCategories.map((category) => {
              const isOpen = openCategories[category.label] ?? false
              const hasActiveItem = category.items.some((item) => isActive(item.href))

              return (
                <div key={category.label} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.label)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      transition-colors
                      ${hasActiveItem
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <span className="text-sm font-medium">{category.label}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-2 mt-1 space-y-1">
                      {category.items.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleNavClick}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-colors text-sm
                              ${active
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Footer/User Section */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/consultant/dashboard/settings"
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                transition-colors text-sm
                ${isActive('/consultant/dashboard/settings')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
