"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { hasPermission } from "@/lib/auth"
import { ServerList } from "@/components/server-config/server-list"
import { AddServerForm } from "@/components/server-config/add-server-form"
import { ServerStatus } from "@/components/server-config/server-status"
import { Plus, Server, RefreshCw } from "lucide-react"

export default function ServerConfigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [servers, setServers] = useState<any[]>([])
  const [activeServer, setActiveServer] = useState<any>(null)
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

  const fetchServers = () => {
    try {
      setIsRefreshing(true)
      const serverList = apiClient.getServers()
      const active = apiClient.getActiveServer()
      setServers(serverList)
      setActiveServer(active)
    } catch (error) {
      toast({
        title: "Error fetching servers",
        description: "Failed to load server configurations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [toast])

  const handleAddServer = (server: { name: string; baseUrl: string }) => {
    try {
      const newServer = apiClient.addServer(server)
      setServers([...servers, newServer])

      toast({
        title: "Server added",
        description: `Server "${server.name}" has been added successfully.`,
      })

      // If this is the first server, it will be set as active
      if (servers.length === 0) {
        setActiveServer(newServer)
      }
    } catch (error) {
      toast({
        title: "Error adding server",
        description: "Failed to add server. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateServer = (id: string, updates: { name?: string; baseUrl?: string }) => {
    try {
      const updatedServer = apiClient.updateServer(id, updates)
      if (updatedServer) {
        setServers(servers.map((server) => (server.id === id ? updatedServer : server)))

        // If the active server was updated, update the active server state
        if (activeServer && activeServer.id === id) {
          setActiveServer(updatedServer)
        }

        toast({
          title: "Server updated",
          description: `Server "${updatedServer.name}" has been updated successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error updating server",
        description: "Failed to update server. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteServer = (id: string) => {
    try {
      const wasActive = activeServer && activeServer.id === id
      const success = apiClient.removeServer(id)

      if (success) {
        const updatedServers = servers.filter((server) => server.id !== id)
        setServers(updatedServers)

        // If the active server was deleted, update the active server state
        if (wasActive) {
          setActiveServer(apiClient.getActiveServer())
        }

        toast({
          title: "Server deleted",
          description: "Server has been deleted successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting server",
        description: "Failed to delete server. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetActiveServer = (id: string) => {
    try {
      const success = apiClient.setActiveServer(id)

      if (success) {
        // Update all servers to reflect the new active state
        const updatedServers = servers.map((server) => ({
          ...server,
          isActive: server.id === id,
        }))

        setServers(updatedServers)
        setActiveServer(updatedServers.find((server) => server.id === id))

        toast({
          title: "Active server changed",
          description: "The active server has been changed successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error changing active server",
        description: "Failed to change the active server. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    fetchServers()
  }

  if (!isAdmin) {
    return null // Prevent rendering if not admin
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Server Configuration</h1>
            <p className="text-muted-foreground">Manage API servers for the bot system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ServerStatus activeServer={activeServer} isLoading={isLoading} />
        </div>

        <Tabs defaultValue="servers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="add">Add Server</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Configured Servers
                </CardTitle>
                <CardDescription>Manage the API servers used by the bot system</CardDescription>
              </CardHeader>
              <CardContent>
                <ServerList
                  servers={servers}
                  activeServerId={activeServer?.id}
                  isLoading={isLoading}
                  onUpdate={handleUpdateServer}
                  onDelete={handleDeleteServer}
                  onSetActive={handleSetActiveServer}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Server
                </CardTitle>
                <CardDescription>Configure a new API server for the bot system</CardDescription>
              </CardHeader>
              <CardContent>
                <AddServerForm onAddServer={handleAddServer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
