"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { hasPermission, getCurrentUser } from "@/lib/auth"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SystemSettings } from "@/components/settings/system-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { User, Bell, Sliders, Palette, Shield, Save } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use the getCurrentUser function
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        toast({
          title: "Error fetching user data",
          description: "Failed to load your profile information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [toast])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would be an API call to save all settings
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account and system preferences</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span className="hidden md:inline">System</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings user={user} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings and defaults</CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemSettings isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSettings isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
