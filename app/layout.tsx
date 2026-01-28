import "./globals.css"
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider"
import PreloaderWrapper from "@/components/PreloaderWrapper"
import type { Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </ConditionalAuthProvider>
      </body>
    </html>
  )
}
