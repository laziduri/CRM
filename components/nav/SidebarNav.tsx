"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Package,
  FileCheck,
} from "lucide-react"
import { ROUTES } from "@/lib/route-constants"

const navItems = [
  {
    title: "CRM Home",
    href: ROUTES.CRM.HOME,
    icon: Home,
  },
  {
    title: "Dashboard",
    href: ROUTES.CONSULTANT.DASHBOARD,
    icon: BarChart3,
  },
  {
    title: "Products",
    href: ROUTES.CRM.PRODUCTS,
    icon: Package,
  },
  {
    title: "Deals",
    href: ROUTES.CRM.DEALS,
    icon: FileCheck,
  },
  {
    title: "Clients",
    href: ROUTES.CONSULTANT.CLIENTS,
    icon: Users,
  },
  {
    title: "Applications",
    href: ROUTES.CONSULTANT.APPLICATIONS,
    icon: FileText,
  },
  {
    title: "Settings",
    href: ROUTES.CONSULTANT.SETTINGS,
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== ROUTES.CRM.HOME && pathname?.startsWith(item.href + '/'))
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-accent"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
