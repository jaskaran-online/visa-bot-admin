"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Calendar, CheckCircle, Clock, Server, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  getDashboardSummary, 
  getRecentAppointments, 
  getSystemHealth,
  getBotStatusCounts
} from "@/lib/api/dashboard"
import { type SuccessfulAppointment, type StatisticsSummary } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<StatisticsSummary | null>(null)
  const [recentAppointments, setRecentAppointments] = useState<SuccessfulAppointment[]>([])
  const [systemHealth, setSystemHealth] = useState<any | null>(null)
  const [botCounts, setBotCounts] = useState<any | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    if (!isClient) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [summaryData, appointmentsData, healthData, botsData] = await Promise.all([
          getDashboardSummary(),
          getRecentAppointments(3),
          getSystemHealth(),
          getBotStatusCounts()
        ]);

        setSummary(summaryData);
        setRecentAppointments(appointmentsData);
        setSystemHealth(healthData);
        setBotCounts(botsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isClient, toast]);

  if (!isClient) {
    return null; // Prevent hydration errors
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the USA VISA Appointment Bot System dashboard.</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{botCounts?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {botCounts?.running || 0} active, {botCounts?.stopped || 0} inactive
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Appointments Found</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.appointments?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary?.appointments?.trend ? (
                      summary.appointments.trendDirection === "up" ? (
                        `+${summary.appointments.trend} from last period`
                      ) : (
                        `${summary.appointments.trend} from last period`
                      )
                    ) : (
                      "No trend data available"
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {botCounts && botCounts.total > 0 
                      ? Math.round((botCounts.running / botCounts.total) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Bot success rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemHealth?.service?.status || "Unknown"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemHealth?.service?.uptime 
                      ? `Uptime: ${systemHealth.service.uptime}` 
                      : "Status unknown"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Bot Activity</CardTitle>
                  <CardDescription>Bot activity overview</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Active Bots</div>
                          <div>{botCounts?.running || 0} of {botCounts?.total || 0}</div>
                        </div>
                        <Progress value={botCounts?.total ? (botCounts.running / botCounts.total) * 100 : 0} className="bg-green-100" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Stopped Bots</div>
                          <div>{botCounts?.stopped || 0} of {botCounts?.total || 0}</div>
                        </div>
                        <Progress value={botCounts?.total ? (botCounts.stopped / botCounts.total) * 100 : 0} className="bg-yellow-100" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Error Bots</div>
                          <div>{botCounts?.error || 0} of {botCounts?.total || 0}</div>
                        </div>
                        <Progress value={botCounts?.total ? (botCounts.error / botCounts.total) * 100 : 0} className="bg-red-100" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Completed Bots</div>
                          <div>{botCounts?.completed || 0} of {botCounts?.total || 0}</div>
                        </div>
                        <Progress value={botCounts?.total ? (botCounts.completed / botCounts.total) * 100 : 0} className="bg-blue-100" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest appointments found by bots</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center">
                          <Skeleton className="h-8 w-8 rounded-full mr-2" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </div>
                      ))}
                      <Skeleton className="h-9 w-full mt-2" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentAppointments.length > 0 ? (
                        recentAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center">
                            <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{appointment.facility_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(appointment.appointment_date), "MMM d, yyyy")} • {appointment.appointment_time}
                              </p>
                            </div>
                            <div className="ml-auto font-medium">
                              {new Date(appointment.booked_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 
                                ? "New" 
                                : appointment.status}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">No recent appointments</p>
                      )}
                      <Button variant="outline" className="w-full" onClick={() => router.push("/appointments")}>
                        View all
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>System Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>CPU Usage</div>
                          <div>{systemHealth?.system?.cpu_usage || 0}%</div>
                        </div>
                        <Progress value={systemHealth?.system?.cpu_usage || 0} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Memory Usage</div>
                          <div>{systemHealth?.system?.memory_usage || 0}%</div>
                        </div>
                        <Progress value={systemHealth?.system?.memory_usage || 0} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Disk Usage</div>
                          <div>{systemHealth?.system?.disk_usage || 0}%</div>
                        </div>
                        <Progress value={systemHealth?.system?.disk_usage || 0} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Bot Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Active Bots</p>
                          <p className="text-xs text-muted-foreground">{botCounts?.running || 0} bots running</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Idle Bots</p>
                          <p className="text-xs text-muted-foreground">{botCounts?.stopped || 0} bots idle</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Failed Bots</p>
                          <p className="text-xs text-muted-foreground">{botCounts?.error || 0} bots with errors</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <>
                      <Button 
                        className="w-full justify-between" 
                        variant="outline"
                        onClick={() => router.push("/bots/create")}
                      >
                        <div className="flex items-center">
                          <Bot className="mr-2 h-4 w-4" />
                          Create New Bot
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="w-full justify-between" 
                        variant="outline"
                        onClick={() => router.push("/bots")}
                      >
                        <div className="flex items-center">
                          <Server className="mr-2 h-4 w-4" />
                          Manage Bots
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="w-full justify-between" 
                        variant="outline"
                        onClick={() => router.push("/appointments")}
                      >
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          View Appointments
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics will be displayed here</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics content will be implemented in this module</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generated reports will be displayed here</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Reports content will be implemented in this module</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
