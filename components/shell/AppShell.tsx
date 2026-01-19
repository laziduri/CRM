"use client"

import React from "react"
import { SidebarNav } from "@/components/nav/SidebarNav"
import { BottomTabs } from "@/components/nav/BottomTabs"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomTabs />
    </div>
  )
}
