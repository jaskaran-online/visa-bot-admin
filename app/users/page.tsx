"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { hasPermission } from "@/lib/auth"
import { UserList } from "@/components/users/user-list"
import { AddUserForm } from "@/components/users/add-user-form"
import { UserStatistics } from "@/components/users/user-statistics"
import { Plus, Users, RefreshCw } from "lucide-react"

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: "2023-05-01T12:00:00Z",
    createdAt: "2023-01-15T09:30:00Z",
  },
  {
    id: "2",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    lastLogin: "2023-04-28T15:45:00Z",
    createdAt: "2023-02-20T14:15:00Z",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "viewer",
    lastLogin: "2023-04-25T10:30:00Z",
    createdAt: "2023-03-10T11:20:00Z",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    lastLogin: "2023-04-30T09:15:00Z",
    createdAt: "2023-03-15T16:45:00Z",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, router])

  const fetchUsers = () => {
    try {
      setIsRefreshing(true)
      // In a real app, this would be an API call
      // For demo purposes, we'll use the mock data
      setUsers(mockUsers)
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [toast])

  const handleAddUser = (user: { name: string; email: string; role: string; password: string }) => {
    try {
      // In a real app, this would be an API call
      const newUser = {
        id: Date.now().toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: null,
        createdAt: new Date().toISOString(),
      }

      setUsers([...users, newUser])

      toast({
        title: "User added",
        description: `User "${user.name}" has been added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error adding user",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = (id: string, updates: { name?: string; email?: string; role?: string }) => {
    try {
      const updatedUsers = users.map((user) => (user.id === id ? { ...user, ...updates } : user))
      setUsers(updatedUsers)

      toast({
        title: "User updated",
        description: `User has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error updating user",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = (id: string) => {
    try {
      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)

      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = (id: string) => {
    try {
      // In a real app, this would be an API call to reset the password
      // For demo purposes, we'll just show a success message

      toast({
        title: "Password reset",
        description: "A password reset link has been sent to the user's email.",
      })
    } catch (error) {
      toast({
        title: "Error resetting password",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  if (!isAdmin) {
    return null // Prevent rendering if not admin
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <UserStatistics users={users} isLoading={isLoading} />
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="add">Add User</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Accounts
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList
                  users={users}
                  isLoading={isLoading}
                  onUpdate={handleUpdateUser}
                  onDelete={handleDeleteUser}
                  onResetPassword={handleResetPassword}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New User
                </CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent>
                <AddUserForm onAddUser={handleAddUser} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
