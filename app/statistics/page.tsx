"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, CalendarDays, Clock, Globe, LineChart, PieChart, Users, Bot, ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [summaryData, setSummaryData] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch summary statistics for the dashboard
        const data = await apiClient.getStatisticsSummary()
        setSummaryData(data)
      } catch (error) {
        console.error("Failed to fetch statistics summary:", error)
        toast({
          title: "Error loading statistics",
          description: "Failed to load statistics summary. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaryData()
  }, [toast])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    path,
    trend = null,
    trendDirection = null,
  }: {
    title: string
    value: string | number
    description: string
    icon: any
    path: string
    trend?: number | null
    trendDirection?: "up" | "down" | null
  }) => (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? "..." : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== null && (
          <div
            className={`mt-2 flex items-center text-xs ${
              trendDirection === "up"
                ? "text-green-500"
                : trendDirection === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→"} {trend}% from last period
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2">
        <Button variant="ghost" className="w-full justify-between" onClick={() => navigateTo(path)}>
          View Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics Dashboard</h1>
          <p className="text-muted-foreground">Overview of system performance and metrics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Appointments"
                value={isLoading ? "..." : summaryData?.appointments?.total || 0}
                description="Total appointments found"
                icon={CalendarDays}
                path="/statistics/appointments"
                trend={summaryData?.appointments?.trend}
                trendDirection={summaryData?.appointments?.trendDirection}
              />

              <StatCard
                title="Active Bots"
                value={isLoading ? "..." : summaryData?.bots?.active || 0}
                description="Currently running bots"
                icon={Bot}
                path="/statistics/bots"
                trend={summaryData?.bots?.trend}
                trendDirection={summaryData?.bots?.trendDirection}
              />

              <StatCard
                title="Users"
                value={isLoading ? "..." : summaryData?.users?.total || 0}
                description="Registered system users"
                icon={Users}
                path="/users"
                trend={summaryData?.users?.trend}
                trendDirection={summaryData?.users?.trendDirection}
              />

              <StatCard
                title="Average Wait Time"
                value={isLoading ? "..." : `${summaryData?.waitTime?.average || 0} days`}
                description="Average appointment wait time"
                icon={Clock}
                path="/statistics/appointments"
                trend={summaryData?.waitTime?.trend}
                trendDirection={summaryData?.waitTime?.trendDirection}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Appointment Trends</CardTitle>
                  <CardDescription>Appointments found over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-muted-foreground">Loading chart data...</div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LineChart className="h-32 w-32 text-muted-foreground opacity-50" />
                      <div className="ml-4 text-muted-foreground">
                        View detailed charts in the Appointments Statistics section
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigateTo("/statistics/appointments")}>View Detailed Trends</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Countries with most appointments</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-muted-foreground">Loading chart data...</div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Globe className="h-24 w-24 text-muted-foreground opacity-50" />
                      <div className="mt-4 text-muted-foreground text-center">
                        View country distribution in Appointments Statistics
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigateTo("/statistics/appointments")}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Appointment Statistics</CardTitle>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Analyze appointment trends and distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Appointment trends over time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Distribution by country and facility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Wait time analysis</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo("/statistics/appointments")}>
                    View Appointment Statistics
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bot Statistics</CardTitle>
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Analyze bot performance and efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Bot performance comparison</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Success rate trends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Response time analysis</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo("/statistics/bots")}>
                    View Bot Statistics
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>System Statistics</CardTitle>
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Analyze system performance and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">User activity and engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Geographic distribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">System resource utilization</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigateTo("/statistics/system")}>
                    View System Statistics
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
