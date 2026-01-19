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

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/crm",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/crm/products",
    icon: Package,
  },
  {
    title: "Deals",
    href: "/crm/deals",
    icon: FileCheck,
  },
  {
    title: "Clients",
    href: "/consultant/clients",
    icon: Users,
  },
  {
    title: "Applications",
    href: "/consultant/applications",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/consultant/dashboard/settings",
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
          const isActive = pathname === item.href
          
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
