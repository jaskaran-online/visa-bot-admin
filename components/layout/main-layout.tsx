"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  console.log("isMobile", isMobile)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setIsSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    } catch (error) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} isOpen={isSidebarOpen} currentPath={pathname} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800/10 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
