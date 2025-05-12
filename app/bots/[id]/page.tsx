"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BotLogs } from "@/components/bots/bot-logs"
import { BotConfiguration } from "@/components/bots/bot-configuration"
import { hasPermission } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type BotResponse, type BotStatus } from "@/lib/api-client"
import { getBot, startBot, stopBot, restartBot, deleteBot } from "@/lib/api/bots"
import { ArrowLeft, Play, Square, RefreshCw, Trash2, AlertCircle, Clock, CheckCircle } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"

export default function BotDetailPage({ params }: { params: { id: string } }) {
  const [bot, setBot] = useState<BotResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  const fetchBot = async () => {
    try {
      const data = await getBot(params.id)
      setBot(data)
    } catch (error) {
      toast({
        title: "Error fetching bot details",
        description: error instanceof Error ? error.message : "Failed to load bot details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBot()
  }, [params.id, toast])

  const handleBotAction = async (action: string) => {
    if (!bot) return

    try {
      let response

      switch (action) {
        case "start":
          response = await startBot(bot.id)
          break
        case "stop":
          response = await stopBot(bot.id)
          break
        case "restart":
          response = await restartBot(bot.id)
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }

      toast({
        title: `Bot ${action}ed`,
        description: response.message,
      })

      // Refresh bot data to get the updated status
      fetchBot()
    } catch (error) {
      toast({
        title: `Failed to ${action} bot`,
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBot = async () => {
    if (!bot) return

    try {
      const response = await deleteBot(bot.id)

      toast({
        title: "Bot deleted",
        description: response.message,
      })

      router.push("/bots")
    } catch (error) {
      toast({
        title: "Failed to delete bot",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: BotStatus) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      case "stopped":
        return <Clock className="h-5 w-5 text-gray-400 mr-2" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive mr-2" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
      default:
        return null
    }
  }

  const getBadgeVariant = (status: BotStatus) => {
    switch (status) {
      case "running":
        return "success"
      case "stopped":
        return "secondary"
      case "error":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/bots")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Bot Details</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : bot ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{bot.config.EMAIL}</h2>
                <Badge variant={getBadgeVariant(bot.status) as any} className="ml-2 flex items-center">
                  {getStatusIcon(bot.status)}
                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                </Badge>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  {bot.status === "stopped" && (
                    <Button onClick={() => handleBotAction("start")}>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}

                  {bot.status === "running" && (
                    <Button onClick={() => handleBotAction("stop")}>
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => handleBotAction("restart")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart
                  </Button>

                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the bot for {bot.config.EMAIL} and all of its data. This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteBot}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{bot.status}</div>
                  <p className="text-xs text-muted-foreground">
                    {bot.status === "running"
                      ? "Bot is actively searching for appointments"
                      : bot.status === "stopped"
                        ? "Bot is currently inactive"
                        : bot.status === "error"
                          ? "Bot encountered an error"
                          : "Bot has completed its task"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Country</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{apiClient.getCountryName(bot.config.COUNTRY)}</div>
                  <p className="text-xs text-muted-foreground">
                    {bot.config.FACILITY_ID
                      ? apiClient.getFacilityName(bot.config.FACILITY_ID)
                      : "No facility specified"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bot.config.MIN_DATE ? bot.config.MIN_DATE : "Any"} -{" "}
                    {bot.config.MAX_DATE ? bot.config.MAX_DATE : "Any"}
                  </div>
                  <p className="text-xs text-muted-foreground">Acceptable appointment date range</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Start Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date(bot.start_time).toLocaleDateString()}</div>
                  <p className="text-xs text-muted-foreground">{new Date(bot.start_time).toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="logs" className="mt-4">
              <TabsList>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="logs" className="mt-4">
                <BotLogs botId={params.id} isAdmin={isAdmin} />
              </TabsContent>

              <TabsContent value="configuration" className="mt-4">
                <BotConfiguration bot={bot} isAdmin={isAdmin} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Bot not found</h2>
            <p className="text-muted-foreground mt-2">The bot you are looking for does not exist or has been deleted</p>
            <Button className="mt-4" onClick={() => router.push("/bots")}>
              Back to Bots
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
