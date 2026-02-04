"use client"

import React from "react"
import { SidebarNav } from "@/components/nav/SidebarNav"
import { BottomTabs } from "@/components/nav/BottomTabs"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="crm-app flex min-h-screen flex-col min-w-0">
      <div className="flex flex-1 min-w-0">
        <SidebarNav />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomTabs />
    </div>
  )
}
