import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "USA VISA Appointment Bot System",
  description: "Admin panel for managing USA VISA appointment bots",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
