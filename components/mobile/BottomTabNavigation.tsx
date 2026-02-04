'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Calendar, CheckSquare, Users, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/route-constants'

interface TabItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const tabs: TabItem[] = [
  {
    label: 'Calendar',
    href: '/consultant/calendar',
    icon: Calendar,
  },
  {
    label: 'Tasks',
    href: '/consultant/tasks',
    icon: CheckSquare,
  },
  {
    label: 'Deals',
    href: ROUTES.CRM.DEALS,
    icon: FileCheck,
  },
  {
    label: 'Clients',
    href: '/consultant/clients',
    icon: Users,
  },
]

export default function BottomTabNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href)
          
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-6 h-6', active && 'text-primary')} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                active ? 'text-primary' : 'text-gray-500'
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
