"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { AppointmentSummaryCards } from "@/components/statistics/appointment-summary-cards"
import { AppointmentTrendChart } from "@/components/statistics/appointment-trend-chart"
import { AppointmentDistributionChart } from "@/components/statistics/appointment-distribution-chart"
import { AppointmentStatusChart } from "@/components/statistics/appointment-status-chart"
import { BotPerformanceChart } from "@/components/statistics/bot-performance-chart"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function AppointmentStatisticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("30days")
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ])
  const [countryFilter, setCountryFilter] = useState("all")
  const [statistics, setStatistics] = useState<any>(null)
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([])
  const { toast } = useToast()
  const router = useRouter()

  // Fetch countries once on component mount
  useEffect(() => {
    try {
      const countriesData = apiClient.getCountries()
      setCountries(countriesData)
    } catch (error) {
      console.error("Failed to fetch countries:", error)
      toast({
        title: "Error fetching countries",
        description: "Failed to load country data. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchStatistics = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const start = dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined
      const end = dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined

      const data = await apiClient.getAppointmentStatistics({
        country: countryFilter !== "all" ? countryFilter : undefined,
        startDate: start,
        endDate: end,
      })

      setStatistics(data)
    } catch (error) {
      console.error("Error fetching statistics:", error)
      toast({
        title: "Error fetching statistics",
        description: "Failed to load appointment statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [countryFilter, dateRange, toast])

  // Initial data fetch
  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  // Update date range when time range changes
  useEffect(() => {
    if (timeRange === "custom") {
      return // Don't change the date range for custom
    }

    const now = new Date()
    let start: Date | undefined

    switch (timeRange) {
      case "7days":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30days":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90days":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "year":
        start = new Date(now.getFullYear(), 0, 1) // January 1st of current year
        break
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    setDateRange([start, now])
  }, [timeRange])

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
      link.setAttribute("download", `appointment-statistics-${format(new Date(), "yyyy-MM-dd")}.json`)
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
            <h1 className="text-3xl font-bold tracking-tight">Appointment Statistics</h1>
            <p className="text-muted-foreground">Analyze appointment trends and bot performance</p>
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
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {timeRange === "custom" && <DateRangePicker value={dateRange} onChange={setDateRange} />}

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AppointmentSummaryCards statistics={statistics} isLoading={isLoading} />

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="performance">Bot Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>Number of appointments found over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AppointmentTrendChart data={statistics?.trends} isLoading={isLoading} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Status</CardTitle>
                  <CardDescription>Distribution of appointment statuses</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AppointmentStatusChart data={statistics?.statusDistribution} isLoading={isLoading} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wait Time Analysis</CardTitle>
                  <CardDescription>Average days between booking and appointment date</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AppointmentTrendChart
                    data={statistics?.waitTimeTrend}
                    isLoading={isLoading}
                    yAxisLabel="Days"
                    lineColor="#8884d8"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments by Country</CardTitle>
                  <CardDescription>Distribution of appointments across countries</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <AppointmentDistributionChart
                    data={statistics?.countryDistribution}
                    isLoading={isLoading}
                    dataKey="country"
                    nameKey="countryName"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointments by Facility</CardTitle>
                  <CardDescription>Top facilities by number of appointments</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <AppointmentDistributionChart
                    data={statistics?.facilityDistribution}
                    isLoading={isLoading}
                    dataKey="facility"
                    nameKey="facilityName"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Time Distribution</CardTitle>
                <CardDescription>Distribution of appointments by time of day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AppointmentDistributionChart
                  data={statistics?.timeDistribution}
                  isLoading={isLoading}
                  dataKey="hour"
                  nameKey="hourLabel"
                  type="bar"
                />
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </MainLayout>
  )
}
