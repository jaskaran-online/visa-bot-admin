"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, RefreshCw } from "lucide-react"
import { BotCard } from "@/components/bots/bot-card"
import { BotTable } from "@/components/bots/bot-table"
import { BotFilters } from "@/components/bots/bot-filters"
import { apiClient, type BotResponse } from "@/lib/api-client"
import { getAllBots, startBot, stopBot, restartBot, deleteBot } from "@/lib/api/bots"
import { hasPermission } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function BotsPage() {
  const [bots, setBots] = useState<BotResponse[]>([])
  const [filteredBots, setFilteredBots] = useState<BotResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewType, setViewType] = useState<"card" | "table">("card")
  const [groupByEmail, setGroupByEmail] = useState(false)
  const [sortField, setSortField] = useState("start_time")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")

  const fetchBots = async () => {
    try {
      setIsRefreshing(true)
      const data = await getAllBots()
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

  // For client-side filtering of already fetched bots
  useEffect(() => {
    let result = [...bots]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((bot) => bot.status === statusFilter)
    }

    // Apply country filter
    if (countryFilter !== "all") {
      result = result.filter((bot) => bot.config.COUNTRY === countryFilter)
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
  }, [bots, statusFilter, countryFilter, searchQuery])

  const handleCreateBot = () => {
    window.location.href = "/bots/create"
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchBots()
  }

  const handleBotAction = async (botId: string, action: string) => {
    try {
      let response;

      switch (action) {
        case "start":
          response = await startBot(botId)
          break
        case "stop":
          response = await stopBot(botId)
          break
        case "restart":
          response = await restartBot(botId)
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }

      toast({
        title: `Bot ${action}ed`,
        description: response.message,
      })

      // After successful action, refresh the bot list
      fetchBots()
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
      const response = await deleteBot(botId)

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

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  }

  const handleCountryFilterChange = (country: string) => {
    setCountryFilter(country);
  }

  const handleViewChange = (view: "card" | "table") => {
    setViewType(view);
  }

  const handleGroupByEmailChange = (groupBy: boolean) => {
    setGroupByEmail(groupBy);
  }

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
  }

  // Sort bots client-side according to current sort settings
  const sortedBots = useMemo(() => {
    return [...filteredBots].sort((a, b) => {
      let aValue, bValue;
      
      // Extract the values to compare based on sortField
      switch (sortField) {
        case 'start_time':
          aValue = new Date(a.start_time).getTime();
          bValue = new Date(b.start_time).getTime();
          break;
        case 'config.EMAIL':
          aValue = a.config.EMAIL.toLowerCase();
          bValue = b.config.EMAIL.toLowerCase();
          break;
        case 'config.COUNTRY':
          aValue = apiClient.getCountryName(a.config.COUNTRY).toLowerCase();
          bValue = apiClient.getCountryName(b.config.COUNTRY).toLowerCase();
          break;
        case 'config.FACILITY_ID':
          // Handle null or undefined facility IDs
          aValue = a.config.FACILITY_ID ? apiClient.getFacilityName(a.config.FACILITY_ID).toLowerCase() : 'zzz';
          bValue = b.config.FACILITY_ID ? apiClient.getFacilityName(b.config.FACILITY_ID).toLowerCase() : 'zzz';
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = new Date(a.start_time).getTime();
          bValue = new Date(b.start_time).getTime();
      }
      
      // Apply sort direction
      return sortDirection === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
  }, [filteredBots, sortField, sortDirection]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bots</h1>
            <p className="text-muted-foreground">Manage your visa appointment bots</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            {isAdmin && (
              <Button onClick={handleCreateBot} data-testid="create-bot-button">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Bot</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bots..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <BotFilters
            onStatusFilterChange={handleStatusFilterChange}
            onCountryFilterChange={handleCountryFilterChange}
            onViewChange={handleViewChange}
            onSortChange={handleSortChange}
            onGroupByEmailChange={handleGroupByEmailChange}
            viewType={viewType}
            groupByEmail={groupByEmail}
            statusFilter={statusFilter}
            countryFilter={countryFilter}
            sortField={sortField}
            sortDirection={sortDirection}
          />

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
          ) : sortedBots.length > 0 ? (
            <>
              {viewType === "card" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sortedBots.map((bot) => (
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
                <BotTable
                  bots={sortedBots}
                  countryNameMap={(code) => apiClient.getCountryName(code)}
                  facilityNameMap={(id) => id ? apiClient.getFacilityName(id) : "Not specified"}
                  groupByEmail={groupByEmail}
                  sortBy={sortField}
                  sortDirection={sortDirection}
                  isAdmin={isAdmin}
                  onViewDetails={(id) => router.push(`/bots/${id}`)}
                  onAction={handleBotAction}
                  onDelete={handleDeleteBot}
                  onSortChange={(field) => {
                    // Toggle sort direction if same field is clicked
                    if (field === sortField) {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField(field);
                      setSortDirection("desc"); // Default to desc for new fields
                    }
                  }}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No bots found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || countryFilter !== "all"
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
      </div>
    </MainLayout>
  )
}
