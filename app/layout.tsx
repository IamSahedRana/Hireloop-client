import {
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Inter,
  Inter_Tight,
  Manrope,
  Plus_Jakarta_Sans,
  Rethink_Sans,
  Space_Mono,
} from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })
const rethinkSans = Rethink_Sans({ subsets: ["latin"], variable: "--font-rethink" })
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        geist.variable,
        manrope.variable,
        jakarta.variable,
        spaceMono.variable,
        inter.variable,
        interTight.variable,
        rethinkSans.variable,
        instrumentSans.variable,
        "font-sans",
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
