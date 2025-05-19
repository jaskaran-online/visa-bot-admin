"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { getAllBots } from "@/lib/api/bots"
import { getAllLogs } from "@/lib/api/logs"
import { hasPermission } from "@/lib/auth"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Download, RefreshCw, Trash2, Filter, Clock, Search, ActivitySquare } from "lucide-react"
import { PollingLogViewer } from "@/components/logs/polling-log-viewer"
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import router from "next/router"

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bots, setBots] = useState<any[]>([])
  const [selectedBotId, setSelectedBotId] = useState<string>("all")
  const [logLevel, setLogLevel] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<number>(30) // in seconds
  
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")
  
  // Helper function to safely get facility name
  const getFacilityName = (facilityId: string): string => {
    if (!facilityId) return "";
    const facilities = FACILITIES[0].facilities;
    return facilities[facilityId as keyof typeof facilities] || facilityId;
  };

  const FACILITIES = [
    {
      facilities: {
        "89": "Calgary",
        "90": "Halifax",
        "91": "Montreal (Closed)",
        "92": "Ottawa",
        "93": "Quebec City",
        "94": "Toronto",
        "95": "Vancouver",
      },
      asc_facilities: {
        "89": "Calgary ASC",
        "90": "Halifax ASC",
        "91": "Montreal ASC",
        "92": "Ottawa ASC",
        "93": "Quebec City ASC",
        "94": "Toronto ASC",
        "95": "Vancouver ASC",
      },
    },
  ];

  // Function to fetch logs with filters
  const fetchLogs = async () => {
    try {
      setIsRefreshing(true)
      const fetchedLogs = await getAllLogs(100, {
        botId: selectedBotId,
        level: logLevel,
        searchQuery: searchQuery
      })
      setLogs(fetchedLogs)
    } catch (error) {
      toast({
        title: "Error fetching logs",
        description: "Failed to load logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Fetch bots
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getAllBots()
        setBots(data.bots || [])
      } catch (error) {
        console.error("Failed to fetch bots:", error)
        toast({
          title: "Error fetching bots",
          description: "Failed to load bot list. Please try again.",
          variant: "destructive",
        })
        setBots([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBots()
  }, [toast])

  const handleClearLogs = async () => {
    try {
      if (selectedBotId === "all") {
        toast({
          title: "Action required",
          description: "Please select a specific bot to clear logs.",
          variant: "default",
        })
        return
      }
      
      // Use the Bot API to clear logs
      const response = await apiClient.clearBotLogs(selectedBotId)

      toast({
        title: "Logs cleared",
        description: "Bot logs have been cleared successfully",
      })
    } catch (error) {
      toast({
        title: "Error clearing logs",
        description: error instanceof Error ? error.message : "Failed to clear logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bot Logs</h1>
            <p className="text-muted-foreground">
              Monitor and analyze bot activity logs
            </p>
          </div>
          <div className="flex gap-2">
            {selectedBotId !== "all" && selectedBotId !== "general" && (
              <Button 
                variant="default"
                onClick={() => router.push(`/logs/${selectedBotId}`)}
              >
                <ActivitySquare className="mr-2 h-4 w-4" />
                View Live Logs
              </Button>
            )}
            
            {isAdmin && (
              <AlertDialog
                open={isClearDialogOpen}
                onOpenChange={setIsClearDialogOpen}
              >
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
                      This will permanently delete all logs for the selected bot.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleClearLogs();
                        setIsClearDialogOpen(false);
                      }}
                    >
                      Clear Bot Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log Filters</CardTitle>
            <CardDescription>
              Select which bot logs to view and other filter options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bot Selection */}
              <div className="space-y-2">
                <Label htmlFor="bot-select">Select Bot</Label>
                <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                  <SelectTrigger id="bot-select">
                    <SelectValue placeholder="Select a bot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bots</SelectItem>
                    <SelectItem value="general">System (General)</SelectItem>
                    {bots.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.config.EMAIL} -{" "}
                        {getFacilityName(bot.config.FACILITY_ID)} - (
                        {bot.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Log Level Filter */}
              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <Label htmlFor="log-search">Search Logs</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="log-search"
                    type="search"
                    placeholder="Search log content..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-2 flex-grow max-w-md">
                <div className="flex items-center justify-between">
                  <Label>Refresh Interval: {refreshInterval} seconds</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Customize
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">Custom Refresh Interval</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>5s</span>
                            <span>30s</span>
                            <span>60s</span>
                          </div>
                          <Slider
                            min={5}
                            max={60}
                            step={5}
                            value={[refreshInterval]}
                            onValueChange={(value) =>
                              setRefreshInterval(value[0])
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRefreshInterval(5)}
                            >
                              5s
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRefreshInterval(15)}
                            >
                              15s
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRefreshInterval(30)}
                            >
                              30s
                            </Button>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setRefreshInterval(60)}
                          >
                            1min
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Slider
                  min={5}
                  max={60}
                  step={5}
                  value={[refreshInterval]}
                  onValueChange={(value) => setRefreshInterval(value[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-[600px]">
          <PollingLogViewer
            title={
              selectedBotId === "all"
                ? "All Bots Logs"
                : selectedBotId === "general"
                ? "System Logs"
                : "Bot Logs"
            }
            description={
              selectedBotId === "all"
                ? "Logs from all bots in the system"
                : selectedBotId === "general"
                ? "General system logs"
                : `Logs for ${
                    bots.find((b) => b.id === selectedBotId)?.config?.EMAIL ||
                    selectedBotId
                  }${
                    bots.find((b) => b.id === selectedBotId)?.config?.FACILITY_ID
                      ? ` - ${getFacilityName(bots.find((b) => b.id === selectedBotId)?.config?.FACILITY_ID)}` 
                      : ""
                  }`
            }
            botId={selectedBotId}
            maxEntries={100}
            pollInterval={refreshInterval * 1000}
            canClear={isAdmin}
            canExport={true}
            typeFilter={logLevel}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </MainLayout>
  );
}
