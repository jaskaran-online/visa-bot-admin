"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { getAllBots } from "@/lib/api/bots"
import { hasPermission } from "@/lib/auth"
import { LogsTable } from "@/components/logs/logs-table"
import { LogsFilter } from "@/components/logs/logs-filter"
import { LogsStatistics } from "@/components/logs/logs-statistics"
import { PollingLogViewer } from "@/components/logs/polling-log-viewer"
import { Download, RefreshCw, Trash2 } from "lucide-react"
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
import { format } from "date-fns"

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("realtime")
  const [filters, setFilters] = useState({
    botId: "all",
    logLevel: "all",
    dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    searchQuery: "",
  })
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  // Add a state for bots
  const [bots, setBots] = useState<any[]>([])

  const fetchLogs = async () => {
    try {
      setIsRefreshing(true)
      const data = await apiClient.getAllLogs()
      setLogs(data)
      applyFilters(data)
    } catch (error) {
      toast({
        title: "Error fetching logs",
        description: "Failed to load system logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (activeTab !== "realtime") {
      // fetchLogs()
    }
  }, [activeTab, toast])

  // Add this useEffect to fetch bots data
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getAllBots()
        setBots(data.bots || [])
      } catch (error) {
        console.error("Failed to fetch bots:", error)
        setBots([])
      }
    }

    fetchBots()
  }, [])

  const applyFilters = (logsData = logs) => {
    let result = [...logsData]

    // Apply bot filter
    if (filters.botId !== "all") {
      result = result.filter((log) => log.botId === filters.botId)
    }

    // Apply log level filter
    if (filters.logLevel !== "all") {
      result = result.filter((log) => log.level === filters.logLevel)
    }

    // Apply date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter((log) => {
        const logDate = new Date(log.timestamp)
        return logDate >= filters.dateRange[0]! && logDate <= filters.dateRange[1]!
      })
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          (log.botName && log.botName.toLowerCase().includes(query)) ||
          (log.context && JSON.stringify(log.context).toLowerCase().includes(query)),
      )
    }

    // Apply tab filter
    if (activeTab !== "all" && activeTab !== "realtime") {
      if (activeTab === "errors") {
        result = result.filter((log) => log.level === "error")
      } else if (activeTab === "warnings") {
        result = result.filter((log) => log.level === "warning")
      } else if (activeTab === "info") {
        result = result.filter((log) => log.level === "info")
      }
    }

    setFilteredLogs(result)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, activeTab, logs])

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleRefresh = () => {
    fetchLogs()
  }

  const handleClearLogs = async () => {
    try {
      const response = await apiClient.clearAllLogs()

      setLogs([])
      setFilteredLogs([])

      toast({
        title: "Logs cleared",
        description: response.message,
      })
    } catch (error) {
      toast({
        title: "Error clearing logs",
        description: error instanceof Error ? error.message : "Failed to clear system logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportLogs = () => {
    try {
      // Create a JSON string of the logs
      const logsJson = JSON.stringify(filteredLogs, null, 2)

      // Create a blob and download link
      const blob = new Blob([logsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `system-logs-${format(new Date(), "yyyy-MM-dd")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Logs exported",
        description: "System logs have been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error exporting logs",
        description: error instanceof Error ? error.message : "Failed to export system logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground">Monitor and analyze system and bot activity logs</p>
          </div>
          <div className="flex gap-2">
            {activeTab !== "realtime" && (
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {isAdmin && (
              <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Logs
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all system logs. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleClearLogs()
                        setIsClearDialogOpen(false)
                      }}
                    >
                      Clear All Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {activeTab !== "realtime" && (
          <LogsFilter bots={bots} onFilterChange={handleFilterChange} filters={filters} />
        )}

        {activeTab !== "realtime" && (
          <div className="grid gap-4 md:grid-cols-3">
            <LogsStatistics logs={filteredLogs} isLoading={isLoading} />
          </div>
        )}

        <Tabs defaultValue="realtime" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="realtime">Real-time Logs</TabsTrigger>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <div className="h-[600px]">
              <PollingLogViewer
                title="Real-time System Logs"
                description="Live view of system and bot logs"
                botId="general"
                maxEntries={100}
                pollInterval={30000}
                canClear={isAdmin}
                canExport={true}
              />
            </div>
          </TabsContent>

          <TabsContent value={activeTab} className="space-y-4">
            {activeTab !== "realtime" && (
              <Card>
                <CardHeader>
                  <CardTitle>Log Entries</CardTitle>
                  <CardDescription>
                    {activeTab === "all"
                      ? "All system logs"
                      : activeTab === "errors"
                        ? "Error logs only"
                        : activeTab === "warnings"
                          ? "Warning logs only"
                          : "Information logs only"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogsTable logs={filteredLogs} isLoading={isLoading} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
