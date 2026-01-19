"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  FileText,
  Settings,
} from "lucide-react"

const tabItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/consultant/clients",
    icon: Users,
  },
  {
    title: "Apps",
    href: "/consultant/applications",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/consultant/dashboard/settings",
    icon: Settings,
  },
]

export function BottomTabs() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex h-16 items-center justify-around">
        {tabItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
