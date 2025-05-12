"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, RefreshCw } from "lucide-react"
import { BotCard } from "@/components/bots/bot-card"
import { apiClient, type BotResponse } from "@/lib/api-client"
import { hasPermission } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function BotsPage() {
  const [bots, setBots] = useState<BotResponse[]>([])
  const [filteredBots, setFilteredBots] = useState<BotResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  const fetchBots = async () => {
    try {
      const data = await apiClient.getAllBots()
      setBots(data.bots)
      setFilteredBots(data.bots)
    } catch (error) {
      toast({
        title: "Error fetching bots",
        description: "Failed to load bots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBots()
  }, [toast])

  useEffect(() => {
    let result = [...bots]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((bot) => bot.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (bot) =>
          bot.config.EMAIL.toLowerCase().includes(query) ||
          apiClient.getCountryName(bot.config.COUNTRY).toLowerCase().includes(query) ||
          (bot.config.FACILITY_ID && apiClient.getFacilityName(bot.config.FACILITY_ID).toLowerCase().includes(query)),
      )
    }

    setFilteredBots(result)
  }, [bots, statusFilter, searchQuery])

  const handleCreateBot = () => {
    // Use direct navigation to ensure it works
    window.location.href = "/bots/create"
    // Alternatively, we could use router.push with a callback to confirm navigation
    // router.push("/bots/create").catch(error => {
    //   console.error("Navigation failed:", error);
    //   window.location.href = "/bots/create";
    // });
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchBots()
  }

  const handleBotAction = async (botId: string, action: string) => {
    try {
      let response

      switch (action) {
        case "start":
          response = await apiClient.startBot(botId)
          break
        case "stop":
          response = await apiClient.stopBot(botId)
          break
        case "restart":
          response = await apiClient.restartBot(botId)
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }

      toast({
        title: `Bot ${action}ed`,
        description: response.message,
      })

      // Update local state to reflect the action
      setBots((prevBots) =>
        prevBots.map((bot) => {
          if (bot.id === botId) {
            let newStatus = bot.status

            switch (action) {
              case "start":
                newStatus = "running"
                break
              case "stop":
                newStatus = "stopped"
                break
              case "restart":
                newStatus = "running"
                break
            }

            return { ...bot, status: newStatus }
          }
          return bot
        }),
      )
    } catch (error) {
      toast({
        title: `Failed to ${action} bot`,
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      const response = await apiClient.deleteBot(botId)

      toast({
        title: "Bot deleted",
        description: response.message,
      })

      // Update local state
      setBots((prevBots) => prevBots.filter((bot) => bot.id !== botId))
    } catch (error) {
      toast({
        title: "Failed to delete bot",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bots</h1>
            <p className="text-muted-foreground">Manage your visa appointment bots</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {isAdmin && (
              <Button onClick={handleCreateBot} data-testid="create-bot-button">
                <Plus className="mr-2 h-4 w-4" />
                Create Bot
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bots..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBots.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                countryName={apiClient.getCountryName(bot.config.COUNTRY)}
                facilityName={
                  bot.config.FACILITY_ID ? apiClient.getFacilityName(bot.config.FACILITY_ID) : "Not specified"
                }
                isAdmin={isAdmin}
                onAction={(action) => handleBotAction(bot.id, action)}
                onDelete={() => handleDeleteBot(bot.id)}
                onViewDetails={() => router.push(`/bots/${bot.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No bots found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get started by creating your first bot."}
              </p>
              {isAdmin && (
                <Button onClick={handleCreateBot}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bot
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
