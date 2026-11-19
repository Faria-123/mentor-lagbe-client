import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SessionProvider } from "@/components/session-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/site/navbar";
// import { Footer } from "@/components/site/footer";
import { Footer } from "@/components/site/footer";
import { Toaster } from "@/components/ui/toast";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <SessionProvider>

            <div className="flex min-h-svh flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
              >
                Skip to content
              </a>
              <Navbar
              />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Toaster></Toaster>
              <Footer />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
