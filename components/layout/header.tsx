"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Bell, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
  onLogout: () => void
  onToggleSidebar: () => void
}

export function Header({ user, onLogout, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(3)

  const clearNotifications = () => {
    setNotifications(0)
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearNotifications}>Clear all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/generic-avatar.png?height=32&width=32&query=avatar for ${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-1">
                  {user.role === "admin" ? "Admin" : "Viewer"}
                </Badge>
              </div>
            </div>
            <DropdownMenuItem asChild>
              <button className="w-full cursor-pointer" onClick={onLogout}>
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
