"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Download, RefreshCw, Trash2, Search, Filter } from "lucide-react"
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
import { type LogEntry } from "@/lib/api-client"
import { getBotLogs, clearBotLogs } from "@/lib/api/bots"

interface BotLogsProps {
  botId: string
  isAdmin: boolean
}

export function BotLogs({ botId, isAdmin }: BotLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchLogs = async () => {
    try {
      const data = await getBotLogs(botId)
      setLogs(data)
      setFilteredLogs(data)
    } catch (error) {
      toast({
        title: "Error fetching logs",
        description: error instanceof Error ? error.message : "Failed to load bot logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [botId, toast])

  useEffect(() => {
    let result = [...logs]

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((log) => log.type === typeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((log) => log.message.toLowerCase().includes(query))
    }

    setFilteredLogs(result)
  }, [logs, typeFilter, searchQuery])

  const handleRefreshLogs = async () => {
    setIsLoading(true)
    await fetchLogs()
  }

  const handleClearLogs = async () => {
    try {
      const response = await clearBotLogs(botId)

      setLogs([])
      setFilteredLogs([])

      toast({
        title: "Logs cleared",
        description: response.message,
      })
    } catch (error) {
      toast({
        title: "Error clearing logs",
        description: error instanceof Error ? error.message : "Failed to clear bot logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportLogs = () => {
    try {
      // Create a JSON string of the logs
      const logsJson = JSON.stringify(logs, null, 2)

      // Create a blob and download link
      const blob = new Blob([logsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bot-${botId}-logs.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Logs exported",
        description: "Bot logs have been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error exporting logs",
        description: error instanceof Error ? error.message : "Failed to export bot logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return <Badge variant="secondary">Info</Badge>
      case "warning":
        return (
          <Badge variant="warning" className="bg-yellow-500">
            Warning
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Bot Logs</CardTitle>
            <CardDescription>Activity logs for this bot</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefreshLogs} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {isAdmin && (
              <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all logs for this bot. This action cannot be undone.
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
                      Clear Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border rounded-md">
                <Skeleton className="h-6 w-24" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
                <div className="min-w-[100px] text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </div>
                <div>{getTypeBadge(log.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No logs found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "The bot hasn't generated any logs yet."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshLogs} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}
