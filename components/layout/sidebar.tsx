"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { BarChart3, Bot, FileText, Home, LayoutDashboard, Settings, Server, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SystemStatus } from "@/components/system-status"

interface SidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
  isOpen: boolean
  currentPath: string
}

export function Sidebar({ user, isOpen, currentPath }: SidebarProps) {
  const isAdmin = user.role === "admin"

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["admin", "viewer"],
    },
    {
      name: "Bots",
      href: "/bots",
      icon: Bot,
      allowedRoles: ["admin", "viewer"],
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
      allowedRoles: ["admin", "viewer"],
    },
    {
      name: "Logs",
      href: "/logs",
      icon: FileText,
      allowedRoles: ["admin", "viewer"],
    },
    {
      name: "Statistics",
      href: "/statistics",
      icon: BarChart3,
      allowedRoles: ["admin", "viewer"],
    },
    {
      name: "Server Configuration",
      href: "/server-config",
      icon: Server,
      allowedRoles: ["admin"],
    },
    {
      name: "User Management",
      href: "/users",
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      allowedRoles: ["admin", "viewer"],
    },
  ]

  if (!isOpen) {
    return (
      <div className="hidden md:flex flex-col h-full w-16 bg-background border-r">
        <div className="flex h-16 items-center justify-center border-b">
          <Link href="/dashboard">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col items-center gap-2 px-2">
            {navItems
              .filter((item) => item.allowedRoles.includes(user.role))
              .map((item) => (
                <li key={item.href} className="w-full">
                  <Link href={item.href}>
                    <Button variant={currentPath === item.href ? "secondary" : "ghost"} size="icon" className="w-full">
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.name}</span>
                    </Button>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full w-64 bg-background border-r", isOpen ? "block" : "hidden md:block")}>
      <div className="flex h-16 items-center px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          <span>USA VISA Bot System</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="grid gap-1 px-2">
          {navItems
            .filter((item) => item.allowedRoles.includes(user.role))
            .map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button variant={currentPath === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
        </ul>
        
        {/* Add System Status Component */}
        <div className="px-2 mt-4">
          <SystemStatus />
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary">{user.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
