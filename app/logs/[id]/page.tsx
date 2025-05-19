"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Bot, Clock, AlertCircle, Info, AlertTriangle, ExternalLink, ActivitySquare, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PollingLogViewer } from "@/components/logs/polling-log-viewer"
import { StreamingLogViewer } from "@/components/logs/streaming-log-viewer"

export default function LogDetailPage({ params }: { params: { id: string } }) {
  const [log, setLog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [botDetails, setBotDetails] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For single log view, params.id could be a log ID or bot ID
        // If it looks like a bot ID (e.g., contains underscores), treat it as such
        if (params.id.includes('_')) {
          // It's likely a bot ID, fetch bot details
          const bots = await apiClient.getAllBots();
          const bot = bots.bots.find(b => b.id === params.id);
          if (bot) {
            setBotDetails(bot);
            // We don't need individual log details in this case
            setLog(null);
          } else {
            toast({
              title: "Bot not found",
              description: `Could not find bot with ID ${params.id}`,
              variant: "destructive",
            });
          }
        } else {
          // It's a log ID, get the specific log
          const data = await apiClient.getLogById(params.id);
          setLog(data);
          
          // If the log has a botId, fetch that bot's details too
          if (data.botId) {
            const bots = await apiClient.getAllBots();
            const bot = bots.bots.find(b => b.id === data.botId);
            if (bot) {
              setBotDetails(bot);
            }
          }
        }
      } catch (error) {
        toast({
          title: "Error fetching details",
          description: error instanceof Error ? error.message : "Failed to load details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "info":
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/logs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Bot Logs</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64" />
          </div>
        ) : botDetails ? (
          // If we have bot details, show real-time logs
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">{botDetails.config?.EMAIL || botDetails.id}</h2>
                <Badge variant={botDetails.status === "running" ? "success" : "secondary"}>
                  {botDetails.status}
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Bot Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Start Time</p>
                      <p className="text-muted-foreground">
                        {botDetails.start_time ? format(new Date(botDetails.start_time), "MMM d, yyyy 'at' h:mm a") : "Not started"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ActivitySquare className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground capitalize">{botDetails.status}</p>
                    </div>
                  </div>

                  {botDetails.config?.COUNTRY && (
                    <div className="flex items-center">
                      <ExternalLink className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Country</p>
                        <p className="text-muted-foreground">{botDetails.config.COUNTRY.toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="live" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="live" className="flex items-center gap-1">
                    <ActivitySquare className="h-4 w-4" />
                    Live Stream
                  </TabsTrigger>
                  <TabsTrigger value="polling" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Polling
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="live" className="mt-0">
                <StreamingLogViewer 
                  title="Live Log Stream" 
                  description="Real-time log updates from the bot"
                  botId={botDetails.id}
                />
              </TabsContent>
              
              <TabsContent value="polling" className="mt-0">
                <PollingLogViewer
                  title="Bot Logs"
                  description="Log entries are refreshed periodically"
                  botId={botDetails.id}
                  maxEntries={100}
                  pollInterval={10000}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : log ? (
          // If we have a specific log entry
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Log Entry #{log.id}</h2>
                {getLevelBadge(log.level)}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Log Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Timestamp</p>
                      <p className="text-muted-foreground">
                        {format(new Date(log.timestamp), "MMMM d, yyyy 'at' h:mm:ss a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Bot className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Bot</p>
                      <p className="text-muted-foreground">{log.botName || "System"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {getLevelIcon(log.level)}
                    <div className="ml-3">
                      <p className="font-medium">Level</p>
                      <p className="text-muted-foreground capitalize">{log.level}</p>
                    </div>
                  </div>

                  {log.source && (
                    <div className="flex items-center">
                      <ExternalLink className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Source</p>
                        <p className="text-muted-foreground">{log.source}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 whitespace-pre-wrap font-mono text-sm">{log.message}</div>
                </CardContent>
              </Card>
            </div>

            {log.context && (
              <Card>
                <CardHeader>
                  <CardTitle>Context Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-md bg-muted p-4 overflow-auto max-h-96 text-sm">
                    {JSON.stringify(log.context, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {log.stackTrace && (
              <Card>
                <CardHeader>
                  <CardTitle>Stack Trace</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-md bg-muted p-4 overflow-auto max-h-96 text-sm font-mono text-destructive">
                    {log.stackTrace}
                  </pre>
                </CardContent>
              </Card>
            )}

            {log.botId && (
              <Button 
                variant="outline" 
                onClick={() => router.push(`/logs/${log.botId}`)}
                className="mt-4"
              >
                <Bot className="mr-2 h-4 w-4" />
                View All Logs for This Bot
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Resource not found</h2>
            <p className="text-muted-foreground mt-2">
              The log entry or bot you are looking for does not exist or has been deleted
            </p>
            <Button className="mt-4" onClick={() => router.push("/logs")}>
              Back to Logs
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
