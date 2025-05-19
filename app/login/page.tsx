"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For demo purposes, using static credentials
      // In a real app, this would be an API call
      if (email === "admin@example.com" && password === "admin123") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store user info and token in localStorage or secure cookie
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: "admin",
            name: "Admin User",
          }),
        )
        localStorage.setItem("token", "demo-jwt-token")

        toast({
          title: "Login successful",
          description: "Welcome to the VISA Bot System",
        })

        router.push("/dashboard")
      } else if (email === "viewer@example.com" && password === "viewer123") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store user info and token in localStorage or secure cookie
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: "viewer",
            name: "Viewer User",
          }),
        )
        localStorage.setItem("token", "demo-jwt-token")

        toast({
          title: "Login successful",
          description: "Welcome to the VISA Bot System",
        })

        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Bot System Logo" width={80} height={80} />
          </div>
          <CardTitle className="text-2xl font-bold">VISA Bot</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {/* <div className="w-full">
            <p>Demo credentials:</p>
            <p>Admin: admin@example.com / admin123</p>
            <p>Viewer: viewer@example.com / viewer123</p>
          </div> */}
        </CardFooter>
      </Card>
    </div>
  )
}
