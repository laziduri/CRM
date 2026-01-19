import "./globals.css"
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalAuthProvider>
          {children}
        </ConditionalAuthProvider>
      </body>
    </html>
  )
}
