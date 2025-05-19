"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, PauseCircle, PlayCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

type LogLevel = "info" | "warning" | "error"

interface LogEntry {
  message: string
  timestamp: string
  type: LogLevel
  botId?: string
  botName?: string
  time_ago?: string
}

interface StreamingLogViewerProps {
  title: string
  description?: string
  botId: string
  maxEntries?: number
  canExport?: boolean
  typeFilter?: string
  searchQuery?: string
}

export function StreamingLogViewer({
  title,
  description,
  botId,
  maxEntries = 100,
  canExport = true,
  typeFilter = "all",
  searchQuery = "",
}: StreamingLogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isStreaming, setIsStreaming] = useState(true)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const { toast } = useToast()
  const logsContainerRef = useRef<HTMLDivElement>(null)

  const filteredLogs = logs.filter(log => {
    // Apply type filter
    if (typeFilter !== "all" && log.type !== typeFilter) {
      return false
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.message.toLowerCase().includes(query) ||
        (log.botName && log.botName.toLowerCase().includes(query))
      )
    }
    
    return true
  })

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsContainerRef.current && isStreaming) {
      const container = logsContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }, [filteredLogs, isStreaming])

  // Setup SSE connection
  useEffect(() => {
    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (!botId || !isStreaming) {
      return
    }

    setIsConnecting(true)
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    try {
      // Create new EventSource connection
      const eventSource = new EventSource(
        `${apiUrl}/bots/${botId}/logs/stream?apiKey=${apiKey}`
      )

      eventSource.onopen = () => {
        setIsConnecting(false)
        setError(null)
        setLastUpdated(new Date())
      }

      eventSource.onmessage = (event) => {
        try {
          // Add new log entry to our state
          const newLog = JSON.parse(event.data)
          setLogs(prev => {
            // Keep only the latest maxEntries
            const updatedLogs = [newLog, ...prev].slice(0, maxEntries)
            return updatedLogs
          })
          setLastUpdated(new Date())
        } catch (err) {
          console.error("Error parsing log event:", err, event.data)
        }
      }

      eventSource.onerror = (err) => {
        console.error("EventSource error:", err)
        setError("Connection error. Trying to reconnect...")
        setIsConnecting(true)
        
        // Close and clean up on error
        eventSource.close()
        
        // Don't set isStreaming to false so it will auto-reconnect
      }

      eventSourceRef.current = eventSource

      // Clean up on unmount
      return () => {
        eventSource.close()
      }
    } catch (err) {
      console.error("Error setting up EventSource:", err)
      setError(`Failed to connect: ${err instanceof Error ? err.message : String(err)}`)
      setIsConnecting(false)
    }
  }, [botId, isStreaming, maxEntries])

  const handleToggleStreaming = () => {
    if (isStreaming) {
      // Stop streaming
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
    
    setIsStreaming(!isStreaming)
  }

  const handleExport = () => {
    try {
      // Create a JSON string of the logs
      const logsJson = JSON.stringify(filteredLogs, null, 2)

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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex space-x-2">
            {isConnecting && (
              <Badge variant="outline" className="animate-pulse">
                Connecting...
              </Badge>
            )}
            {!isConnecting && isStreaming && (
              <Badge variant="secondary">Live</Badge>
            )}
            {error && (
              <Badge variant="destructive">{error}</Badge>
            )}
          </div>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      
      <CardContent className="flex-grow p-0">
        <div 
          ref={logsContainerRef}
          className="h-[500px] overflow-y-auto p-4 bg-muted/20 rounded-md"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                {isConnecting 
                  ? "Connecting to log stream..." 
                  : "No logs available. Waiting for new entries..."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => (
                <div 
                  key={`${log.timestamp}-${index}`} 
                  className="border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={getBadgeVariant(log.type)}>
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Unknown time"}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStreaming}
          >
            {isStreaming ? (
              <>
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          
          {canExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
