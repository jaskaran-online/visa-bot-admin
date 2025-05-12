"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

type LogLevel = "info" | "warning" | "error"

interface LogEntry {
  message: string
  timestamp: string
  type: LogLevel
}

interface RealTimeLogViewerProps {
  title: string
  description?: string
  streamUrl: string
  maxEntries?: number
  autoScroll?: boolean
  canClear?: boolean
  canExport?: boolean
  onClear?: () => Promise<void>
}

export function RealTimeLogViewer({
  title,
  description,
  streamUrl,
  maxEntries = 100,
  autoScroll = true,
  canClear = false,
  canExport = true,
  onClear,
}: RealTimeLogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const { toast } = useToast()

  // Connect to SSE stream
  useEffect(() => {
    const connectToStream = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      setIsReconnecting(true)

      // Add API key from env or local storage
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || localStorage.getItem("api_key") || ""
      const fullUrl = `${streamUrl}${streamUrl.includes("?") ? "&" : "?"}x-api-key=${apiKey}`
      
      const eventSource = new EventSource(fullUrl)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setIsReconnecting(false)
      }

      eventSource.onmessage = (event) => {
        try {
          const logEntry = JSON.parse(event.data)
          
          setLogs((prevLogs) => {
            const newLogs = [...prevLogs, logEntry]
            // Keep only the specified number of entries
            return newLogs.slice(-maxEntries)
          })
        } catch (error) {
          console.error("Failed to parse log entry:", error)
        }
      }

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error)
        setIsConnected(false)
        
        // Close and reconnect after a delay
        eventSource.close()
        setTimeout(connectToStream, 5000)
      }
    }

    connectToStream()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [streamUrl, maxEntries])

  // Scroll to bottom when logs change
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, autoScroll])

  const handleClear = async () => {
    if (onClear) {
      try {
        await onClear()
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
      a.download = `logs-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.json`
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

  const handleReconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    setIsReconnecting(true)
    
    // Reconnect will happen in the useEffect
    setIsConnected(false)
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
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReconnect} disabled={isReconnecting}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isReconnecting ? "animate-spin" : ""}`} />
              {isReconnecting ? "Connecting..." : "Reconnect"}
            </Button>
            {canExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
            {canClear && onClear && (
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
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
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
          <div ref={logsEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/40 px-6 py-3">
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {logs.length} {logs.length === 1 ? "entry" : "entries"}
        </span>
      </CardFooter>
    </Card>
  )
}
