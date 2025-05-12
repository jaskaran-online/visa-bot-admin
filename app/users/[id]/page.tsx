"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { hasPermission } from "@/lib/auth"
import { ArrowLeft, User, Clock, Calendar, Shield, KeyRound, AlertCircle, Mail, Hash, Network } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: "2023-05-01T12:00:00Z",
    createdAt: "2023-01-15T09:30:00Z",
    loginCount: 42,
    lastIp: "192.168.1.1",
  },
  {
    id: "2",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    lastLogin: "2023-04-28T15:45:00Z",
    createdAt: "2023-02-20T14:15:00Z",
    loginCount: 28,
    lastIp: "192.168.1.2",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "viewer",
    lastLogin: "2023-04-25T10:30:00Z",
    createdAt: "2023-03-10T11:20:00Z",
    loginCount: 15,
    lastIp: "192.168.1.3",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    lastLogin: "2023-04-30T09:15:00Z",
    createdAt: "2023-03-15T16:45:00Z",
    loginCount: 32,
    lastIp: "192.168.1.4",
  },
]

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, router])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use the mock data
        const foundUser = mockUsers.find((u) => u.id === params.id)
        if (foundUser) {
          setUser(foundUser)
        }
      } catch (error) {
        toast({
          title: "Error fetching user",
          description: "Failed to load user details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.id, toast])

  const handleResetPassword = () => {
    try {
      // In a real app, this would be an API call to reset the password
      // For demo purposes, we'll just show a success message

      toast({
        title: "Password reset",
        description: "A password reset link has been sent to the user's email.",
      })
      setResetPasswordDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error resetting password",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return null // Prevent rendering if not admin
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        ) : user ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Password</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will send a password reset link to {user.email}. Do you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetPassword}>Reset Password</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" onClick={() => router.push(`/users/edit/${user.id}`)}>
                  Edit User
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-muted-foreground">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Role</p>
                      <p className="text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-muted-foreground">
                        {format(new Date(user.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-muted-foreground">
                        {user.lastLogin
                          ? format(new Date(user.lastLogin), "MMMM d, yyyy 'at' h:mm a")
                          : "Never logged in"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Hash className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Login Count</p>
                      <p className="text-muted-foreground">{user.loginCount} times</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Network className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last IP Address</p>
                      <p className="text-muted-foreground font-mono">{user.lastIp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">User not found</h2>
            <p className="text-muted-foreground mt-2">
              The user you are looking for does not exist or has been deleted
            </p>
            <Button className="mt-4" onClick={() => router.push("/users")}>
              Back to Users
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
