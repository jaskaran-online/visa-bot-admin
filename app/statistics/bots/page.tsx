"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotPerformanceChart } from "@/components/statistics/bot-performance-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BotStatisticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("30days")
  const [statistics, setStatistics] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  const fetchStatistics = useCallback(async () => {
    try {
      setIsRefreshing(true)

      // Calculate date range based on timeRange
      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case "7days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "90days":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }

      const data = await apiClient.getBotStatistics({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(now, "yyyy-MM-dd"),
      })

      setStatistics(data)
    } catch (error) {
      console.error("Error fetching bot statistics:", error)
      toast({
        title: "Error fetching statistics",
        description: "Failed to load bot statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [timeRange, toast])

  // Initial data fetch
  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  const handleRefresh = () => {
    fetchStatistics()
  }

  const handleExport = () => {
    try {
      if (!statistics) {
        toast({
          title: "No data to export",
          description: "Please fetch statistics data first.",
          variant: "destructive",
        })
        return
      }

      // Create a JSON string of the statistics
      const statsJson = JSON.stringify(statistics, null, 2)

      // Create a blob and download link
      const blob = new Blob([statsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `bot-statistics-${format(new Date(), "yyyy-MM-dd")}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up

      toast({
        title: "Export successful",
        description: "Statistics have been exported to JSON",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "Failed to export statistics. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.push("/statistics")}
              >
                <ArrowLeft className="h-4 w-4" /> Back to Statistics
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Bot Statistics</h1>
            <p className="text-muted-foreground">Analyze bot performance and efficiency</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={isLoading || !statistics}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Performance Comparison</CardTitle>
                <CardDescription>Number of appointments found by each bot</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BotPerformanceChart data={statistics?.botPerformance} isLoading={isLoading} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Success Rate by Bot</CardTitle>
                  <CardDescription>Percentage of successful appointment searches</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BotPerformanceChart
                    data={statistics?.botSuccessRate}
                    isLoading={isLoading}
                    dataKey="successRate"
                    valueFormat="%"
                    barColor="#82ca9d"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Response Time</CardTitle>
                  <CardDescription>Average time to find an appointment (in minutes)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BotPerformanceChart
                    data={statistics?.botResponseTime}
                    isLoading={isLoading}
                    dataKey="responseTime"
                    valueFormat=" min"
                    barColor="#8884d8"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>CPU and memory usage by bot</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BotPerformanceChart
                    data={statistics?.resourceUtilization}
                    isLoading={isLoading}
                    dataKey="cpuUsage"
                    valueFormat="%"
                    barColor="#82ca9d"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Usage</CardTitle>
                  <CardDescription>Network requests per minute by bot</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BotPerformanceChart
                    data={statistics?.networkUsage}
                    isLoading={isLoading}
                    dataKey="requestsPerMinute"
                    barColor="#8884d8"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Rate by Bot</CardTitle>
                <CardDescription>Percentage of operations resulting in errors</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BotPerformanceChart
                  data={statistics?.errorRate}
                  isLoading={isLoading}
                  dataKey="errorPercentage"
                  valueFormat="%"
                  barColor="#ff8042"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Error Types</CardTitle>
                <CardDescription>Distribution of error types across all bots</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BotPerformanceChart
                  data={statistics?.errorTypes}
                  isLoading={isLoading}
                  dataKey="count"
                  nameKey="errorType"
                  barColor="#ff8042"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
