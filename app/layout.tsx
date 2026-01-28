import "./globals.css"
import { ConditionalAuthProvider } from "@/components/ConditionalAuthProvider"
import PreloaderWrapper from "@/components/PreloaderWrapper"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
