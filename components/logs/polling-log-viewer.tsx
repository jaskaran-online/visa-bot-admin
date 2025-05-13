"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { getBotLogs, clearBotLogs } from "@/lib/api/bots"

type LogLevel = "info" | "warning" | "error"

interface LogEntry {
  message: string
  timestamp: string
  type: LogLevel
}

interface PollingLogViewerProps {
  title: string
  description?: string
  botId: string
  maxEntries?: number
  pollInterval?: number
  canClear?: boolean
  canExport?: boolean
}

export function PollingLogViewer({
  title,
  description,
  botId,
  maxEntries = 100,
  pollInterval = 30000, // Default to 30 seconds
  canClear = false,
  canExport = true,
}: PollingLogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPolling, setIsPolling] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const fetchedLogs = await getBotLogs(botId)
      
      // Sort logs in reverse chronological order (newest first)
      const sortedLogs = [...fetchedLogs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      
      // Limit to maximum number of entries
      const limitedLogs = sortedLogs.slice(0, maxEntries)
      
      setLogs(limitedLogs)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch logs:", error)
      toast({
        title: "Error fetching logs",
        description: "Failed to load logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Set up polling
  useEffect(() => {
    // Fetch logs immediately
    fetchLogs()

    // Set up polling interval if enabled
    if (isPolling) {
      pollingIntervalRef.current = setInterval(fetchLogs, pollInterval)
    }

    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [botId, pollInterval, isPolling])

  const handleTogglePolling = () => {
    if (isPolling) {
      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    } else {
      // Start polling and fetch logs immediately
      fetchLogs()
      pollingIntervalRef.current = setInterval(fetchLogs, pollInterval)
    }
    
    setIsPolling(!isPolling)
  }

  const handleClear = async () => {
    try {
      await clearBotLogs(botId)
      setLogs([])
      toast({
        title: "Logs cleared",
        description: "All logs have been cleared successfully",
      })
    } catch (error) {
      toast({
        title: "Error clearing logs",
        description: "Failed to clear logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    try {
      // Create a JSON string of the logs
      const logsJson = JSON.stringify(logs, null, 2)

      // Create a blob and download link
      const blob = new Blob([logsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bot-${botId}-logs-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Logs exported",
        description: "Logs have been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error exporting logs",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleManualRefresh = () => {
    fetchLogs()
  }

  // Get badge variant based on log type
  const getBadgeVariant = (type: LogLevel) => {
    switch (type) {
      case "info":
        return "secondary"
      case "warning":
        return "warning"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant={isPolling ? "default" : "outline"}
              size="sm"
              onClick={handleTogglePolling}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
              {isPolling ? "Auto-refresh On" : "Auto-refresh Off"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleManualRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {canExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
            {canClear && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2 pb-2">
          {isLoading && logs.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading logs...</span>
            </div>
          ) : logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {log?.time_ago}
                </div>
                <Badge variant={getBadgeVariant(log.type)} className="whitespace-nowrap">
                  {log.type.toUpperCase()}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm break-words">{log.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">No logs to display</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/40 px-6 py-3">
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              isPolling ? "bg-green-500" : "bg-amber-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isPolling ? "Auto-refresh enabled" : "Auto-refresh disabled"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Not updated yet"}
        </span>
      </CardFooter>
    </Card>
  )
}
