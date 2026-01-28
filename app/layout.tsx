import "./globals.css"
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ConditionalAuthProvider>
          {children}
        </ConditionalAuthProvider>
      </body>
    </html>
  )
}
