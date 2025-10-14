import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SWRegister } from "@/components/pwa/sw-register"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PCB Defect Detection System",
  description: "AI-powered PCB defect detection and analysis",
  creator: 'imaks.ai',
  icons: {
    icon: "/icon.png", // relative to /public
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA: manifest + theme color */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00E5E5" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>

      <body className={`${inter.className} bg-[#0F172A] text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
          <SWRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}